import { Configuration, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { config } from '../config';
import { logger } from './datadog-logs';
import { authorityUrl, policies, urls } from './contexts/auth/singleAuth/constants';
import { CmsTenant } from '../api/content/types/tenant';

export const initializeMsal = async (tenant: CmsTenant): Promise<IPublicClientApplication | null> => {
  const msalConfig = createMsalConfig(tenant);
  try {
    const msalInstance = new PublicClientApplication(msalConfig);
    return msalInstance;
  } catch (error) {
    logger.error('Error initializing MSAL:', error as object);
    return null;
  }
};

const createMsalConfig = (tenant: CmsTenant): Configuration => ({
  auth: {
    clientId: tenant.clientIdAppRegistration?.value as string,
    authority: `${authorityUrl}/${policies.login}`,
    knownAuthorities: [new URL(authorityUrl).hostname],
    redirectUri: urls.signin_holding,
    navigateToLoginRequestUrl: false,
    postLogoutRedirectUri: urls.cancel,
  },
  cache: {
    secureCookies: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            // when not in dev environment, use datadog logger
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
      logLevel: LogLevel.Error,
    }
  }
});

