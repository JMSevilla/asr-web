import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useEffect, useRef } from 'react';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { useAccessToken } from '../../../core/contexts/auth/hooks';
import { useClientCountryIds } from '../../../core/contexts/auth/singleAuth/hooks/useClientCountryIds';
import { useSingleAuthStorage } from '../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { logger } from '../../../core/datadog-logs';
import { useRouter } from '../../../core/router';
import { findBlockByKey } from '../sso/utils';

interface SingleAuthBlockProps {
  action: 'login' | 'register' | 'logout' | 'register-work-email';
  email?: string;
  cancelUri?: string;
  postLogoutRedirectUri?: string;
}

/**
 * @description
 * This component is responsible for launching Single Auth using certain /sa/* paths.
 * Launching Single Auth requires MSAL instance which is currently handled on the client side.
 * It will redirect the user to the appropriate Single Auth action based on the provided slug and query parameters.
 *
 * @param {{
 *   referrer: string | null;
 *   slug: string;
 * }} props
 */
export const SingleAuthDirectRoutes: React.FC<{ referrer: string | null; slug: string }> = ({ referrer, slug }) => {
  const { instance, inProgress } = useMsal();
  const { loading } = useAuthContext();
  const contentData = useContentDataContext();
  const { parsedQuery } = useRouter();
  const [accessToken] = useAccessToken();
  const [, setSAData] = useSingleAuthStorage();

  const msalInitialized = !!instance;
  const contents = contentData.page?.content.values || [];
  const { email, next, returnUrl, type, postLogoutRedirectUri } = parsedQuery;

  if (contentData.loading || loading) {
    return null;
  }

  if (typeof window === 'undefined' || !msalInitialized || inProgress !== InteractionStatus.None) {
    return null;
  }

  const nextUrl = (returnUrl as string) || (next as string);
  if (nextUrl) {
    setSAData(saData => ({ ...saData, nextUrl }));
  }
  const props = getDirectRouteProps(slug, contents, {
    email: email as string,
    referrer: referrer || '',
    type: type as string,
    postLogoutRedirectUri: postLogoutRedirectUri as string,
  });

  if (!props) {
    return null;
  }

  if (!!accessToken && props.action !== 'logout') {
    return null;
  }

  return props ? <SingleAuthBlock {...props} /> : null;
};

const SingleAuthBlock: React.FC<SingleAuthBlockProps> = ({ action, email, cancelUri, postLogoutRedirectUri }) => {
  const { login, register, logout } = useAuthContext();
  const clientCountryId = useClientCountryIds();
  const { instance } = useMsal();
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    const execute = async () => {
      if (!instance || hasAttemptedRef.current) return;
      hasAttemptedRef.current = true;

      try {
        switch (action) {
          case 'login':
            await login({
              onError: () => logger.error('SingleAuth login redirection failed'),
              email,
              cancelUri,
            });
            break;

          case 'register':
            await register({
              onError: () => logger.error('SingleAuth register redirection failed'),
              email,
              cancelUri,
            });
            break;

          case 'register-work-email':
            await register({
              onError: () => logger.error('SingleAuth register Work Email redirection failed'),
              overrideClientCountryId: clientCountryId.workEmail,
              email,
              cancelUri,
            });
            break;

          case 'logout':
            await logout({
              onError: () => logger.error('SingleAuth logout redirection failed'),
              postLogoutRedirectUri,
            });
            break;

          default:
            throw new Error(`Invalid action: ${action}`);
        }
      } catch (error) {
        logger.error(`Error during SingleAuth ${action} redirection:`, error as object);
      }
    };

    execute();
  }, [action, instance, login, register, logout, email, postLogoutRedirectUri, clientCountryId.workEmail]);

  return null;
};

function getDirectRouteProps(
  path: string,
  contents: any[],
  params: {
    email?: string;
    type?: string;
    referrer: string;
    postLogoutRedirectUri?: string;
  },
): SingleAuthBlockProps | null {
  const { email, referrer, type, postLogoutRedirectUri } = params;

  const loginBlock = findBlockByKey(contents, 'single_auth_login');
  if (loginBlock || path === '/sa/sign-in') {
    return {
      action: 'login',
      email,
      cancelUri: referrer,
    };
  }

  const registerBlock = findBlockByKey(contents, 'single_auth_register');
  if (registerBlock || path === '/sa/register') {
    switch (type) {
      case 'work-email':
        return {
          action: 'register-work-email',
          email,
          cancelUri: referrer,
        };
      default:
        return {
          action: 'register',
          email,
          cancelUri: referrer,
        };
    }
  }

  const logoutBlock = findBlockByKey(contents, 'single_auth_logout');
  if (logoutBlock || path === '/sa/logout') {
    return {
      action: 'logout',
      postLogoutRedirectUri,
    };
  }

  return null;
}
