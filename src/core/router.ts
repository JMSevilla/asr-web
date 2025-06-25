import DOMPurify from 'isomorphic-dompurify';
import { NextRouter, useRouter as useNextRouter } from 'next/router';
import qs, { ParsedQuery } from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { CmsTenant } from '../api/content/types/tenant';
import { extractClassifierFromGlobals } from '../business/globals';
import { isEpaLink } from '../business/links';
import { formatEpaUrl } from '../business/url';
import { useTenantContext } from './contexts/TenantContext';
import { useSafeAuthContext } from './contexts/auth/AuthContext';
import { AUTH_METHODS } from './contexts/auth/types';
import { useContentDataContext } from './contexts/contentData/ContentDataContext';
import { useApiCallback } from './hooks/useApi';
import { useAssureToEpaNavigation } from './contexts/auth/singleAuth/hooks/useAssureToEpaNavigation';
import { isSingleAuthPath } from './auth-method-rules';

type StaticRoutes = Record<
  | 'home'
  | 'hub'
  | 'logout'
  | 'page_not_found'
  | 'bereavement_start'
  | 'second_tab_redirect'
  | 'epa_logout_url'
  | 'epa_expired_session_url',
  string
>;
type TransitionOptions = ArgumentTypes<NextRouter['push']>[2];
type PathFromRoutes = (routes: StaticRoutes) => string;

type PathParameters = {
  url: string | PathFromRoutes;
  query?: ParsedQuery<any>;
};

type ParsePathParameters = {
  key: string;
  query?: ParsedQuery<any>;
};

export const useRouter = () => {
  const router = useNextRouter();
  const [loading, setLoading] = useState(false);
  const { tenant, authMethod } = useTenantContext();
  const contentData = useContentDataContext();
  const { isAuthenticated, softLogout } = useSafeAuthContext();
  const saAssureToEpa = useAssureToEpaNavigation();
  const parseUrlCb = useApiCallback((api, key: string) => api.content.urlFromKey(key));
  const staticRoutes = (
    contentData?.globals
      ? extractClassifierFromGlobals('global_routes', contentData.globals)?.reduce(
        (routes, route) => ({ ...routes, [route.key.value]: route.value.value }),
        {},
      )
      : {}
  ) as StaticRoutes;
  const isSingleAuth = authMethod === AUTH_METHODS.SINGLE_AUTH;

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
    };
  }, [router]);

  return {
    loading,
    parsing: parseUrlCb.loading,
    staticRoutes,
    ...useMemo(
      () => ({
        ...router,
        push: navigate(push),
        parseUrlAndPush: parseUrlAndNavigate(push),
        replace: navigate(replace),
        parseUrlAndReplace: parseUrlAndNavigate(replace),
        parsedQuery: sanitizeQuery(),
        getLogoutUrl,
      }),
      [router, staticRoutes],
    ),
  };

  async function push(path: string | PathFromRoutes, options?: TransitionOptions) {
    return typeof path === 'string'
      ? router.push(await preparePath(path), addTenantSlug(path), configuredRouteOptions(options))
      : router.push(
        await preparePath(path(staticRoutes)),
        addTenantSlug(path(staticRoutes)),
        configuredRouteOptions(options),
      );
  }

  async function replace(path: string | PathFromRoutes, options?: TransitionOptions) {
    return typeof path === 'string'
      ? router.replace(await preparePath(path), path, configuredRouteOptions(options))
      : router.replace(await preparePath(path(staticRoutes)), path(staticRoutes), configuredRouteOptions(options));
  }

  async function preparePath(path: string): Promise<string> {
    if (!isEpaLink(path)) {
      return routeUrl(path);
    }

    if (isSingleAuth) {
      return routeUrl(await saAssureToEpa.prepareEpaPath(path));
    }

    // For OpenAM scenario, clear session data before redirecting
    await clearSession();

    return routeUrl(path);
  }

  async function clearSession() {
    if (!isAuthenticated) {
      return;
    }
    await softLogout();
  }

  function parseUrlAndNavigate(fn: (path: string | PathFromRoutes, options?: TransitionOptions) => Promise<boolean>) {
    return async (urlKey: string | ParsePathParameters, options?: TransitionOptions) => {
      const key = typeof urlKey === 'string' ? urlKey : urlKey.key;
      const query = typeof urlKey === 'string' ? {} : urlKey.query;
      if (!key) return;
      if (key === 'native_browser_back') {
        return window.history.back();
      }
      const result = await parseUrlCb.execute(key);
      return navigate(fn)({ url: result.data.url, query }, options);
    };
  }

  function navigate(fn: (path: string | PathFromRoutes, options?: TransitionOptions) => Promise<boolean>) {
    return async (path: string | PathFromRoutes | PathParameters, options?: TransitionOptions) => {
      setLoading(true);
      if (typeof path === 'string') {
        return await fn(path, options);
      }

      if (typeof path === 'function') {
        return await fn(path, options);
      }

      try {
        const stringifiedPath = qs.stringifyUrl({
          url: typeof path.url === 'string' ? path.url : path.url(staticRoutes),
          query: path.query,
        });

        return await fn(stringifiedPath, options);
      } catch (e) {
        console.error(e);
        return false;
      }
    };
  }

  function sanitizeQuery(): ParsedQuery {
    const query = qs.parseUrl(router?.asPath ?? 'q').query;

    Object.entries(query).forEach(([queryKey, value]) => {
      query[queryKey] = value ? DOMPurify.sanitize(value.toString()) : value;
    });

    return query;
  }

  function addTenantSlug(path: string): string | undefined {
    const tenantUrl = tenant?.tenantUrl.value.split('/')?.[1];

    if (isEpaLink(path) && isSingleAuth) {
      return undefined;
    }

    if (tenantUrl && path.split('/')?.[1] != tenantUrl) {
      return tenantUrl + path;
    }
    return path;
  }

  function routeUrl(path: string) {
    return path === staticRoutes.home || path.includes('http://') || path.includes('https://') || isSingleAuthPath(path) ? path : '/[...slug]';
  }

  function getLogoutUrl(
    path: keyof StaticRoutes,
    backupUrlPath: keyof Pick<CmsTenant, 'logoutUrl' | 'expiredSessionUrl'>,
  ) {
    const url = staticRoutes?.[path];

    return url ? formatEpaUrl(url) : tenant?.[backupUrlPath]?.value ?? '';
  }
};

const configuredRouteOptions = (options?: TransitionOptions) =>
  options ? { scroll: false, ...options } : { scroll: false };
