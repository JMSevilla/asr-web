import { AxiosInstance } from 'axios';
import { stringify } from 'query-string';
import { useAsync, useAsyncCallback } from 'react-async-hook';
import { Api } from '../../api/api';
import { AuthenticationApi } from '../../api/authentication/api';
import { ContentApi } from '../../api/content/api';
import { MdpApi } from '../../api/mdp/api';
import { config } from '../../config';
import { authHeaders } from '../contexts/auth/singleAuth/constants';
import { SingleAuthData } from '../contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { AUTH_METHODS } from '../contexts/auth/types';
import { useTenantContext } from '../contexts/TenantContext';
import { logger } from '../datadog-logs';
import Http, { HttpOptions } from '../http-client';
import { getItem } from '../session-storage';

const HTTP_OPTIONS: HttpOptions = {
  headers: { ENV: config.value.ENVIRONMENT },
  paramsSerializer: params => stringify(params, { strict: true, encode: true, arrayFormat: 'none' }),
  onRequest: req => {
    const accessToken = getItem<string | undefined>('accessToken');
    if (req.headers && accessToken) req.headers.Authorization = `Bearer ${accessToken}`;
  },
  onError: error => {
    const user = getItem<string | undefined>('user');
    // throws datadog error then calling directly from server side
    logger.error(`Error on response: ${JSON.stringify(error)}. User: ${JSON.stringify(user)}`);
  },
};

export const httpClient = new Http({ ...HTTP_OPTIONS, baseURL: config.value.API_URL });
export const httpSsrClient = new Http({
  ...HTTP_OPTIONS,
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'https://localhost:3000'
      : typeof window !== 'undefined'
        ? window.location.origin
        : undefined,
});
export const httpSsrRefreshedClient = (url: string) =>
  new Http({
    ...HTTP_OPTIONS,
    baseURL: url,
  });

const updateSingleAuthHeaders = (headers: Record<string, string>) => {
  const saData = getItem<SingleAuthData>('singleAuthData');
  const authBgroup = saData?.linkedBgroup || saData?.primaryBgroup || '';
  const authRefno = saData?.linkedRefno || saData?.primaryRefno || '';

  return {
    ...headers,
    [authHeaders.bgroup]: authBgroup || headers.BGROUP,
    ...(authRefno && { [authHeaders.refno]: authRefno }),
  }
}

const updateHttpClient = (customBgroup?: string[]) => {
  const tenantContext = useTenantContext();
  const defaultBgroup = tenantContext ? tenantContext.tenant?.businessGroup.values : [];
  const bgroup = customBgroup || defaultBgroup;
  const isSingleAuth = tenantContext ? tenantContext.authMethod === AUTH_METHODS.SINGLE_AUTH : false;
  let headers: Record<string, string>;

  headers = {
    ENV: config.value.ENVIRONMENT,
    BGROUP: bgroup?.join(','),
  };

  if (isSingleAuth) {
    headers = updateSingleAuthHeaders(headers);
  }

  httpClient.updateHeaders(headers);
};

export const useApi = <R, D extends unknown[]>(asyncFn: (api: Api) => Promise<R>, deps?: D) => {
  updateHttpClient();

  return useAsync(async () => {
    try {
      const api = createApi(httpClient.client, httpSsrClient.client);
      return await asyncFn(api);
    } catch (e: any) {
      throw handleError(e);
    }
  }, [httpClient, ...(deps || [])]);
};

export const useApiCallback = <R, A extends unknown>(asyncFn: (api: Api, args: A) => Promise<R>, bgroup?: string[]) => {
  updateHttpClient(bgroup);

  return useAsyncCallback(
    async (args?: A) => {
      try {
        const api = createApi(httpClient.client, httpSsrClient.client);
        return await asyncFn(api, args as A);
      } catch (e: any) {
        throw handleError(e);
      }
    },
    {
      onSuccess: result => { },
      onError: handleError,
    },
  );
};
function createApi(client: AxiosInstance, httpSsrClient: AxiosInstance) {
  return new Api(
    new AuthenticationApi(client, httpSsrClient),
    new MdpApi(client, httpSsrClient),
    new ContentApi(client)
  );
}

/**@@deprecated arrays are used instead of Errors thus loosing the callstack */
function handleError(e: any) {
  !process.env.JEST_WORKER_ID && e && console.error(e);
  logger.error(`Error on client side response: ${JSON.stringify(e)}.`);
  const rawErrors = e.response?.data?.errors;
  return Array.isArray(rawErrors) ? rawErrors.map(e => e.code ?? 'something_went_wrong') : ['something_went_wrong'];
}
