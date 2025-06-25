import { InteractionStatus, IPublicClientApplication } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { isFunction } from '../../../../../business/boolean';
import { logger } from '../../../../datadog-logs';
import { deleteWebchatHistory, hideAndClearGenesysChat } from '../../../../genesys';
import { useClearCookies } from '../../../../hooks/useClearCookies';
import { clearSession } from '../../../../hooks/useSessionStorage';
import { useRouter } from '../../../../router';
import { usePageLoaderContext } from '../../../PageLoaderContext';
import { useTenantContext } from '../../../TenantContext';
import { parseSingleAuthIdToken } from '../../access-token';
import { useAccessToken, useCurrentRealm } from '../../hooks';
import { AuthService, LoginOptions, LogoutOptions, RegisterOptions, SoftLogoutOptions } from '../../types';
import { authorityUrl, policies, urls } from '../constants';
import { useClientCountryIds } from './useClientCountryIds';
import { useSingleAuthSessionIdleTimer } from './useSingleAuthSessionIdleTimer';
import { useSingleAuthStorage } from './useSingleAuthStorage';
import { caseInsensitiveEquals } from '../../../../../business/strings';

interface AuthResult {
  token: string;
  policy: string;
  authGuid: string;
  externalId?: string;
  targetUrl?: string;
  registrationCode?: string;
  userIdType?: string;
}

/**
 * @description
 * This hook is responsible for handling the authentication state and actions for the SingleAuth flow.
 * It provides the necessary methods to launch MSAL login, register, and logout.
 * It also handles the redirection from Single Auth Azure AD B2C after the authentication process.
 * It sets the access token and the B2C policy ID in the session storage then redirects to the appropriate page.
 *
 * @returns {AuthService}
 */
