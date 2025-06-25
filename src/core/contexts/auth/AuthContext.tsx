import React, { createContext, useContext, useMemo } from 'react';
import { useOpenAmAuth } from './openam/hooks/useOpenAmAuth';
import { useSingleAuth } from './singleAuth/hooks/useSingleAuth';
import { AUTH_METHODS, AuthMethod, AuthService } from './types';

const context = createContext<AuthService | undefined>(undefined);

const mapAuthService = (authService: AuthService) => ({
  loading: authService.loading,
  isAuthenticating: authService.isAuthenticating,
  isAuthenticated: authService.isAuthenticated,
  isSingleAuth: authService.isSingleAuth,
  linkedMembers: authService.linkedMembers,
  login: authService.login,
  loginFromSso: authService.loginFromSso,
  logout: authService.logout,
  register: authService.register,
  softLogout: authService.softLogout,
  setIsAuthenticated: authService.setIsAuthenticated,
  setIsAuthTasksRunning: authService.setIsAuthTasksRunning,
  switchUser: authService.switchUser,
});

const OpenAmAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authService = useOpenAmAuth();
  const value = useMemo(() => mapAuthService(authService), [authService]);
  return <context.Provider value={value}>{children}</context.Provider>;
};

const SingleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authService = useSingleAuth();
  const value = useMemo(() => mapAuthService(authService), [authService]);
  return <context.Provider value={value}>{!authService.isAuthenticating && children}</context.Provider>;
};

export const AuthProvider: React.FC<{ children: React.ReactNode; bgroup: string; authMethod?: AuthMethod }> = ({
  children,
  bgroup,
  authMethod = AUTH_METHODS.OPENAM,
}) => {
  if (authMethod === AUTH_METHODS.SINGLE_AUTH) {
    return <SingleAuthProvider>{children}</SingleAuthProvider>;
  }

  return <OpenAmAuthProvider>{children}</OpenAmAuthProvider>;
};

export const useAuthContext = () => {
  const authContext = useContext(context);
  if (!authContext) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return authContext;
};

export const useSafeAuthContext = () => {
  const authContext = useContext(context);
  if (!authContext) {
    return {
      loading: false,
      isAuthenticating: false,
      isAuthenticated: false,
      linkedMembers: undefined,
      switchUser: async () => {},
      login: async () => {},
      loginFromSso: async () => {},
      logout: async () => {},
      softLogout: async () => {},
      setIsAuthenticated: () => {},
      register: async () => {},
      isSingleAuth: false,
      authRefno: '',
      authBgroup: '',
    };
  }
  return authContext;
};
