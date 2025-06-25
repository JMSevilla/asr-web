import { useCallback } from 'react';
import { AccessKey } from '../../api/mdp/types';
import { useTenantContext } from '../contexts/TenantContext';
import { getItem } from '../session-storage';
import { useApiCallback } from './useApi';
import { useSessionStorage } from './useSessionStorage';

type FetchType = 'full' | 'no-check' | 'basic-mode';

export const useCachedAccessKey = () => {
  const { tenant } = useTenantContext();
  const [accessKey, setAccessKey, clearAccessKey] = useSessionStorage<AccessKey | null>('access-key', null);
  const accessKeyRefreshCb = useApiCallback(async (api, fetchType: FetchType) => {
    const result = await api.mdp.refreshAccessKey(
      tenant?.tenantUrl.value,
      tenant?.newlyRetiredRange?.value ?? 0,
      tenant?.preRetiremetAgePeriod?.value ?? 0,
      fetchType === 'basic-mode',
    );
    setAccessKey(result.data);
    return result.data;
  });

  const accessKeyCb = useApiCallback(async (api, fetchType: FetchType) => {
    if (!getItem('accessToken') && fetchType !== 'no-check') {
      clearAccessKey();
      return null;
    }
    const result = await api.mdp.accessKey(
      tenant?.tenantUrl.value,
      tenant?.newlyRetiredRange?.value ?? 0,
      tenant?.preRetiremetAgePeriod?.value ?? 0,
      fetchType === 'basic-mode',
    );
    setAccessKey(result.data);
    return result.data;
  });

  return {
    data: accessKey,
    loading: accessKeyCb.loading || accessKeyRefreshCb.loading || !accessKey,
    fetch: useCallback((mode: FetchType = 'full') => accessKey ?? accessKeyCb.execute(mode), [accessKey]),
    refresh: useCallback((mode: FetchType = 'full') => accessKeyRefreshCb.execute(mode), []),
    clear: clearAccessKey,
  };
};
