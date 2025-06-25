import { useCallback, useEffect, useState } from 'react';
import { LoginParams, LogoutParams, SsoSessionParams } from '../../../../../api/authentication/types';
import { isTrue } from '../../../../../business/boolean';
import { config } from '../../../../../config';
import { logger } from '../../../../datadog-logs';
import { deleteWebchatHistory, hideAndClearGenesysChat } from '../../../../genesys';
import { httpClient, useApiCallback } from '../../../../hooks/useApi';
import { useCachedAccessKey } from '../../../../hooks/useCachedAccessKey';
import { useClearCookies } from '../../../../hooks/useClearCookies';
import { useSSOCookie } from '../../../../hooks/useCookie';
import { clearSession } from '../../../../hooks/useSessionStorage';
import { initializeAnalyticsUser } from '../../../../mixpanel-tracker';
import { useRouter } from '../../../../router';
import { useTenantContext } from '../../../TenantContext';
import { useRetirementContext } from '../../../retirement/RetirementContext';
import { parseTokenId } from '../../access-token';
import { useAccessToken, useCurrentRealm, useRefreshToken } from '../../hooks';
import { authHeaders } from '../../singleAuth/constants';
import { AuthService, LoginOptions, SoftLogoutOptions } from '../../types';
import { useOpenAmSessionIdleTimer } from './useOpenAmSessionIdleTimer';

