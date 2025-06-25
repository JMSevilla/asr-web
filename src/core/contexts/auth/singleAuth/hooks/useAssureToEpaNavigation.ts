import { isTrue } from "../../../../../business/boolean";
import { logger } from "../../../../datadog-logs";
import { useTenantContext } from "../../../TenantContext";
import { useSingleAuthStorage } from "./useSingleAuthStorage";
import { useSsoOutboundUrl } from "./useSsoOutboundUrl";

export const useAssureToEpaNavigation = () => {
  const ssoOutbound = useSsoOutboundUrl();
  const [saData] = useSingleAuthStorage();
  const { tenant } = useTenantContext();

  const defaultRecordNumber = 1;
  const baseSsoUrl = tenant.outboundSsoUrl?.value;

  const prepareEpaPath = async (path: string): Promise<string> => {
    const { primaryBgroup, primaryRefno, memberRecord, hasMultipleRecords, isAdmin } = saData;
    const memberRecordExists = (primaryBgroup && primaryRefno) || memberRecord;

    if (isTrue(isAdmin)) {
      const encodedPath = encodeURIComponent(path);
      return `/sa/logout?postLogoutRedirectUri=${encodedPath}`;
    }

    if (!memberRecordExists) {
      logger.error('Cannot execute ePA SSO outbound without all required parameters', saData);
      return path;
    }

    if (!baseSsoUrl) {
      logger.error('No outbound SSO URL found in tenant data');
      return path;
    }

    try {
      const outboundurl = await ssoOutbound.getSsoOutboundUrl({
        targetUrl: path,
        baseSsoUrl: baseSsoUrl,
        recordNumber: memberRecord ? memberRecord.recordNumber : defaultRecordNumber,
        hasMultipleRecords: isTrue(hasMultipleRecords)
      });

      if (ssoOutbound.error) {
        throw new Error('Failed to get SSO outbound URL');
      }

      return outboundurl;

    } catch (error) {
      return path;
    }
  };

  return {
    prepareEpaPath,
    loading: ssoOutbound.loading,
    error: ssoOutbound.error
  };
};
