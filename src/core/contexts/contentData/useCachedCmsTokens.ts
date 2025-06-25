import { useCallback, useState } from 'react';
import { CmsTokens } from '../../../api/types';
import { useApiCallback } from '../../hooks/useApi';
import { useSessionStorage } from '../../hooks/useSessionStorage';

/**
 * Used to retrieve and store CMS tokens in session storage.
 * @returns data, loading, fetch, update, refresh, clear
 * @example
 * const { data, loading, fetch, update, refresh, clear } = useCachedCmsTokens();
 * await fetch();
 * update('token', 'value');
 * await refresh();
 * clear();
 */
export const useCachedCmsTokens = () => {
  const [tokens, setTokens, clearTokens] = useSessionStorage<CmsTokens | null>('cms-tokens', null);
  const [state, setState] = useState<CmsTokens | null>(isValidTokens(tokens) ? tokens : null);
  const cmsTokensCb = useApiCallback(async api => {
    const result = await api.mdp.tokenInformation();
    setTokens(result.data);
    setState(result.data);
    return result.data;
  });

  return {
    data: state,
    loading: cmsTokensCb.loading,
    fetch: useCallback(() => {
      if (state && isValidTokens(state)) {
        return Promise.resolve(state);
      }
      return cmsTokensCb.execute();
    }, [state, cmsTokensCb]),
    update: useCallback(
      (key: keyof CmsTokens, value: CmsTokens[keyof CmsTokens]) => {
        setState(old => {
          const next = { ...old, [key]: value } as CmsTokens;
          setTokens(next);
          return next;
        });
      },
      [setState, setTokens],
    ),
    refresh: useCallback(() => cmsTokensCb.execute(), [cmsTokensCb]),
    clear: useCallback(() => {
      clearTokens();
      setState(null);
    }, [clearTokens]),
  };
};

function isValidTokens(t: CmsTokens | null): boolean {
  return !!(t && (t.name || t.email || t.bereavementCaseNumber));
}