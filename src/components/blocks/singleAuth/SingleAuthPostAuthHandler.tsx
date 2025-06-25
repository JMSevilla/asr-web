import { useEffect, useRef } from 'react';
import { isTrue } from '../../../business/boolean';
import { findValueByKey } from '../../../business/find-in-array';
import { parseCmsParams } from '../../../cms/parse-cms';
import { usePageLoaderContext } from '../../../core/contexts/PageLoaderContext';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { useAccessToken } from '../../../core/contexts/auth/hooks';
import { urls } from '../../../core/contexts/auth/singleAuth/constants';
import { usePostAuthTasks } from '../../../core/contexts/auth/singleAuth/hooks/usePostAuthTasks';
import { useSingleAuthStorage } from '../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { logger } from '../../../core/datadog-logs';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { findBlockByKey } from '../sso/utils';

/**
 * @description
 * This component is responsible for handling the post-authentication tasks for the SingleAuth flow.
 * It will show a loading and/or dialog box depending on the policy while the post-authentication tasks are running.
 * It will also redirect the user to the next page after the tasks are completed.
 *
 */
export const SingleAuthPostAuthHandler: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { setIsLoading } = usePageLoaderContext();
  const { setIsAuthTasksRunning } = useAuthContext();
  const contentData = useContentDataContext();
  const authTasks = usePostAuthTasks();
  const [saData] = useSingleAuthStorage();
  const [accessToken] = useAccessToken();
  const cachedAccessKey = useCachedAccessKey();
  const { push, parseUrlAndPush, staticRoutes } = useRouter();
  const taskHasRunRef = useRef(false);

  const contents = contentData.page?.content.values || [];
  const registerHoldingBLock = findBlockByKey(contents, 'register_holding_form');
  const signInHoldingBlock = findBlockByKey(contents, 'sign_in_holding_form');
  const holdingPageBlock = registerHoldingBLock || signInHoldingBlock;

  const getPageParams = (block: any) => {
    const parameters = parseCmsParams(block.elements.parameters!.values);
    return {
      nextPageKey: findValueByKey('success_next_page', parameters) || '',
      errorPageKey: findValueByKey('failure_next_page', parameters) || '',
    };
  };

  useEffect(() => {
    if (!holdingPageBlock) return;

    const shouldExecute = !authTasks.isRunning && !taskHasRunRef.current && !!accessToken;

    const executeAuthTasks = async () => {
      let params;
      try {
        setIsAuthTasksRunning(true);
        setIsLoading(true);
        params = getPageParams(holdingPageBlock);

        await authTasks.execute();

        if (isTrue(saData.isNewAccount)) {
          setIsLoading(false);
          await parseUrlAndPush('sa_register_success');
          return;
        }

        if (saData.nextUrl) {
          if (saData.hasMultipleRecords) {
            await cachedAccessKey.refresh();
          }
          setIsLoading(false);
          await push(saData.nextUrl);
          return;
        }

        if (params?.nextPageKey) {
          setIsLoading(false);
          await parseUrlAndPush(params.nextPageKey);
          return;
        }

        setIsLoading(false);
        await push(staticRoutes?.hub || urls.landing);
      } catch (error) {
        logger.error('AUTH_POSTAUTH_ERROR: ', error as object);
        if (params?.errorPageKey) {
          try {
            await parseUrlAndPush(params.errorPageKey);
          } catch (error) {
            logger.error('AUTH_POSTAUTH_ERROR: Error page navigation failed:', { error });
            await push(urls.error);
          }
        } else {
          await push(urls.error);
        }
      } finally {
        setIsLoading(false);
        setIsAuthTasksRunning(false);
      }
    };

    if (shouldExecute) {
      taskHasRunRef.current = true;
      executeAuthTasks();
    }
  }, [holdingPageBlock, authTasks.isRunning, accessToken]);

  return <>{children}</>;
};
