import { logger } from './datadog-logs';

export type GenesysParameters = {
  referenceNumber: string;
  bgroup: string;
  memberForename: string;
  platform: string;
  env: string;
  intent?: string;
};

export type ConfigProps = {
  environment: string;
  deploymentId: string | undefined | null;
  debug: boolean;
};

const GENESYS_KEY = 'Genesys';
export function setupGenesysGlobals(config: ConfigProps) {
  if (typeof window === 'undefined') return;

  const genesysKey =
    (window as any)[GENESYS_KEY] ||
    function () {
      const q = (window as any)[GENESYS_KEY].q || [];
      q.push(arguments);
      (window as any)[GENESYS_KEY].q = q;
    };

  (window as any)['_genesysJs'] = GENESYS_KEY;
  (window as any)[GENESYS_KEY] = genesysKey;
  (window as any)[GENESYS_KEY].t = new Date().getTime();
  (window as any)[GENESYS_KEY].c = config;
}

export function isScriptLoaded(url: string) {
  return !!document.querySelector(`script[src="${url}"]`);
}

export async function insertScriptElement(url: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const scriptElem = document.createElement('script');
    scriptElem.async = true;
    scriptElem.src = url;
    scriptElem.onload = () => resolve();
    scriptElem.onerror = () => reject(new Error('Script failed to load'));
    document.head.appendChild(scriptElem);
  });
}

export async function hideAndClearGenesysChat() {
  const genesysMessenger = document.getElementById('genesys-messenger');
  if (genesysMessenger?.classList.contains('genesys-app')) {
    genesysMessenger.setAttribute('aria-hidden', 'true');
    genesysMessenger.style.display = 'none';
    await deleteWebchatHistory();
  }
}

export async function subscribeToGenesysEvents(data: GenesysParameters): Promise<void> {
  await subscribeToEvent('Messenger.ready', async () => {
    await subscribeToEvent('MessagingService.ready', () => {
      setGenesysAttributes(data);
    });
    await subscribeToEvent('MessagingService.conversationDisconnected', () => {
      setGenesysAttributes(data);
    });
  });
}

/**
 * This functions purpose is to control the `talk to a human` button
 * for it to show/hide since currently cms cannot control it properly.
 * this implementation is temporary and will be removed when cms control is present
 *
 * @param label - The button label string to be checked.
 * @returns True if the label contains the '[[' substring else false
 */
export function isButtonLabelNotFound(label: string) {
  return label.includes('[[');
}

export async function subscribeToEvent(eventName: string, callback: () => void): Promise<void> {
  return new Promise<void>(resolve => {
    (window as any)[GENESYS_KEY]('subscribe', eventName, () => {
      callback();
      resolve();
    });
  });
}

export function setGenesysAttributes(o: GenesysParameters) {
  if (!(typeof o === 'object' && !Array.isArray(o) && o === Object(o))) return;
  if (typeof window === 'undefined') return;
  (window as any)[GENESYS_KEY]('command', 'Database.set', {
    messaging: {
      customAttributes: o,
    },
  });
}

export function isWebChatActive(): boolean {
  const webchatSessionKey = Object.keys(localStorage).find(key => key.includes('gcmcsessionActive'));
  return webchatSessionKey ? !!localStorage.getItem(webchatSessionKey) : false;
}

export async function deleteGenesysChatStorage() {
  try {
    const status = isWebChatActive();
    if (typeof status !== 'undefined' && status) {
      localStorage.removeItem('_actmu');
      Object.keys(localStorage).forEach(key => key.includes(':gcmcsession') && localStorage.removeItem(key));
    }
  } catch (error) {
    logger.error('Error during webchat storage deletion', error as any);
  }
}

export async function deleteWebchatHistory() {
  if (typeof window === 'undefined' || !isWebChatActive()) return;
  try {
    (window as any).Genesys('command', 'MessagingService.clearConversation', function () {
      deleteGenesysChatStorage();
    });
    await conversationCleared();
  } catch (error) {
    logger.error('Error during webchat history deletion', error as any);
  }
}

export async function conversationCleared() {
  return new Promise<void>((resolve, reject) => {
    try {
      (window as any).Genesys('subscribe', 'MessagingService.conversationCleared', function () {
        resolve();
      });
    } catch (error) {
      logger.error('Error during conversationCleared', error as any);
      reject(error);
    }
  });
}
