import { config } from '../config';
import { getOrigin } from './url';

type CSPDirective = {
  [key: string]: string[];
};

const baseCSP: CSPDirective = {
  'default-src': ["'self'", '*.wtwco.com'],
  'script-src': [
    "'self'",
    '*.wtwco.com',
    '*.awstas.net',
    '*.cookielaw.org',
    'https://digitalfeedback.euro.confirmit.com',
    'http://cdnjs.cloudflare.com',
    'http://cookiepedia.co.uk',
    'http://otsdk',
    'https://cdn.cookielaw.org',
    'https://www.gstatic.com',
    config.value.SURVEY_URL,
    config.value.MATOMO_URL,
    config.value.RECAPTCHA_URL,
    `*.${config.value.GENESYS_DOMAIN}`,
  ],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https://digitalfeedback.euro.confirmit.com'],
  'connect-src': [
    "'self'",
    '*.wtwco.com',
    '*.awstas.net',
    '*.cookielaw.org',
    'https://digitalfeedback.euro.confirmit.com',
    'https://rum.browser-intake-datadoghq.eu',
    'https://cdn.cookielaw.org',
    'https://logs.browser-intake-datadoghq.eu',
    'https://geolocation.onetrust.com',
    'http://cookiepedia.co.uk',
    'http://otsdk',
    'blob:',
    config.value.API_URL,
    config.value.MATOMO_URL,
    config.value.MIXPANEL_URL,
    config.value.SURVEY_SCRIPT_URL,
    `*.${config.value.GENESYS_DOMAIN}`,
    config.value.SHYRKA_URL,
    config.value.SURVEY_URL,
    config.value.GENESYS_WSS_URL,
    getOrigin(config.value.SINGLE_AUTH_URL_AUTHORITY),
    'wss://cobrowse-v2.euw2.pure.cloud',
  ],
  'img-src': ["'self'", 'https://cdnjs.cloudflare.com', 'https://cdn.cookielaw.org', 'data:', config.value.CMS_URL],
  'font-src': ["'self'", 'data:'],
  'frame-src': [
    "'self'",
    '*.wtwco.com',
    config.value.RECAPTCHA_URL,
    `*.${config.value.GENESYS_DOMAIN}`,
    config.value.VIDEO_RESOURCES,
    config.value.SHYRKA_URL,
    '*.internal.towerswatson.com',
  ],
  'frame-ancestors': ["'self'", '*.internal.towerswatson.com'],
};

export function generateCSP(nonce: string): string {
  const cspWithNonce = {
    ...baseCSP,
    'script-src': [...baseCSP['script-src'], `'nonce-${nonce}'`],
  };

  return Object.entries(cspWithNonce)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

export function setCSPHeader(res: any, csp: string, isDevelopment: boolean) {
  if (!isDevelopment && !res.headersSent) {
    res.setHeader('Content-Security-Policy', csp);
  }
}
