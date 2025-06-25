import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';
import { useAccessToken } from '../contexts/auth/hooks';
import Http from '../http-client';
import { httpClient } from './useApi';

/**
 * Custom React hook: sets up an Axios retry-on-401 middleware that will
 * attempt a silent MSAL token refresh (or logout on invalid tokens).
 *
 * @param logout Async function that logs out the current user.
 */
export const useRefreshSingleAuthTokenHandler = (logout: AsyncFunction) => {
  const [accessToken, setAccessToken] = useAccessToken();
  const { instance, inProgress, accounts } = useMsal();
  const account = accounts[0];
  const retryRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    httpClient.setupMiddlewareOptions({ onErrorHandler: handleRetry });
  }, []);

  const handleRetry = async (error: AxiosError, http: Http) => {
    const status = error.response?.status;
    if (status !== 401) return Promise.reject(error);

    if (isTokenInvalid(error)) {
      return accessToken ? logout() : Promise.reject(error);
    }

    if (!isTokenExpired(error)) return Promise.reject(error);

    if (!retryRef.current) {
      retryRef.current = refreshToken(error).finally(() => {
        retryRef.current = null;
      });
    }

    try {
      await retryRef.current;
      // replay original request with updated header
      http.options?.onRequest?.(error.config!);
      return http.client(error.config!);
    } catch {
      retryRef.current = null;
      return Promise.reject(error);
    }
  };

  const refreshToken = async (error: AxiosError): Promise<void> => {
    if (!accessToken) return Promise.reject(error);

    if (inProgress !== InteractionStatus.None && inProgress !== InteractionStatus.Startup) {
      return Promise.reject(new Error('Authentication in progress'));
    }

    try {
      const result = await instance.acquireTokenSilent({
        account,
        scopes: [],
        forceRefresh: true,
      });

      const token = result.idToken;
      setAccessToken(token);
      updateRequestHeader(error, token);
    } catch {
      await logout();
      return Promise.reject(error);
    }
  };
};

const isTokenExpired = (err: any) =>
  err.response?.data?.errors?.some((e: any) => e.code === 'ERROR_ACCESS_TOKEN_EXPIRED');

const isTokenInvalid = (err: any) =>
  err.response?.data?.errors?.some((e: any) => e.code === 'ERROR_INVALID_ACCESS_TOKEN');

const updateRequestHeader = (error: AxiosError, token: string) => {
  if (error.config?.headers) {
    error.config.headers.Authorization = `Bearer ${token}`;
  }
};
