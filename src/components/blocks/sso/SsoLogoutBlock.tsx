import React from 'react';
import { ErrorBox } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { usePageLoaderContext } from '../../../core/contexts/PageLoaderContext';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { logger } from '../../../core/datadog-logs';
import { useApi } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';

export const SsoLogoutBlock: React.FC<{}> = () => {
  const router = useRouter();
  const { errorByKey } = useGlobalsContext();
  const { logout, isSingleAuth } = useAuthContext();
  const { setIsLoading } = usePageLoaderContext();
  const logoutUrl = router.getLogoutUrl('epa_logout_url', 'logoutUrl');

  const result = useApi(async () => {
    try {
      if (!isSingleAuth) {
        setIsLoading(true);
        await logout();
        await handleRedirect();
      } else {
        throw new Error('SSO logout is not supported for this auth method');
      }
    } catch (e) {
      logger.error(`SSO logout failed: ${JSON.stringify(e)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (result.error) {
    return <ErrorBox label={errorByKey('sso_logout_failure_error')} />;
  }

  return null;

  async function handleRedirect() {
    if (logoutUrl) {
      window.location.replace(logoutUrl);
      return;
    }

    await router.push(routes => routes.logout, { shallow: false });
  }
};
