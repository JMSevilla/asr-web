import qs from 'query-string';
import { config } from '../../config';
import { CmsGlobals } from './types/globals';
import { TenantResponse } from './types/tenant';

export async function getTenant(tenantUrl: string) {
  if (!config.value.API_URL) {
    throw new Error('API_URL is not defined in the configuration.');
  }

  const response = await fetch(
    `${config.value.API_URL}/content-api/api/v2/content/tenant-content?${qs.stringify(
      { tenantUrl },
      { encode: false },
    )}`,
    { headers: { ENV: config.value.ENVIRONMENT } },
  );

  return ((await response.json()) as TenantResponse).elements ?? null;
}

export async function getPreloadedGlobals(tenantUrl: string) {
  const response = await fetch(
    `${config.value.API_URL}/content-api/api/v2/content/preloaded-globals?${qs.stringify(
      { tenantUrl },
      { encode: false },
    )}`,
    { headers: { ENV: config.value.ENVIRONMENT } },
  );

  return ((await response.json()) as CmsGlobals) ?? null;
}
