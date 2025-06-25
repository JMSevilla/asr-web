import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { usePageLoaderContext } from '../../../core/contexts/PageLoaderContext';
import { useTenantContext } from '../../../core/contexts/TenantContext';
import { parseSingleAuthIdToken } from '../../../core/contexts/auth/access-token';
import { useAccessToken, useCurrentRealm } from '../../../core/contexts/auth/hooks';
import { authorityUrl, policies, urls } from '../../../core/contexts/auth/singleAuth/constants';
import { useClientCountryIds } from '../../../core/contexts/auth/singleAuth/hooks/useClientCountryIds';
import { useSingleAuth } from '../../../core/contexts/auth/singleAuth/hooks/useSingleAuth';
import { useSingleAuthSessionIdleTimer } from '../../../core/contexts/auth/singleAuth/hooks/useSingleAuthSessionIdleTimer';
import { useSingleAuthStorage } from '../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { logger } from '../../../core/datadog-logs';
import { deleteWebchatHistory, hideAndClearGenesysChat } from '../../../core/genesys';
import { useClearCookies } from '../../../core/hooks/useClearCookies';
import { clearSession } from '../../../core/hooks/useSessionStorage';
import { useRouter } from '../../../core/router';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
  useIsAuthenticated: jest.fn(),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn(),
}));

jest.mock('../../../core/contexts/PageLoaderContext', () => ({
  usePageLoaderContext: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/hooks', () => ({
  useAccessToken: jest.fn(),
  useCurrentRealm: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage', () => ({
  useSingleAuthStorage: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/singleAuth/hooks/useSingleAuthSessionIdleTimer', () => ({
  useSingleAuthSessionIdleTimer: jest.fn(),
}));

jest.mock('../../../core/genesys', () => ({
  deleteWebchatHistory: jest.fn().mockResolvedValue(undefined),
  hideAndClearGenesysChat: jest.fn(),
}));

jest.mock('../../../core/hooks/useClearCookies', () => ({
  useClearCookies: jest.fn(),
}));

jest.mock('../../../core/hooks/useSessionStorage', () => ({
  clearSession: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/access-token', () => ({
  parseSingleAuthIdToken: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/singleAuth/hooks/useClientCountryIds', () => ({
  useClientCountryIds: jest.fn(),
}));

