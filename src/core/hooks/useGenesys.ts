import { useEffect, useMemo, useState } from 'react';
import { CmsTenant } from '../../api/content/types/tenant';
import { parseBase64toJSON, toTitleCase } from '../../business/strings';
import { config } from '../../config';
import { useTenantContext } from '../contexts/TenantContext';
import { useAuthContext } from '../contexts/auth/AuthContext';
import { useContentDataContext } from '../contexts/contentData/ContentDataContext';
import { logger } from '../datadog-logs';
import {
  ConfigProps,
  GenesysParameters,
  conversationCleared,
  deleteWebchatHistory,
  hideAndClearGenesysChat,
  insertScriptElement,
  isScriptLoaded,
  isWebChatActive,
  setGenesysAttributes,
  setupGenesysGlobals,
  subscribeToGenesysEvents,
  subscribeToEvent,
} from '../genesys';
import { mixpanelTrackButtonClick } from '../mixpanel-tracker';
import { useCachedAccessKey } from './useCachedAccessKey';
import { useApiCallback } from './useApi';

interface Props {
  url: string;
  config: ConfigProps;
  data: GenesysParameters;
}

export const useGenesys = () => {
  const isGenesysChatActive = isWebChatActive();
  const [shouldHideDefaultChat, setShouldHideDefaultChat] = useState<boolean>(isGenesysChatActive);
  const { membership } = useContentDataContext();
  const cachedAccessKey = useCachedAccessKey();
  const { tenant } = useTenantContext();
  const { isAuthenticated } = useAuthContext();

  const intentContextCb = useApiCallback(api => api.mdp.getIntentContext());

  const parsedContentAccessKey = useMemo(() => {
    try {
      return cachedAccessKey.data?.contentAccessKey ? JSON.parse(cachedAccessKey.data?.contentAccessKey) : undefined;
    } catch (error) {
      logger.error('Error parsing content access key:', error as any);
      return undefined;
    }
  }, [cachedAccessKey.data?.contentAccessKey]);

  const isWebChatEnabled: boolean = parsedContentAccessKey?.isWebChatEnabled;
  const shouldHideHelpWidget: boolean =
    typeof tenant.hideHelpButtons?.value !== 'undefined' && tenant.hideHelpButtons?.value;
  const shouldHideLiveChat: boolean = typeof tenant.hideLivechat?.value !== 'undefined' && tenant.hideLivechat?.value;
  const genesysDeploymentId =
    isAuthenticated && getDeploymentId(config.value.GENESYS_DEPLOYMENT_ID, tenant.businessGroup);
  const forename = [membership?.forenames].filter(Boolean).join(' ');
  const forenameTitleCase = toTitleCase(forename).split(' ')[0];

  const genesysWithConfig = {
    deploymentId: genesysDeploymentId,
    resourceUrl: config.value.GENESYS_JS_URL,
    environment: 'prod-euw2',
  };

  const isGenesysEnabled = Boolean(config.value.GENESYS_DEPLOYMENT_ID) && isWebChatEnabled;

  const loadGenesysScript = async ({ data, config, url }: Props): Promise<void> => {
    try {
      setupGenesysGlobals(config);
      if (!isScriptLoaded(url)) {
        await insertScriptElement(url);
      }
      await subscribeToGenesysEvents(data);
    } catch (error) {
      logger.error('Genesys script unable to load', error as any);
    }
  };

  const genesysScriptConfig: Props = {
    config: {
      deploymentId: genesysWithConfig.deploymentId,
      environment: genesysWithConfig.environment,
      debug: false,
    },
    data: {
      bgroup: tenant?.businessGroup.values.join(','),
      referenceNumber: membership?.referenceNumber ?? '',
      memberForename: forenameTitleCase,
      platform: 'assure',
      env: config.value.ENVIRONMENT,
    },
    url: genesysWithConfig.resourceUrl,
  };

  useEffect(() => {
    if (!isAuthenticated || !isGenesysEnabled || !genesysScriptConfig.config.deploymentId) return;
    loadGenesysScript(genesysScriptConfig);
    onConversationCleared();
  }, [membership, isAuthenticated, isGenesysEnabled, genesysScriptConfig]);

  const checkIntentAndStartGenesys = async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined' || !isGenesysEnabled) return false;
  
      const intentContext = await intentContextCb.execute();

      if (intentContext?.data?.intent && intentContext?.data?.ttl) {
        const currentTime = Math.floor(Date.now() / 1000);
        const ttl = parseInt(intentContext.data.ttl);
        
        if (currentTime <= ttl) {
          const attrs = genesysScriptConfig.data;
          (window as any).Genesys('command', 'Database.set', { 
            messaging: {
              customAttributes: attrs,
              intent: intentContext.data.intent
            } 
          });

          await subscribeToEvent('Messenger.ready', () => {
            const genesysMessenger = document.getElementById('genesys-messenger');
            if (genesysMessenger?.classList.contains('genesys-app')) {
              genesysMessenger.style.display = 'block';
              if (typeof (window as any).Genesys === 'function') {
                (window as any).Genesys('command', 'Messenger.open');
              }
            }
            setShouldHideDefaultChat(true);
            mixpanelTrackButtonClick({
              Category: 'Talk to a human',
            });
          });
          return true;
        }
      }
  
      return false;
    } catch (error) {
      logger.error('Error checking intent and starting Genesys', error as any);
      return false;
    }
  };

  const startGenesysMessenger = async () => {
    try {
      if (typeof window === 'undefined' || !isGenesysEnabled) return;

      const attrs = genesysScriptConfig.data;
      (window as any).Genesys('command', 'Database.set', { 
        messaging: {
          customAttributes: attrs
        } 
      });
  
      await subscribeToEvent('Messenger.ready', () => {
        const genesysMessenger = document.getElementById('genesys-messenger');
        if (genesysMessenger?.classList.contains('genesys-app')) {
          genesysMessenger.style.display = 'block';
          if (typeof (window as any).Genesys === 'function') {
            (window as any).Genesys('command', 'Messenger.open');
          }
        }
        setShouldHideDefaultChat(true);
        mixpanelTrackButtonClick({
          Category: 'Talk to a human',
        });
      });
    } catch (error) {
      logger.error('Error starting the genesys webchat', error as any);
    }
  };

  async function onConversationCleared() {
    if (typeof window === 'undefined' || !isGenesysEnabled) return;
    await conversationCleared().then(() => {
      setGenesysAttributes(genesysScriptConfig.data);
      hideAndClearGenesysChat();
      setShouldHideDefaultChat(false);
    });
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !isGenesysEnabled) return;

    const handleBeforeUnload = async () => {
      const isPageReloaded = performance?.navigation?.type === performance?.navigation?.TYPE_RELOAD;
      if (!isPageReloaded) {
        await deleteWebchatHistory();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isGenesysEnabled]);

  return {
    startTalk: startGenesysMessenger,
    checkIntentAndStartGenesys,
    shouldHideDefaultChat,
    isGenesysEnabled,
    shouldHideHelpWidget,
    shouldHideLiveChat,
  };
};

export function getDeploymentId(value: string, bgroup: CmsTenant['businessGroup']) {
  try {
    const configValues = parseBase64toJSON(value);
    if (!configValues) return undefined;

    const bgroupArray = bgroup.values.join(',').toUpperCase().split(',');

    for (const key in configValues) {
      if (bgroupArray.includes(key.toUpperCase())) {
        return configValues[key];
      }
    }

    return undefined;
  } catch (error) {
    logger.error('An error occurred while processing the base64 string:', error as any);
    return undefined;
  }
}
