import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { SingleAuthDirectRoutes } from '../../../components';
import { findBlockByKey } from '../../../components/blocks/sso/utils';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { useAccessToken } from '../../../core/contexts/auth/hooks';
import { useClientCountryIds } from '../../../core/contexts/auth/singleAuth/hooks/useClientCountryIds';
import { useSingleAuthStorage } from '../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useRouter } from '../../../core/router';
import { render, waitFor } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn().mockImplementation(() => ({
    instance: null,
    inProgress: InteractionStatus.None,
  })),
}));

jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/hooks', () => ({
  useAccessToken: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage', () => ({
  useSingleAuthStorage: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/singleAuth/hooks/useClientCountryIds', () => ({
  useClientCountryIds: jest.fn().mockReturnValue({
    idv: 'mock-idv-value',
    workEmail: 'mock-work-email-value',
    sso: 'mock-sso-value',
  }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn(),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../components/blocks/sso/utils', () => ({
  findBlockByKey: jest.fn(),
}));

jest.mock('../../../core/datadog-logs', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('SingleAuthDirectRoutes', () => {
  const mockMsalInstance = {
    acquireTokenSilent: jest.fn(),
    loginRedirect: jest.fn(),
    logoutRedirect: jest.fn(),
  };

  const mockLogin = jest.fn();
  const mockRegister = jest.fn();
  const mockLogout = jest.fn();
  const mockSetSAData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useMsal as jest.Mock).mockImplementation(() => ({
      instance: mockMsalInstance,
      inProgress: InteractionStatus.None,
    }));

    (useAuthContext as jest.Mock).mockReturnValue({
      loading: false,
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
    });

    (useContentDataContext as jest.Mock).mockReturnValue({
      loading: false,
      page: {
        content: {
          values: [],
        },
      },
    });

    (useRouter as jest.Mock).mockReturnValue({
      parsedQuery: {},
    });

    (useSingleAuthStorage as jest.Mock).mockReturnValue([{}, mockSetSAData]);

    (useAccessToken as jest.Mock).mockReturnValue([null]);

    if (typeof window === 'undefined') {
      global.window = Object.create(window);
    }
  });

  test('should not render when MSAL is not initialized', () => {
    (useMsal as jest.Mock).mockReturnValue({
      instance: null,
      inProgress: InteractionStatus.None,
    });

    (findBlockByKey as jest.Mock).mockReturnValue(true);

    const { container } = render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    expect(container.firstChild).toBeNull();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  test('should not render when page is loading', () => {
    (useContentDataContext as jest.Mock).mockReturnValue({
      loading: true,
    });

    const { container } = render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    expect(container.firstChild).toBeNull();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  test('should not render when auth context is loading', () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      loading: true,
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
    });

    const { container } = render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    expect(container.firstChild).toBeNull();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  test('should not render when MSAL interaction is in progress', () => {
    (useMsal as jest.Mock).mockReturnValue({
      instance: mockMsalInstance,
      inProgress: InteractionStatus.Login,
    });

    const { container } = render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    expect(container.firstChild).toBeNull();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  test('should execute logout when path is /sa/logout', async () => {
    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith({
        onError: expect.any(Function),
        postLogoutRedirectUri: undefined,
      });
    });
  });

  test('should execute logout when logout block is found in content', async () => {
    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/some-other-path" />);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith({
        onError: expect.any(Function),
        postLogoutRedirectUri: undefined,
      });
    });
  });

  test('should execute logout even when accessToken exists', async () => {
    (useAccessToken as jest.Mock).mockReturnValue(['mock-token']);

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith({
        onError: expect.any(Function),
        postLogoutRedirectUri: undefined,
      });
    });
  });

  test('should not execute login when accessToken exists', () => {
    (useAccessToken as jest.Mock).mockReturnValue(['mock-token']);

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_login';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/sign-in" />);

    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('should execute login when login block is found in content', async () => {
    (useAccessToken as jest.Mock).mockReturnValue([null]);

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_login';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/sign-in" />);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        onError: expect.any(Function),
        email: undefined,
        cancelUri: '',
      });
    });
  });

  test('should execute register when register block is found in content', async () => {
    (useAccessToken as jest.Mock).mockReturnValue([null]);

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => key === 'single_auth_register');

    render(<SingleAuthDirectRoutes referrer={null} slug="/some-path" />);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        onError: expect.any(Function),
        email: undefined,
        cancelUri: '',
      });
    });
  });

  test('should store nextUrl from returnUrl query parameter', () => {
    (useRouter as jest.Mock).mockReturnValue({
      parsedQuery: {
        returnUrl: '/hub',
      },
    });

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));
    const setDataFn = mockSetSAData.mock.calls[0][0];
    const result = setDataFn({});
    expect(result).toEqual({ nextUrl: '/hub' });
  });

  test('should store nextUrl from next query parameter', () => {
    (useRouter as jest.Mock).mockReturnValue({
      parsedQuery: {
        next: '/hub',
      },
    });

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));
    const setDataFn = mockSetSAData.mock.calls[0][0];
    const result = setDataFn({});
    expect(result).toEqual({ nextUrl: '/hub' });
  });

  test('should prefer returnUrl over next when both are provided', () => {
    (useRouter as jest.Mock).mockReturnValue({
      parsedQuery: {
        returnUrl: '/login',
        next: '/hub',
      },
    });

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));
    const setDataFn = mockSetSAData.mock.calls[0][0];
    const result = setDataFn({});
    expect(result).toEqual({ nextUrl: '/login' });
  });

  test('should use referrer as cancelUri for logout if provided', async () => {
    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer="/previous-page" slug="/sa/logout" />);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith({
        onError: expect.any(Function),
        postLogoutRedirectUri: undefined,
      });
    });
  });

  test('should attempt logout only once even if component re-renders', async () => {
    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    const { rerender } = render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    // Force a re-render
    rerender(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  test('should execute register-work-email when type work-email is passed as qs', async () => {
    (useAccessToken as jest.Mock).mockReturnValue([null]);

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => key === 'single_auth_register');

    (useRouter as jest.Mock).mockReturnValue({
      parsedQuery: {
        type: 'work-email',
        email: 'test@company.com',
      },
    });

    (useClientCountryIds as jest.Mock).mockReturnValue({
      idv: 'mock-idv-country-id',
      workEmail: 'work-email-country-id',
      sso: 'mock-sso-route',
    });

    render(<SingleAuthDirectRoutes referrer="/previous-page" slug="/sa/register" />);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        onError: expect.any(Function),
        email: 'test@company.com',
        cancelUri: '/previous-page',
        overrideClientCountryId: 'work-email-country-id',
      });
    });
  });

  test('should pass postLogoutRedirectUri to logout when provided in query params', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      parsedQuery: {
        postLogoutRedirectUri: 'https://example.com/post-logout',
      },
    });

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith({
        onError: expect.any(Function),
        postLogoutRedirectUri: 'https://example.com/post-logout',
      });
    });
  });

  test('should handle both nextUrl and postLogoutRedirectUri in query params', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      parsedQuery: {
        next: '/hub',
        postLogoutRedirectUri: 'https://example.com/after-logout',
      },
    });

    (findBlockByKey as jest.Mock).mockImplementation((contents, key) => {
      return key === 'single_auth_logout';
    });

    render(<SingleAuthDirectRoutes referrer={null} slug="/sa/logout" />);

    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));
    const setDataFn = mockSetSAData.mock.calls[0][0];
    const result = setDataFn({});
    expect(result).toEqual({ nextUrl: '/hub' });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith({
        onError: expect.any(Function),
        postLogoutRedirectUri: 'https://example.com/after-logout',
      });
    });
  });
});
