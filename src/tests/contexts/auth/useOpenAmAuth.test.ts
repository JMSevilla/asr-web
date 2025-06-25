import { config } from '../../../config';
import { useTenantContext } from '../../../core/contexts/TenantContext';
import { parseTokenId } from '../../../core/contexts/auth/access-token';
import { useAccessToken, useCurrentRealm, useRefreshToken } from '../../../core/contexts/auth/hooks';
import { useOpenAmAuth } from '../../../core/contexts/auth/openam/hooks/useOpenAmAuth';
import { useOpenAmSessionIdleTimer } from '../../../core/contexts/auth/openam/hooks/useOpenAmSessionIdleTimer';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { logger } from '../../../core/datadog-logs';
import { deleteWebchatHistory, hideAndClearGenesysChat } from '../../../core/genesys';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useClearCookies } from '../../../core/hooks/useClearCookies';
import { useSSOCookie } from '../../../core/hooks/useCookie';
import { clearSession } from '../../../core/hooks/useSessionStorage';
import { initializeAnalyticsUser } from '../../../core/mixpanel-tracker';
import { useRouter } from '../../../core/router';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({
  config: {
    value: {
      SSO_COOKIE: 'test-sso-cookie',
      INCLUDE_AUTH_HEADER: 'true'
    }
  },
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
}));

jest.mock('../../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn(),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn(),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn(),
  httpClient: {
    updateHeaders: jest.fn(),
  },
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn(),
}));

jest.mock('../../../core/hooks/useClearCookies', () => ({
  useClearCookies: jest.fn(),
}));

jest.mock('../../../core/hooks/useCookie', () => ({
  useSSOCookie: jest.fn(),
}));

jest.mock('../../../core/hooks/useSessionStorage', () => ({
  useSessionStorage: jest.fn(),
  clearSession: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/hooks', () => ({
  useAccessToken: jest.fn(),
  useRefreshToken: jest.fn(),
  useCurrentRealm: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/access-token', () => ({
  parseTokenId: jest.fn(),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../core/genesys', () => ({
  deleteWebchatHistory: jest.fn().mockResolvedValue(undefined),
  hideAndClearGenesysChat: jest.fn(),
}));

jest.mock('../../../core/mixpanel-tracker', () => ({
  initializeAnalyticsUser: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../../core/contexts/auth/openam/hooks/useOpenAmSessionIdleTimer', () => ({
  useOpenAmSessionIdleTimer: jest.fn(),
}));

