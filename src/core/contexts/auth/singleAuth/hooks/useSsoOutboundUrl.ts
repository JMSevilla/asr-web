import { CmsTenant } from "../../../../../api/content/types/tenant";
import { useApiCallback } from "../../../../hooks/useApi";

export interface LookupCodeParams {
  recordNumber: number;
  hasMultipleRecords: boolean;
}

export interface SsoOutboundUrlParams {
  targetUrl: string;
  baseSsoUrl: string;
  recordNumber: number;
  hasMultipleRecords: boolean;
}

export const useSsoOutboundUrl = () => {
  const getLookupCodeCb = useApiCallback((api, params: LookupCodeParams) =>
    api.mdp.outboundSsoLookupCode(params.recordNumber, params.hasMultipleRecords)
      .then(result => result.data.lookupCode)
  );

  const buildRelayState = (url: string): string => {
    const originalUrl = new URL(url);
    const origin = originalUrl.origin;
    const originalPath = originalUrl.pathname;

    const relayStateUrl = new URL(`${origin}/accounts/ssosamlgen/`);
    relayStateUrl.searchParams.set('next', originalPath);

    originalUrl.searchParams.forEach((value, key) => {
      if (key !== 'next') {
        relayStateUrl.searchParams.append(key, value);
      }
    });

    return relayStateUrl.toString();
  };

  const getSsoOutboundUrl = async (params: SsoOutboundUrlParams): Promise<string> => {
    const { targetUrl, baseSsoUrl, recordNumber, hasMultipleRecords } = params;

    const lookupCode = await getLookupCodeCb.execute({
      recordNumber,
      hasMultipleRecords
    });

    const relayState = buildRelayState(targetUrl);
    const outboundUrl = new URL(baseSsoUrl);
    outboundUrl.searchParams.set('relayState', relayState);
    outboundUrl.searchParams.set('lookupCode', lookupCode);

    return outboundUrl.toString();
  }

  return {
    getSsoOutboundUrl,
    loading: getLookupCodeCb.loading,
    error: getLookupCodeCb.error
  };
};