jest.mock('../../../core/datadog-logs', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useSingleAuth', () => {
  const mockSetAccessToken = jest.fn();
  const mockSetCurrentRealm = jest.fn();
  const mockClearAccessToken = jest.fn();
  const mockSetSAData = jest.fn();
  const mockPush = jest.fn();
  const mockGetLogoutUrl = jest.fn();
  const mockSetIsLoading = jest.fn();
  const mockLoginRedirect = jest.fn();
  const mockLogoutRedirect = jest.fn();
  const mockHandleRedirectPromise = jest.fn();
  const mockGetActiveAccount = jest.fn();
  const mockAcquireTokenSilent = jest.fn();
  const mockClearCookies = jest.fn();
  const mockTimerStart = jest.fn();
  const mockTimerStop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        hash: '',
        origin: 'https://example.com',
      },
      writable: true,
    });

    // Setup mocks
    (useAccessToken as jest.Mock).mockReturnValue(['test-token', mockSetAccessToken, mockClearAccessToken]);

    (useSingleAuthStorage as jest.Mock).mockReturnValue([
      { primaryBgroup: 'WIF', primaryRefno: '0000001', b2cPolicyId: 'B2C_1_signin' },
      mockSetSAData,
    ]);

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      getLogoutUrl: mockGetLogoutUrl.mockReturnValue('https://logout.com'),
    });

    (usePageLoaderContext as jest.Mock).mockReturnValue({
      setIsLoading: mockSetIsLoading,
    });

    (useMsal as jest.Mock).mockReturnValue({
      instance: {
        loginRedirect: mockLoginRedirect,
        logoutRedirect: mockLogoutRedirect,
        handleRedirectPromise: mockHandleRedirectPromise,
        getActiveAccount: mockGetActiveAccount,
        acquireTokenSilent: mockAcquireTokenSilent,
      },
      inProgress: InteractionStatus.None,
      accounts: [],
    });

    (useIsAuthenticated as jest.Mock).mockReturnValue(false);

    (useClearCookies as jest.Mock).mockReturnValue([mockClearCookies]);

    (useSingleAuthSessionIdleTimer as jest.Mock).mockReturnValue({
      start: mockTimerStart,
      stop: mockTimerStop,
    });

    (useClientCountryIds as jest.Mock).mockReturnValue({
      idv: 'GB',
    });

    (parseSingleAuthIdToken as jest.Mock).mockReturnValue({
      acr: 'b2c_1_signin',
      sub: 'test-auth-guid',
      userIdType: 'S',
    });

    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: {
        realm: { value: 'test-realm' },
        businessGroup: { values: ['WIF'] },
      },
    });

    (useCurrentRealm as jest.Mock).mockReturnValue(['test-realm', mockSetCurrentRealm]);
  });

  test('should initialize with correct initial states', () => {
    (useSingleAuthStorage as jest.Mock).mockReturnValue([
      {
        b2cPolicyId: 'B2C_1_signin'
      },
      mockSetSAData,
    ]);

    const { result } = renderHook(() => useSingleAuth());

    expect(result.current.isSingleAuth).toBe(true);
    expect(result.current.isAuthenticating).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  test('should update authenticated state when all required data is present', async () => {
    (useSingleAuthStorage as jest.Mock).mockReturnValue([
      { primaryBgroup: 'WIF', primaryRefno: '0000001', b2cPolicyId: 'B2C_1_signin' },
      mockSetSAData,
    ]);
    (useAccessToken as jest.Mock).mockReturnValue(['test-token', mockSetAccessToken, mockClearAccessToken]);

    const { result } = renderHook(() => useSingleAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(mockTimerStart).toHaveBeenCalled();
  });

  test('should call login with correct parameters', async () => {
    const { result } = renderHook(() => useSingleAuth());

    const onError = jest.fn();

    await act(async () => {
      await result.current.login({ onError, email: 'test@example.com' });
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockLoginRedirect).toHaveBeenCalledWith({
      scopes: [],
      authority: `${authorityUrl}/${policies.login}`,
      redirectUri: urls.signin_holding,
      extraQueryParameters: expect.objectContaining({
        login_hint: 'test@example.com',
        clientCountryId: 'GB',
      }),
    });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  test('should call register with correct parameters', async () => {
    const { result } = renderHook(() => useSingleAuth());

    const onError = jest.fn();

    await act(async () => {
      await result.current.register({ onError, email: 'test@example.com', overrideClientCountryId: 'US' });
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockLoginRedirect).toHaveBeenCalledWith({
      scopes: [],
      authority: `${authorityUrl}/${policies.register}`,
      redirectUri: urls.signup_holding,
      extraQueryParameters: expect.objectContaining({
        login_hint: 'test@example.com',
        clientCountryId: 'US',
      }),
    });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  test('should call logout with correct cleanup', async () => {
    const { result } = renderHook(() => useSingleAuth());

    const onError = jest.fn();

    await act(async () => {
      await result.current.logout({ onError });
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(hideAndClearGenesysChat).toHaveBeenCalled();
    expect(mockClearCookies).toHaveBeenCalled();
    expect(clearSession).toHaveBeenCalled();
    expect(mockTimerStop).toHaveBeenCalled();
    expect(mockLogoutRedirect).toHaveBeenCalledWith({
      authority: `${authorityUrl}/B2C_1_signin`,
      postLogoutRedirectUri: 'https://logout.com',
    });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  test('should handle softLogout correctly', async () => {
    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await result.current.softLogout({ clearChat: true });
    });

    expect(deleteWebchatHistory).toHaveBeenCalled();
    expect(clearSession).toHaveBeenCalled();
  });

  test('should handle redirect response with token', async () => {
    // Setup hash with token
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        hash: '#id_token=test-id-token',
        origin: 'https://example.com',
      },
      writable: true,
    });

    (mockHandleRedirectPromise as jest.Mock).mockResolvedValue({ idToken: 'test-id-token-from-redirect' });

    const { result } = renderHook(() => useSingleAuth());

    // Fast-forward through effects
    await act(async () => {
      // Wait for handleRedirect to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetAccessToken).toHaveBeenCalledWith(expect.any(String));
    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));
    expect(mockPush).toHaveBeenCalledWith(urls.signin_holding);
  });

  test('should handle error redirect', async () => {
    // Setup hash with error
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        hash: '#error=login_failed&error_description=Authentication+failed',
        origin: 'https://example.com',
      },
      writable: true,
    });

    const { result } = renderHook(() => useSingleAuth());

    // Fast-forward through effects
    await act(async () => {
      // Wait for handleRedirect to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockLogoutRedirect).toHaveBeenCalled();
  });

  it('should set isAdmin=true when token.claims.userIdType is "A"', async () => {
    (parseSingleAuthIdToken as jest.Mock).mockReturnValue({
      acr: 'b2c_1_signin',
      sub: 'admin-auth-guid',
      userIdType: 'A',
    });

    mockHandleRedirectPromise.mockResolvedValue({ idToken: 'admin-id-token' });
    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    mockSetSAData.mockClear();

    const { result } = renderHook(() => useSingleAuth());
    await act(async () => {
      await new Promise(res => setTimeout(res, 0));
    });

    expect(mockSetSAData).toHaveBeenCalled();
    const updater = mockSetSAData.mock.calls[0][0] as (old: any) => any;
    const newSA = updater({});
    expect(newSA.isAdmin).toBe(true);
    expect(newSA.authGuid).toBe('admin-auth-guid');
  });

  test('should handle new account registration redirect', async () => {
    (parseSingleAuthIdToken as jest.Mock).mockReturnValue({
      acr: 'b2c_1_signup',
      sub: 'test-auth-guid',
      externalId: 'external-id-123',
      userIdType: 'S',
    });

    mockHandleRedirectPromise.mockResolvedValue({ idToken: 'test-id-token-new-account' });
    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    (useSingleAuthStorage as jest.Mock).mockReturnValue([
      { primaryBgroup: '', primaryRefno: '', b2cPolicyId: 'B2C_1_signin' },
      mockSetSAData,
    ]);

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        hash: '#id_token=test-id-token-new-account',
        origin: 'https://example.com',
      },
      writable: true,
    });

    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));
    expect(mockPush).toHaveBeenCalledWith(urls.signup_holding);
  });

  test('should skip registration redirect onse primary bgroup and refno is set', async () => {
    (parseSingleAuthIdToken as jest.Mock).mockReturnValue({
      acr: 'b2c_1_signup',
      sub: 'test-auth-guid',
      externalId: 'external-id-123',
      userIdType: 'S',
    });

    mockHandleRedirectPromise.mockResolvedValue({ idToken: 'test-id-token-new-account' });
    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    (useSingleAuthStorage as jest.Mock).mockReturnValue([
      { primaryBgroup: 'bgroup', primaryRefno: 'refno', b2cPolicyId: 'B2C_1_signin' },
      mockSetSAData,
    ]);

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        hash: '#id_token=test-id-token-new-account',
        origin: 'https://example.com',
      },
      writable: true,
    });

    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));
    expect(mockPush).toHaveBeenCalledWith(urls.signin_holding);
  });

  test('should try getting token from active session when redirect response fails', async () => {
    mockHandleRedirectPromise.mockRejectedValue(new Error('No redirect response'));
    mockGetActiveAccount.mockReturnValue({ username: 'test@example.com' });
    mockAcquireTokenSilent.mockResolvedValue({ idToken: 'test-token-silent' });

    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(mockAcquireTokenSilent).toHaveBeenCalled();
    expect(mockSetAccessToken).toHaveBeenCalledWith(expect.any(String));
  });

  test('should handle failure in both redirect and silent token acquisition', async () => {
    mockHandleRedirectPromise.mockRejectedValue(new Error('No redirect response'));
    mockGetActiveAccount.mockReturnValue(null);
    mockAcquireTokenSilent.mockRejectedValue(new Error('No account'));

    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(mockClearAccessToken).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(urls.error);
  });

  test('should verify realm on authentication and logout if realms don\'t match', async () => {
    (useCurrentRealm as jest.Mock).mockReturnValue(['different-realm', mockSetCurrentRealm]);
    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: {
        realm: { value: 'test-realm' },
        businessGroup: { values: ['WIF'] },
      },
    });
    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(logger.error).toHaveBeenCalledWith('AUTH_REALM_MISMATCH', {
      currentRealm: 'different-realm',
      tenantRealm: 'test-realm'
    });

    expect(mockLogoutRedirect).toHaveBeenCalled();
  });

  test('should set current realm when authenticated and current realm is missing', async () => {
    (useCurrentRealm as jest.Mock).mockReturnValue([undefined, mockSetCurrentRealm]);
    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: {
        realm: { value: 'test-realm' },
        businessGroup: { values: ['WIF'] },
      },
    });
    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(mockSetCurrentRealm).toHaveBeenCalledWith('test-realm');
    expect(mockLogoutRedirect).not.toHaveBeenCalled();
  });

  test('should not check realm when status is not authenticated in MSAL', async () => {
    (useCurrentRealm as jest.Mock).mockReturnValue(['different-realm', mockSetCurrentRealm]);
    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: {
        realm: { value: 'test-realm' },
        businessGroup: { values: ['WIF'] },
      },
    });

    (useIsAuthenticated as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(mockLogoutRedirect).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  test('should logout when tenant realm is missing but current realm exists', async () => {
    (useCurrentRealm as jest.Mock).mockReturnValue(['some-realm', mockSetCurrentRealm]);

    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: {
        businessGroup: { values: ['WIF'] },
      },
    });

    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useSingleAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    expect(logger.error).toHaveBeenCalledWith('AUTH_REALM_MISMATCH', {
      currentRealm: 'some-realm',
      tenantRealm: 'undefined'
    });
    expect(mockLogoutRedirect).toHaveBeenCalled();
  });
});