jest.mock('../../../core/datadog-logs', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useOpenAmAuth', () => {
  // Mock function return values
  const mockSetAccessToken = jest.fn();
  const mockClearAccessToken = jest.fn();
  const mockSetRefreshToken = jest.fn();
  const mockClearRefreshToken = jest.fn();
  const mockSetSSO = jest.fn();
  const mockClearSSO = jest.fn();
  const mockClearCookies = jest.fn();
  const mockSetCurrentRealm = jest.fn();
  const mockTimerStart = jest.fn();
  const mockTimerStop = jest.fn();
  const mockLoginExecute = jest.fn();
  const mockLogoutExecute = jest.fn();
  const mockLinkedMembersExecute = jest.fn();
  const mockInitializeJourneysExecute = jest.fn();
  const mockCreateSessionExecute = jest.fn();
  const mockAnalyticsParamsExecute = jest.fn();
  const mockFetchCachedAccessKey = jest.fn();
  const mockRetirementInit = jest.fn();
  const mockRouterReplace = jest.fn();
  const mockGetLogoutUrl = jest.fn();
  const mockSetIsAuthenticated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'test.example.com',
        replace: jest.fn(),
      },
      writable: true,
    });

    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: {
        realm: { value: 'test-realm' },
        businessGroup: { values: ['WIF'] },
      },
    });

    (useRetirementContext as jest.Mock).mockReturnValue({
      init: mockRetirementInit,
    });

    (useAccessToken as jest.Mock).mockReturnValue(['test-access-token', mockSetAccessToken, mockClearAccessToken]);
    (useRefreshToken as jest.Mock).mockReturnValue(['test-refresh-token', mockSetRefreshToken, mockClearRefreshToken]);
    (useSSOCookie as jest.Mock).mockReturnValue(['test-sso-cookie', mockSetSSO, mockClearSSO]);
    (useClearCookies as jest.Mock).mockReturnValue([mockClearCookies]);
    (useCurrentRealm as jest.Mock).mockReturnValue(['test-realm', mockSetCurrentRealm]);

    (parseTokenId as jest.Mock).mockReturnValue('test-token-id');

    (useOpenAmSessionIdleTimer as jest.Mock).mockReturnValue({
      start: mockTimerStart,
      stop: mockTimerStop,
    });

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
      getLogoutUrl: mockGetLogoutUrl.mockReturnValue('https://logout.example.com/expired'),
      routes: { logout: '/logout' },
    });

    (useCachedAccessKey as jest.Mock).mockReturnValue({
      data: { contentAccessKey: 'test-content-key', schemeType: 'DB' },
      fetch: mockFetchCachedAccessKey.mockResolvedValue({
        contentAccessKey: 'test-content-key',
        schemeType: 'DB',
      }),
    });

    (useApiCallback as jest.Mock).mockImplementation((callback) => {
      const callbackString = callback.toString();

      if (callbackString.includes('login')) {
        return {
          execute: mockLoginExecute.mockResolvedValue({
            data: {
              accessToken: 'new-access-token',
              refreshToken: 'new-refresh-token',
            },
          }),
          loading: false,
        };
      } else if (callbackString.includes('logout')) {
        return {
          execute: mockLogoutExecute.mockResolvedValue({ status: 200 }),
          loading: false,
        };
      } else if (callbackString.includes('linkedMembers')) {
        return {
          execute: mockLinkedMembersExecute.mockResolvedValue({
            data: {
              linkedMembers: [
                { id: 'member1', name: 'Test Member 1' },
                { id: 'member2', name: 'Test Member 2' },
              ],
            },
          }),
          result: {
            data: {
              linkedMembers: [
                { id: 'member1', name: 'Test Member 1' },
                { id: 'member2', name: 'Test Member 2' },
              ],
            },
          },
          loading: false,
        };
      } else if (callbackString.includes('initializeJourneys')) {
        return {
          execute: mockInitializeJourneysExecute.mockResolvedValue({ status: 200 }),
          loading: false,
        };
      } else if (callbackString.includes('createSession')) {
        return {
          execute: mockCreateSessionExecute.mockResolvedValue({
            data: {
              accessToken: 'session-access-token',
              refreshToken: 'session-refresh-token',
            },
          }),
          loading: false,
        };
      } else if (callbackString.includes('analyticsParams')) {
        return {
          execute: mockAnalyticsParamsExecute.mockResolvedValue({
            data: {
              param1: 'value1',
              param2: 'value2',
            },
          }),
          loading: false,
        };
      }

      return { execute: jest.fn().mockResolvedValue({}), loading: false };
    });
  });

  test('should initialize with correct initial states', () => {
    (useAccessToken as jest.Mock).mockReturnValue([null, mockSetAccessToken, mockClearAccessToken]);
    (useCachedAccessKey as jest.Mock).mockReturnValue({
      data: null,
      fetch: mockFetchCachedAccessKey,
    });

    const { result } = renderHook(() => useOpenAmAuth());

    expect(result.current.isSingleAuth).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAuthenticating).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  test('should update authenticated state when access token and access key are present', async () => {
    (useAccessToken as jest.Mock).mockReturnValue(['test-access-token', mockSetAccessToken, mockClearAccessToken]);
    (useCachedAccessKey as jest.Mock).mockReturnValue({
      data: { contentAccessKey: 'test-content-key', schemeType: 'DB' },
      fetch: mockFetchCachedAccessKey,
    });

    const { result } = renderHook(() => useOpenAmAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(mockTimerStart).toHaveBeenCalled();
  });

  test('should call login with correct parameters and in correct order', async () => {
    jest.clearAllMocks();

    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.login({
        userName: 'test-user',
        password: 'test-password',
      });
    });

    expect(mockLoginExecute).toHaveBeenCalledWith({
      userName: 'test-user',
      password: 'test-password',
      businessGroups: ['WIF'],
      realm: 'test-realm',
    });

    expect(mockSetAccessToken).toHaveBeenCalledWith('new-access-token');
    expect(mockSetRefreshToken).toHaveBeenCalledWith('new-refresh-token');
    expect(mockInitializeJourneysExecute).toHaveBeenCalled();
    expect(mockFetchCachedAccessKey).toHaveBeenCalledWith('no-check');
    expect(mockLinkedMembersExecute).toHaveBeenCalled();
    expect(mockRetirementInit).toHaveBeenCalled();
    expect(deleteWebchatHistory).toHaveBeenCalled();
    expect(initializeAnalyticsUser).toHaveBeenCalledWith(
      expect.anything(),
      'User Login to Assure',
      expect.any(String)
    );

    // Verify execution order of critical steps
    const loginOrder = mockLoginExecute.mock.invocationCallOrder[0];
    const setAccessTokenOrder = mockSetAccessToken.mock.invocationCallOrder[0];
    const setRefreshTokenOrder = mockSetRefreshToken.mock.invocationCallOrder[0];
    const initJourneysOrder = mockInitializeJourneysExecute.mock.invocationCallOrder[0];
    const fetchAccessKeyOrder = mockFetchCachedAccessKey.mock.invocationCallOrder[0];
    const linkedMembersOrder = mockLinkedMembersExecute.mock.invocationCallOrder[0];

    expect(loginOrder).toBeLessThan(setAccessTokenOrder);
    expect(loginOrder).toBeLessThan(setRefreshTokenOrder);
    expect(setAccessTokenOrder).toBeLessThan(initJourneysOrder);
    expect(setRefreshTokenOrder).toBeLessThan(initJourneysOrder);
    expect(initJourneysOrder).toBeLessThan(fetchAccessKeyOrder);
    expect(fetchAccessKeyOrder).toBeLessThan(linkedMembersOrder);
  });

  test('should throw error when login called without username or password', async () => {
    const { result } = renderHook(() => useOpenAmAuth());

    await expect(result.current.login({})).rejects.toThrow('Username and password are required');
  });

  test('should call loginFromSso with correct parameters and in correct order', async () => {
    jest.clearAllMocks();

    (config as any).value = {
      SSO_COOKIE: 'test-sso-cookie',
      INCLUDE_AUTH_HEADER: 'true'
    };

    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.loginFromSso({
        tokenId: 'test-sso-token',
        newlyRetiredRange: 0,
        preRetirementAgePeriod: 0
      });
    });

    expect(mockCreateSessionExecute).toHaveBeenCalledWith({
      tokenId: 'test-sso-token',
      realm: 'test-realm',
      cookieName: 'test-sso-cookie',
    });

    expect(mockSetAccessToken).toHaveBeenCalledWith('session-access-token');
    expect(mockSetRefreshToken).toHaveBeenCalledWith('session-refresh-token');
    expect(mockInitializeJourneysExecute).toHaveBeenCalled();
    expect(mockFetchCachedAccessKey).toHaveBeenCalledWith('no-check');
    expect(mockLinkedMembersExecute).toHaveBeenCalled();
    expect(mockRetirementInit).toHaveBeenCalled();

    // Verify execution order of critical steps
    const createSessionOrder = mockCreateSessionExecute.mock.invocationCallOrder[0];
    const setAccessTokenOrder = mockSetAccessToken.mock.invocationCallOrder[0];
    const setRefreshTokenOrder = mockSetRefreshToken.mock.invocationCallOrder[0];
    const initJourneysOrder = mockInitializeJourneysExecute.mock.invocationCallOrder[0];
    const fetchAccessKeyOrder = mockFetchCachedAccessKey.mock.invocationCallOrder[0];
    const linkedMembersOrder = mockLinkedMembersExecute.mock.invocationCallOrder[0];

    expect(createSessionOrder).toBeLessThan(setAccessTokenOrder);
    expect(createSessionOrder).toBeLessThan(setRefreshTokenOrder);
    expect(setAccessTokenOrder).toBeLessThan(initJourneysOrder);
    expect(setRefreshTokenOrder).toBeLessThan(initJourneysOrder);
    expect(initJourneysOrder).toBeLessThan(fetchAccessKeyOrder);
    expect(fetchAccessKeyOrder).toBeLessThan(linkedMembersOrder);
  });

  test('should call logout with existing tokens', async () => {
    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockLogoutExecute).toHaveBeenCalledWith({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    });
    expect(hideAndClearGenesysChat).toHaveBeenCalled();
    expect(mockClearSSO).toHaveBeenCalled();
    expect(mockClearCookies).toHaveBeenCalled();
    expect(clearSession).toHaveBeenCalled();
    expect(mockTimerStop).toHaveBeenCalled();
  });

  test('should create new session for logout when tokens are missing', async () => {
    (useAccessToken as jest.Mock).mockReturnValue([null, mockSetAccessToken, mockClearAccessToken]);
    (useRefreshToken as jest.Mock).mockReturnValue([null, mockSetRefreshToken]);

    (config as any).value = {
      SSO_COOKIE: 'test-sso-cookie',
      INCLUDE_AUTH_HEADER: 'true'
    };

    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockCreateSessionExecute).toHaveBeenCalledWith({
      tokenId: 'test-sso-cookie',
      realm: 'test-realm',
      cookieName: 'test-sso-cookie',
    });
    expect(mockLogoutExecute).toHaveBeenCalledWith({
      accessToken: 'session-access-token',
      refreshToken: 'session-refresh-token',
    });
    expect(hideAndClearGenesysChat).toHaveBeenCalled();
    expect(mockClearSSO).toHaveBeenCalled();
    expect(mockClearCookies).toHaveBeenCalled();
    expect(clearSession).toHaveBeenCalled();
  });

  test('should throw error during logout when tokens and SSO cookie are missing', async () => {
    (useAccessToken as jest.Mock).mockReturnValue([null, mockSetAccessToken, mockClearAccessToken]);
    (useRefreshToken as jest.Mock).mockReturnValue([null, mockSetRefreshToken]);
    (useSSOCookie as jest.Mock).mockReturnValue([null, mockSetSSO, mockClearSSO]);

    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(hideAndClearGenesysChat).toHaveBeenCalled();
    expect(mockClearSSO).toHaveBeenCalled();
    expect(mockClearCookies).toHaveBeenCalled();
    expect(clearSession).toHaveBeenCalled();
  });

  test('should handle softLogout correctly', async () => {
    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.softLogout({ clearChat: true });
    });

    expect(deleteWebchatHistory).toHaveBeenCalled();
    expect(clearSession).toHaveBeenCalled();
  });

  test('should verify realm on authentication and logout if realms don\'t match', async () => {
    (useCurrentRealm as jest.Mock).mockReturnValue(['different-realm', mockSetCurrentRealm]);
    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: {
        realm: { value: 'test-realm' },
        businessGroup: { values: ['WIF'] },
      },
    });

    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockLogoutExecute).toHaveBeenCalled();
  });

  test('should set the current realm if it\'s not set yet', async () => {
    (useCurrentRealm as jest.Mock).mockReturnValue([undefined, mockSetCurrentRealm]);

    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetCurrentRealm).toHaveBeenCalledWith('test-realm');
  });

  test('should handle session expiration', async () => {
    let sessionExpiredCallback: () => Promise<void>;
    (useOpenAmSessionIdleTimer as jest.Mock).mockImplementation(({ onSessionExpired }) => {
      sessionExpiredCallback = onSessionExpired;
      return {
        start: mockTimerStart,
        stop: mockTimerStop,
      };
    });

    renderHook(() => useOpenAmAuth());

    await act(async () => {
      if (sessionExpiredCallback) {
        await sessionExpiredCallback();
      }
    });

    expect(mockLogoutExecute).toHaveBeenCalled();
    expect(mockGetLogoutUrl).toHaveBeenCalledWith('epa_logout_url', 'expiredSessionUrl');
    expect(window.location.replace).toHaveBeenCalledWith('https://logout.example.com/expired');
  });

  test('should fall back to router.replace when expired session URL is not set', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
      getLogoutUrl: mockGetLogoutUrl.mockReturnValue(undefined),
      routes: { logout: '/logout' },
    });

    let sessionExpiredCallback: () => Promise<void>;
    (useOpenAmSessionIdleTimer as jest.Mock).mockImplementation(({ onSessionExpired }) => {
      sessionExpiredCallback = onSessionExpired;
      return {
        start: mockTimerStart,
        stop: mockTimerStop,
      };
    });

    renderHook(() => useOpenAmAuth());

    await act(async () => {
      if (sessionExpiredCallback) {
        await sessionExpiredCallback();
      }
    });

    expect(logger.warn).toHaveBeenCalledWith('Expired session url is not set for Tenant in CMS');
    expect(mockRouterReplace).toHaveBeenCalled();
  });

  test('should initialize retirement context when schemeType is not DC', async () => {
    jest.clearAllMocks();

    mockFetchCachedAccessKey.mockResolvedValue({
      contentAccessKey: 'test-content-key',
      schemeType: 'DB' // Non-DC scheme type
    });

    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.login({
        userName: 'test-user',
        password: 'test-password',
      });
    });

    expect(mockRetirementInit).toHaveBeenCalled();
  });

  test('should not initialize retirement context when schemeType is DC', async () => {
    jest.clearAllMocks();

    mockFetchCachedAccessKey.mockResolvedValue({
      contentAccessKey: 'test-content-key',
      schemeType: 'DC' // DC scheme type
    });

    const { result } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.login({
        userName: 'test-user',
        password: 'test-password',
      });
    });

    expect(mockRetirementInit).not.toHaveBeenCalled();
  });

  test('should initialize retirement context based on schemeType for loginFromSso', async () => {
    jest.clearAllMocks();

    (config as any).value = {
      SSO_COOKIE: 'test-sso-cookie',
      INCLUDE_AUTH_HEADER: 'true'
    };

    mockFetchCachedAccessKey.mockResolvedValue({
      contentAccessKey: 'test-content-key',
      schemeType: 'DB'
    });

    let { result, unmount } = renderHook(() => useOpenAmAuth());

    await act(async () => {
      await result.current.loginFromSso({
        tokenId: 'test-sso-token',
        newlyRetiredRange: 0,
        preRetirementAgePeriod: 0
      });
    });

    expect(mockRetirementInit).toHaveBeenCalled();

    // Clean up
    unmount();
    jest.clearAllMocks();

    mockFetchCachedAccessKey.mockResolvedValue({
      contentAccessKey: 'test-content-key',
      schemeType: 'DC'
    });

    ({ result } = renderHook(() => useOpenAmAuth()));

    await act(async () => {
      await result.current.loginFromSso({
        tokenId: 'test-sso-token',
        newlyRetiredRange: 0,
        preRetirementAgePeriod: 0
      });
    });

    expect(mockRetirementInit).not.toHaveBeenCalled();
  });

  test('should clear tokens and cookies when login throws an error during access key fetch', async () => {
    const fetchError = new Error('fetch failed');
    mockFetchCachedAccessKey.mockRejectedValue(fetchError);

    const mockClearRefreshToken = jest.fn();
    (useRefreshToken as jest.Mock).mockReturnValue([
      'test-refresh-token',
      mockSetRefreshToken,
      mockClearRefreshToken,
    ]);

    const { result } = renderHook(() => useOpenAmAuth());

    let caughtError;
    await act(async () => {
      try {
        await result.current.login({ userName: 'test-user', password: 'test-password' });
      } catch (e) {
        caughtError = e;
      }
    });

    expect(caughtError).toBe(fetchError);
    expect(mockClearAccessToken).toHaveBeenCalled();
    expect(mockClearRefreshToken).toHaveBeenCalled();
    expect(mockClearSSO).toHaveBeenCalled();
  });

  test('should clear tokens and cookies when loginFromSso throws an error during access key fetch', async () => {
    const ssoFetchError = new Error('SSO fetch failed');
    mockFetchCachedAccessKey.mockRejectedValue(ssoFetchError);

    const mockClearRefreshToken = jest.fn();
    (useRefreshToken as jest.Mock).mockReturnValue([
      'session-refresh-token',
      mockSetRefreshToken,
      mockClearRefreshToken,
    ]);

    mockCreateSessionExecute.mockResolvedValue({
      data: { accessToken: 'session-access-token', refreshToken: 'session-refresh-token' },
    });

    const { result } = renderHook(() => useOpenAmAuth());

    let caughtError;
    await act(async () => {
      try {
        await result.current.loginFromSso({
          tokenId: 'test-sso-token',
          newlyRetiredRange: 0,
          preRetirementAgePeriod: 0,
        });
      } catch (e) {
        caughtError = e;
      }
    });

    expect(caughtError).toBe(ssoFetchError);
    expect(mockClearAccessToken).toHaveBeenCalled();
    expect(mockClearRefreshToken).toHaveBeenCalled();
    expect(mockClearSSO).toHaveBeenCalled();
  });
});
