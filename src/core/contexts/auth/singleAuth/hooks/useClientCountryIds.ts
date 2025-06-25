import { useTenantContext } from "../../../TenantContext";

export const useClientCountryIds = () => {
  const { tenant } = useTenantContext();

  return {
    idv: tenant.clientCountryIdSaDirectRoutes?.value || '',
    workEmail: tenant.clientCountryIdWorkEmail?.value || '',
    sso: tenant.clientCountryIdPostSsoRoutes?.value || '',
  };
};
