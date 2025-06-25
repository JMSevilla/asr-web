import { useTenantContext } from '../../../core/contexts/TenantContext';
import { useApi } from '../../../core/hooks/useApi';

export const usePageFeedWidgetData = (pageUrls: string[]) => {
  const { tenant } = useTenantContext();
  const { loading, error, result } = useApi(api => api.content.pageFeedWidgets(tenant.tenantUrl.value, pageUrls));

  return { loading, error, widgets: result?.data?.widgets ?? [] };
};
