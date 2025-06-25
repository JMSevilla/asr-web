import { config } from '../config';

export function formatUrlParameters(inputUrl: string): Record<string, string | string[]> {
  const url = formatUrl(inputUrl);
  const params = new URLSearchParams(url.search);

  return Array.from(params.entries()).reduce((formattedParams, [key, value]) => {
    const existingValue = formattedParams[key];

    if (existingValue !== undefined) {
      if (Array.isArray(existingValue)) {
        return { ...formattedParams, [key]: [...existingValue, value] };
      } else {
        return { ...formattedParams, [key]: [existingValue, value] };
      }
    } else {
      return { ...formattedParams, [key]: value };
    }
  }, {} as Record<string, string | string[]>);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function ensureHttps(url: string) {
  if (!url.startsWith('https://')) {
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    } else {
      url = 'https://' + url;
    }
  }
  return url;
}

function formatUrlWithDomain(url: string, domain: string): URL {
  const finalDomain = ensureHttps(domain);

  if (isValidUrl(url)) {
    return new URL(url);
  } else {
    return new URL(`${finalDomain}${url.startsWith('/') ? '' : '/'}${url}`);
  }
}

export function formatUrl(url: string) {
  const apiDomain = config.value.API_URL;

  if (!apiDomain) {
    throw new Error('Environment variable API_URL is not set.');
  }

  return formatUrlWithDomain(url, apiDomain);
}

export function formatEpaUrl(url?: string) {
  if (!url) {
    return;
  }

  const epaDomain = config.value.EPA_DOMAIN_NAME;
  if (!epaDomain) {
    throw new Error('Environment variable EPA_DOMAIN_NAME is not set.');
  }

  return formatUrlWithDomain(url, epaDomain);
}

export function getOrigin(url: string): string {
  try {
    const secureUrl = ensureHttps(url);
    const urlObject = new URL(secureUrl);
    return urlObject.origin;
  } catch (error) {
    return '';
  }
}

export function constructUniversalUrlPath(url: string) {
  if (typeof window === 'undefined') {
    return url;
  }

  const origin = getOrigin(url);
  const currentOrigin = window.location.origin;

  if (origin === currentOrigin) {
    return new URL(url).pathname;
  }

  return url;
}
