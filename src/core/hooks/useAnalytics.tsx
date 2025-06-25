import { push as pushParam } from '@socialgouv/matomo-next';
import { useEffect } from 'react';
import { AccessKey } from '../../api/mdp/types';
import { getItem } from '../session-storage';
import { useApiCallback } from './useApi';
import { useSessionStorage } from './useSessionStorage';

export const useParameterizedAnalytics = (bgroup: string) => {
  const accessToken = getItem('accessToken');
  const [cachedAccessKey] = useSessionStorage<AccessKey | null>('access-key', null);
  const contentAccessKey = cachedAccessKey?.contentAccessKey || '';

  const params = useApiCallback(
    async api => {
      if (!contentAccessKey) return;

      const result = await api.mdp.analyticsParams(contentAccessKey);
      pushParam(['setCustomDimension', 1, result.data.businessGroup ?? '']);
      pushParam(['setCustomDimension', 2, result.data.status ?? '']);
      pushParam(['setCustomDimension', 3, result.data.schemeType ?? '']);
      pushParam(['setCustomDimension', 4, result.data.schemeCode ?? '']);
      pushParam(['setCustomDimension', 5, result.data.categoryCode ?? '']);
      pushParam(['setCustomDimension', 6, result.data.locationCode ?? '']);
      pushParam(['setCustomDimension', 7, result.data.employerCode ?? '']);
      return result;
    },
    [bgroup],
  );

  useEffect(() => {
    if (accessToken && contentAccessKey) {
      params.execute();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken && params.result?.data) {
      params.reset();
      window.location.reload();
    }
  }, [accessToken]);

  return params;
};
