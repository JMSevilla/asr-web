import React from 'react';
import { ErrorBox } from '../..';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { usePageLoaderContext } from '../../../core/contexts/PageLoaderContext';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { logger } from '../../../core/datadog-logs';
import { useApi } from '../../../core/hooks/useApi';
import { useSSOCookie } from '../../../core/hooks/useCookie';
import { useRouter } from '../../../core/router';

interface Props {
  newlyRetiredRange: number;
  preRetirementAgePeriod: number;
  parameters: { key: string; value: string }[];
}

let nextUrl: string;

export const SsoSuccessBlock: React.FC<Props> = ({ newlyRetiredRange, preRetirementAgePeriod, parameters }) => {
  const router = useRouter();
  const [ssoCookie, _] = useSSOCookie();
  const { errorByKey } = useGlobalsContext();
  const { loginFromSso, isSingleAuth } = useAuthContext();
  const { setIsLoading } = usePageLoaderContext();

  if (router.query.next) {
    nextUrl = router.query.next as string;
  }

  const createSession = useApi(async a => {
    const errorUrlValue = findValueByKey('error_page', parameters);
    if (!errorUrlValue) {
      const message = 'error_page not defined in cms';
      logger.error(message);
      throw Error(message);
    }

    const errorUrl = await a.content.urlFromKey(errorUrlValue);
    try {
      setIsLoading(true);

      if (!ssoCookie) {
        logger.error('SSO failed: epav2_syst cookie not found');
        return await router.push(errorUrl.data.url);
      }

      if (!isSingleAuth) {
        const result = await loginFromSso({
          tokenId: ssoCookie,
          newlyRetiredRange,
          preRetirementAgePeriod,
        });
        await router.push(nextUrl ?? router.staticRoutes.hub);
        return result;
      } else {
        throw new Error('SSO login is not supported for this auth method');
      }
    } catch (e) {
      logger.error(`SSO failed: ${JSON.stringify(e)}`);
      await router.push(errorUrl.data.url);
    } finally {
      setIsLoading(false);
    }
  });

  if (createSession.error) {
    return <ErrorBox label={errorByKey('sso_failure_error')} />;
  }

  return null;
};