export const useSingleAuth = (): AuthService => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthTasksRunning, setIsAuthTasksRunning] = useState(false);
  const { push, getLogoutUrl } = useRouter();
  const [accessToken, setAccessToken, clearAccessToken] = useAccessToken();
  const [saData, setSAData] = useSingleAuthStorage();
  const pageLoader = usePageLoaderContext();
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticatedMsal = useIsAuthenticated();
  const [clearCookies] = useClearCookies();
  const clientCountryId = useClientCountryIds();
  const { tenant } = useTenantContext();
  const [currentRealm, setCurrentRealm] = useCurrentRealm();

  const extraQueryParams = {
    extraQueryParameters: {
      clientCountryId: clientCountryId.idv,
      ui_locales: 'en-GB',
      cancel_redirect_uri: typeof window !== 'undefined' ? window.location.origin + urls.cancel : '',
    },
  };

  const epaLogoutUrl = getLogoutUrl('epa_logout_url', 'logoutUrl');

  const logoutCleanup = async (): Promise<void> => {
    hideAndClearGenesysChat();
    clearCookies();
    clearSession();
  };

  function isLogoutPath() {
    const path = window.location.pathname;
    return path.includes(urls.logout);
  }

  function createAuthResult(token: string, claims: any): AuthResult {
    return {
      token,
      policy: claims.acr.toLowerCase(),
      authGuid: claims.sub,
      ...(claims.externalId ? { externalId: claims.externalId } : {}),
      ...(claims.targetUrl ? { targetUrl: claims.targetUrl } : {}),
      ...(claims.RegistrationCode ? { registrationCode: claims.RegistrationCode } : {}),
      ...(claims.userIdType ? { userIdType: claims.userIdType } : {}),
    };
  }

  async function tryTokenFromRedirectResponse(instance: IPublicClientApplication): Promise<AuthResult> {
    const redirectResponse = await instance.handleRedirectPromise();
    const accessToken = redirectResponse?.idToken as string;

    if (!accessToken) {
      throw new Error('No access token in redirect response');
    }

    const claims = parseSingleAuthIdToken(accessToken);
    return createAuthResult(accessToken, claims);
  }

  async function tryTokenFromActiveSession(instance: IPublicClientApplication): Promise<AuthResult> {
    const account = instance.getActiveAccount() || accounts[0];

    if (!account) {
      throw new Error('No active account found');
    }

    const response = await instance.acquireTokenSilent({
      scopes: [],
      account: account,
    });

    const accessToken = response.idToken;
    if (!accessToken) {
      throw new Error('No access token in silent response');
    }

    const claims = parseSingleAuthIdToken(accessToken);
    return createAuthResult(accessToken, claims);
  }

  async function getAuthenticationResult(idToken?: string, instance?: IPublicClientApplication): Promise<AuthResult> {
    // Handle cross-domain redirect scenario
    if (idToken) {
      const claims = parseSingleAuthIdToken(idToken);
      return createAuthResult(idToken, claims);
    }

    // Validate MSAL instance for same-domain scenario
    if (!instance) {
      throw new Error('No MSAL instance provided');
    }

    // Same domain scenario
    return tryTokenFromRedirectResponse(instance)
      .catch(error => {
        logger.warn('AUTH_TOKEN_REDIRECT_ACQUIRE_WARN', { error });
        return tryTokenFromActiveSession(instance);
      })
      .catch(error => {
        logger.warn('AUTH_TOKEN_SILENT_ACQUIRE_WARN', { error });
        throw new Error(`Failed to acquire access token: ${error.message}`);
      });
  }

  async function login(options?: LoginOptions) {
    const { onError, email, cancelUri } = options || {};
    pageLoader.setIsLoading(true);

    try {
      await instance.loginRedirect({
        scopes: [],
        authority: `${authorityUrl}/${policies.login}`,
        redirectUri: urls.signin_holding,
        extraQueryParameters: {
          ...extraQueryParams.extraQueryParameters,
          login_hint: email || '',
          clientCountryId: clientCountryId.idv,
          cancel_redirect_uri: cancelUri || (epaLogoutUrl as string),
          prompt: 'login',
        },
      });
    } catch (error) {
      logger.error('AUTH_LOGIN_ERROR', error as object);
      if (onError && isFunction(onError)) {
        onError();
      }
    } finally {
      pageLoader.setIsLoading(false);
    }
  }

  async function register(options?: RegisterOptions) {
    const { onError, email, cancelUri, overrideClientCountryId } = options || {};
    pageLoader.setIsLoading(true);

    try {
      await instance.loginRedirect({
        scopes: [],
        authority: `${authorityUrl}/${policies.register}`,
        redirectUri: urls.signup_holding,
        extraQueryParameters: {
          ...extraQueryParams.extraQueryParameters,
          login_hint: email || '',
          clientCountryId: overrideClientCountryId || clientCountryId.idv,
          cancel_redirect_uri: cancelUri || (epaLogoutUrl as string),
        },
      });
    } catch (error) {
      logger.error('AUTH_REGISTER_ERROR', error as object);
      if (onError && isFunction(onError)) {
        onError();
      }
    } finally {
      pageLoader.setIsLoading(false);
    }
  }

  async function logout(options?: LogoutOptions) {
    const { onError, postLogoutRedirectUri } = options || {};
    pageLoader.setIsLoading(true);
    logoutCleanup();
    authSessionIdleTimer.stop();

    try {
      await instance.logoutRedirect({
        authority: `${authorityUrl}/${saData.b2cPolicyId || policies.login}`,
        postLogoutRedirectUri: postLogoutRedirectUri || epaLogoutUrl || urls.cancel,
      });
    } catch (error) {
      logger.error('AUTH_LOGOUT_ERROR', error as object);
      if (onError && isFunction(onError)) {
        onError();
      }
    } finally {
      pageLoader.setIsLoading(false);
    }
  }

  async function softLogout({ clearChat = true }: SoftLogoutOptions = {}) {
    if (clearChat) {
      await deleteWebchatHistory();
    }
    clearSession();
  }

  const authSessionIdleTimer = useSingleAuthSessionIdleTimer({
    onSessionExpired: async () => {
      await logout();
    },
  });

  function getAuthIdToken() {
    const hash = window.location.hash.substring(1);
    return new URLSearchParams(hash).get('id_token');
  }

  async function handleErrorRedirect() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (error || errorDescription) {
      logger.error('AUTH_REDIRECT_ERROR', { error, errorDescription });
      await logout();
      return true;
    }

    return false;
  }

  async function handleRedirect(idToken?: string) {
    try {
      setIsAuthenticating(true);
      const authResult = await getAuthenticationResult(idToken, instance);

      setAccessToken(authResult.token);

      const isNewAccount = authResult.externalId && !saData.primaryBgroup && !saData.primaryRefno;
      setSAData(saData => ({
        ...saData,
        b2cPolicyId: authResult.policy,
        authGuid: authResult.authGuid,
        ...(authResult.userIdType && { isAdmin: caseInsensitiveEquals(authResult.userIdType, 'A') }),
        ...(isNewAccount && { isNewAccount: true }),
        ...(authResult.targetUrl && { nextUrl: authResult.targetUrl }),
        ...(authResult.registrationCode && { registrationCode: authResult.registrationCode }),
      }));

      if (isNewAccount) {
        await push(urls.signup_holding);
      } else {
        await push(urls.signin_holding);
      }
    } catch (error) {
      clearAccessToken();
      await push(urls.error);
      logger.error('AUTH_INITIAL_ERROR', error as object);
    } finally {
      setIsAuthenticating(false);
    }
  }

  useEffect(() => {
    const checkRealm = async () => {
      if (!isAuthenticatedMsal) return;

      if (!currentRealm && tenant?.realm?.value) {
        setCurrentRealm(tenant.realm.value);
        return;
      }

      if (currentRealm && (!tenant?.realm?.value || currentRealm !== tenant.realm.value)) {
        logger.error('AUTH_REALM_MISMATCH', {
          currentRealm,
          tenantRealm: tenant?.realm?.value || 'undefined'
        });
        await logout();
      }
    };

    checkRealm();
  }, [isAuthenticatedMsal, tenant?.realm?.value, currentRealm]);

  useEffect(() => {
    const handleAuthStateChange = async () => {
      // Skip if MSAL is processing something
      if (inProgress !== InteractionStatus.None) {
        return;
      }

      // Check for errors from Single Auth redirect
      if (window.location.hash.includes('error')) {
        const errorHandled = await handleErrorRedirect();
        if (errorHandled) {
          return;
        }
      }

      // Check if we're on a logout path - if so, don't continue with post auth flow
      if (isLogoutPath()) {
        setIsAuthenticating(false);
        return;
      }

      // Handle post Single Auth redirect
      const idToken = getAuthIdToken() || undefined;
      if ((isAuthenticatedMsal || idToken) && !isAuthenticated) {
        await handleRedirect(idToken);
      } else {
        setIsAuthenticating(false);
      }
    };

    handleAuthStateChange();
  }, [inProgress, isAuthenticatedMsal, isAuthenticated]);

  useEffect(() => {
    // In Single Auth flow, majority of APIs require the BGROUP and REFNO to be sent as headers.
    // So the isAuthenticated state is also dependent on the presence of these values.
    setIsAuthenticated(!!accessToken && !!saData.primaryBgroup && !!saData.primaryRefno && !isAuthTasksRunning);
  }, [accessToken, saData.primaryBgroup, saData.primaryRefno, isAuthTasksRunning]);

  useEffect(() => {
    if (isAuthenticated) authSessionIdleTimer.start();
    return authSessionIdleTimer.stop;
  }, [isAuthenticated]);

  return {
    isSingleAuth: true,
    loading: isAuthTasksRunning,
    isAuthenticating: isAuthenticating,
    isAuthenticated: isAuthenticated,
    linkedMembers: [],
    login,
    logout,
    register,
    softLogout,
    setIsAuthenticated,
    setIsAuthTasksRunning,
    loginFromSso: async () => {
      throw new Error('Not implemented');
    },
    switchUser: async () => {
      throw new Error('Not implemented');
    },
  };
};