export const useOpenAmAuth = (): AuthService => {
  const router = useRouter();
  const { tenant } = useTenantContext();
  const retirement = useRetirementContext();
  const [clearCookies] = useClearCookies();
  const [ssoCookie, setSsoCookie, clearSsoCookie] = useSSOCookie();
  const [accessToken, setAccessToken, clearAccessToken] = useAccessToken();
  const [refreshToken, setRefreshToken, clearRefreshToken] = useRefreshToken();
  const [currentRealm, setCurrentRealm] = useCurrentRealm();
  const cachedAccessKey = useCachedAccessKey();
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken && !!cachedAccessKey.data?.contentAccessKey);

  const loginCb = useApiCallback((api, p: LoginParams) => api.authentication.login(p));
  const logoutCb = useApiCallback((api, p: LogoutParams) => api.authentication.logout(p));
  const linkedMembersCb = useApiCallback(api => api.mdp.linkedMembers());
  const initializeJourneysCb = useApiCallback(api => api.mdp.initializeJourneys());
  const createSessionCb = useApiCallback((api, p: SsoSessionParams) => api.authentication.createSession(p));
  const analyticsParamsCb = useApiCallback((api, contentAccessKey: string) =>
    api.mdp.analyticsParams(contentAccessKey),
  );

  const authSessionIdleTimer = useOpenAmSessionIdleTimer({
    onSessionExpired: async () => {
      await logout();
      await goToExpiredSessionPage();
    },
    sessionId: accessToken ? parseTokenId(accessToken) : accessToken,
  });

  const loading =
    loginCb.loading ||
    logoutCb.loading ||
    linkedMembersCb.loading ||
    createSessionCb.loading ||
    analyticsParamsCb.loading;

  useEffect(() => {
    setIsAuthenticated(!!accessToken && !!cachedAccessKey.data?.contentAccessKey);
  }, [accessToken, cachedAccessKey.data?.contentAccessKey]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!currentRealm) return setCurrentRealm(tenant.realm.value);
    if (currentRealm !== tenant.realm.value) logout();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('authSessionIdleTimer.start() called');
      authSessionIdleTimer.start();
    }
    return authSessionIdleTimer.stop;
  }, [isAuthenticated]);

  const logout = useCallback(async () => {
    try {
      let currentAccessToken = accessToken;
      let currentRefreshToken = refreshToken;

      if (!currentAccessToken || !currentRefreshToken) {
        if (!ssoCookie) {
          throw new Error('SSO Cookie is not set. Cannot create session for logout.');
        }

        const { data } = await createSessionCb.execute({
          tokenId: ssoCookie,
          realm: tenant.realm?.value,
          cookieName: config.value.SSO_COOKIE,
        });

        currentAccessToken = data.accessToken;
        currentRefreshToken = data.refreshToken;
      }

      if (currentAccessToken && currentRefreshToken) {
        await logoutCb.execute({ refreshToken: currentRefreshToken, accessToken: currentAccessToken });
      }
    } catch (e) {
      logger.error('Failed executing the logout service', e as object);
    } finally {
      hideAndClearGenesysChat();
      clearSsoCookie();
      clearCookies();
      clearSession();
      setIsAuthenticated(false);
      authSessionIdleTimer.stop();
    }
  }, [refreshToken, accessToken, ssoCookie, createSessionCb, logoutCb]);

  const softLogout = useCallback(
    async ({ clearChat = true }: SoftLogoutOptions = {}) => {
      if (clearChat) {
        await deleteWebchatHistory();
      }
      clearSession();
    },
    [refreshToken, accessToken],
  );

  async function goToExpiredSessionPage() {
    const expiredSessionUrl = router.getLogoutUrl('epa_logout_url', 'expiredSessionUrl');

    if (expiredSessionUrl) {
      window.location.replace(expiredSessionUrl);
      return;
    }

    logger.warn('Expired session url is not set for Tenant in CMS');
    await router.replace(routes => routes.logout, { shallow: false });
  }

  const setAuthHeader = (bgroup: string[]) => {
    if (process.env.NODE_ENV !== 'production') return;
    // Setting this header prevents OpenAm authentication for Single Auth users
    httpClient.updateHeaders({
      [authHeaders.bgroup]: bgroup.join(','),
    });
  };

  return {
    loading,
    isAuthenticated,
    linkedMembers: linkedMembersCb.result?.data.linkedMembers,
    switchUser: async (api, p) => {
      const result = await api.authentication.switchUser(p);
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setIsAuthenticated(true);
      return result;
    },
    login: async (options?: LoginOptions) => {
      const { userName, password } = options || {};
      const bgroup = tenant?.businessGroup?.values;

      if (!userName || !password) {
        throw new Error('Username and password are required');
      }

      setAuthHeader(bgroup ?? []);

      const result = await loginCb.execute({
        userName: userName,
        password: password,
        businessGroups: bgroup,
        realm: tenant.realm?.value,
      });
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setSsoCookie(parseTokenId(result.data.accessToken), {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        domain: `.${window.location.hostname}`,
      });
      await deleteWebchatHistory();

      try {
        await initializeJourneysCb.execute();
        const accessKeyResult = await cachedAccessKey.fetch('no-check');
        await linkedMembersCb.execute();
        if (accessKeyResult?.schemeType !== 'DC') {
          retirement.init();
        }
        setIsAuthenticated(true);
        await initializeAnalyticsUser(
          analyticsParamsCb,
          'User Login to Assure',
          accessKeyResult?.contentAccessKey
        );
      } catch (err) {
        clearAccessToken();
        clearRefreshToken();
        clearSsoCookie();
        setIsAuthenticated(false);

        throw err;
      }
    },
    loginFromSso: async ({ tokenId }) => {
      setAuthHeader(tenant?.businessGroup?.values ?? []);

      const result = await createSessionCb.execute({
        tokenId,
        realm: tenant.realm?.value,
        cookieName: config.value.SSO_COOKIE,
      });
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);

      try {
        await initializeJourneysCb.execute();
        const accessKeyResult = await cachedAccessKey.fetch('no-check');
        await linkedMembersCb.execute();
        if (accessKeyResult?.schemeType !== 'DC') {
          retirement.init();
        }
        setIsAuthenticated(true);
        await initializeAnalyticsUser(
          analyticsParamsCb,
          'User Login to Assure',
          accessKeyResult?.contentAccessKey
        );
      } catch (err) {
        clearAccessToken();
        clearRefreshToken();
        clearSsoCookie();
        setIsAuthenticated(false);

        throw err;
      }
      return result;
    },
    logout,
    softLogout,
    setIsAuthenticated,
    isSingleAuth: false,
    isAuthenticating: false,
    setIsAuthTasksRunning: async () => {
      throw new Error('Not implemented');
    },
    register: async () => {
      throw new Error('Not implemented');
    },
  };
};
