import { createContext, useContext, useMemo } from 'react';
import { CmsTenant } from '../../api/content/types/tenant';
import { AuthMethod } from './auth/types';

interface Props {
  tenant: CmsTenant;
  authMethod: AuthMethod;
}

const context = createContext<Props>(undefined as any);

export const useTenantContext = () => {
  if (!context) {
    throw new Error('TenantContextProvider should be used');
  }
  return useContext(context);
};

export const TenantContextProvider: React.FC<React.PropsWithChildren<Props>> = ({ children, tenant, authMethod }) => {
  return (
    <context.Provider
      value={useMemo(
        () => ({
          tenant,
          authMethod,
        }),
        [tenant, authMethod],
      )}
    >
      {children}
    </context.Provider>
  );
};
