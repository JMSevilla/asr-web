import { datadogRum } from '@datadog/browser-rum';
import { useEffect } from 'react';
import { useTenantContext } from '../contexts/TenantContext';
import { useAuthContext } from '../contexts/auth/AuthContext';
import { useContentDataContext } from '../contexts/contentData/ContentDataContext';

export const useDataDogMonitoring = () => {
  const { isAuthenticated } = useAuthContext();
  const { membership } = useContentDataContext();
  const { tenant } = useTenantContext();

  useEffect(() => {
    const userId = membership?.referenceNumber || null;
    const bgroup = tenant?.businessGroup.values || [];
    if (isAuthenticated) {
      datadogRum.addRumGlobalContext('BGROUP', bgroup);
      datadogRum.addRumGlobalContext('USERID', userId);
    }
  }, [isAuthenticated, membership, tenant]);
};
