import '@testing-library/jest-dom/extend-expect';
import { AuthProvider, useAuthContext, useSafeAuthContext } from '../../../core/contexts/auth/AuthContext';
import { useOpenAmAuth } from '../../../core/contexts/auth/openam/hooks/useOpenAmAuth';
import { useSingleAuth } from '../../../core/contexts/auth/singleAuth/hooks/useSingleAuth';
import { AUTH_METHODS } from '../../../core/contexts/auth/types';
import { act, render, renderHook, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));
jest.mock('../../../core/contexts/auth/openam/hooks/useOpenAmAuth');
jest.mock('../../../core/contexts/auth/singleAuth/hooks/useSingleAuth');

const mockedUseOpenAmAuth = useOpenAmAuth as jest.Mock;
const mockedUseSingleAuth = useSingleAuth as jest.Mock;

// Create a test component that uses the auth context
const TestConsumer = () => {
  const auth = useAuthContext();
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="is-authenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="is-authenticating">{auth.isAuthenticating.toString()}</div>
      <div data-testid="is-single-auth">{auth.isSingleAuth.toString()}</div>
      <button data-testid="login-button" onClick={() => auth.login({})}>
        Login
      </button>
      <button data-testid="logout-button" onClick={() => auth.logout()}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockLoginFn = jest.fn();
  const mockLogoutFn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseOpenAmAuth.mockReturnValue({
      loading: false,
      isAuthenticating: false,
      isAuthenticated: false,
      isSingleAuth: false,
      linkedMembers: [],
      login: mockLoginFn,
      loginFromSso: jest.fn(),
      logout: mockLogoutFn,
      register: jest.fn(),
      softLogout: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setIsAuthTasksRunning: jest.fn(),
      switchUser: jest.fn(),
    });

    mockedUseSingleAuth.mockReturnValue({
      loading: false,
      isAuthenticating: false,
      isAuthenticated: false,
      isSingleAuth: true,
      linkedMembers: [],
      login: mockLoginFn,
      loginFromSso: jest.fn(),
      logout: mockLogoutFn,
      register: jest.fn(),
      softLogout: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setIsAuthTasksRunning: jest.fn(),
      switchUser: jest.fn(),
    });
  });

  it('renders OpenAmAuthProvider by default', async () => {
    await act(async () => {
      render(
        <AuthProvider bgroup="WIF">
          <TestConsumer />
        </AuthProvider>,
      );
    });

    expect(screen.getByTestId('is-single-auth')).toHaveTextContent('false');
    expect(mockedUseOpenAmAuth).toHaveBeenCalled();
    expect(mockedUseSingleAuth).not.toHaveBeenCalled();
  });

  it('renders SingleAuthProvider when authMethod is SINGLE_AUTH', async () => {
    await act(async () => {
      render(
        <AuthProvider bgroup="WIF" authMethod={AUTH_METHODS.SINGLE_AUTH}>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    expect(screen.getByTestId('is-single-auth')).toHaveTextContent('true');
    expect(mockedUseSingleAuth).toHaveBeenCalled();
    expect(mockedUseOpenAmAuth).not.toHaveBeenCalled();
  });

  it('passes auth actions from OpenAmAuth to children', async () => {
    await act(async () => {
      render(
        <AuthProvider bgroup="WIF">
          <TestConsumer />
        </AuthProvider>,
      );
    });

    // Test that login action is passed through
    await act(async () => {
      screen.getByTestId('login-button').click();
    });
    expect(mockLoginFn).toHaveBeenCalled();

    // Test that logout action is passed through
    await act(async () => {
      screen.getByTestId('logout-button').click();
    });
    expect(mockLogoutFn).toHaveBeenCalled();
  });

  it('passes auth actions from SingleAuth to children', async () => {
    // Set isAuthenticating to false to render children
    mockedUseSingleAuth.mockReturnValue({
      loading: false,
      isAuthenticating: false,
      isAuthenticated: true,
      isSingleAuth: true,
      linkedMembers: [],
      login: mockLoginFn,
      loginFromSso: jest.fn(),
      logout: mockLogoutFn,
      register: jest.fn(),
      softLogout: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setIsAuthTasksRunning: jest.fn(),
      switchUser: jest.fn(),
    });

    await act(async () => {
      render(
        <AuthProvider bgroup="WIF" authMethod={AUTH_METHODS.SINGLE_AUTH}>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    // Test that login action is passed through
    await act(async () => {
      screen.getByTestId('login-button').click();
    });
    expect(mockLoginFn).toHaveBeenCalled();

    // Test that logout action is passed through
    await act(async () => {
      screen.getByTestId('logout-button').click();
    });
    expect(mockLogoutFn).toHaveBeenCalled();
  });

  it('hides children during SingleAuth authentication', async () => {
    // Set isAuthenticating to true to hide children
    mockedUseSingleAuth.mockReturnValue({
      loading: false,
      isAuthenticating: true,
      isAuthenticated: false,
      isSingleAuth: true,
      linkedMembers: [],
      login: mockLoginFn,
      loginFromSso: jest.fn(),
      logout: mockLogoutFn,
      register: jest.fn(),
      softLogout: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setIsAuthTasksRunning: jest.fn(),
      switchUser: jest.fn(),
    });

    await act(async () => {
      render(
        <AuthProvider bgroup="WIF" authMethod={AUTH_METHODS.SINGLE_AUTH}>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('throws an error when useAuthContext is used outside of AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuthContext());
    }).toThrow('useAuthContext must be used within an AuthProvider');
  });

  it('provides default values when useSafeAuthContext is used outside of AuthProvider', () => {
    const { result } = renderHook(() => useSafeAuthContext());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAuthenticating).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.isSingleAuth).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });
});
