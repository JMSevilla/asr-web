import { SsoLogoutBlock, SsoSuccessBlock } from '.';
import { parseCmsParams } from '../../../cms/parse-cms';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useTenantContext } from '../../../core/contexts/TenantContext';
import { findBlockByKey } from './utils';

export const SsoAuthentication: React.FC = () => {
  const { tenant } = useTenantContext();
  const contentData = useContentDataContext();
  const contents = contentData.page?.content.values || [];

  const ssoSuccessBlock = findBlockByKey(contents, 'sso_success');
  if (ssoSuccessBlock) {
    return (
      <SsoSuccessBlock
        preRetirementAgePeriod={tenant?.preRetiremetAgePeriod?.value ?? 0}
        newlyRetiredRange={tenant?.newlyRetiredRange?.value ?? 0}
        parameters={parseCmsParams(ssoSuccessBlock.elements.parameters!.values)}
      />
    );
  }

  const ssoLogoutBlock = findBlockByKey(contents, 'sso_logout');
  if (ssoLogoutBlock) {
    return <SsoLogoutBlock />;
  }

  const ssoFailedBlock = findBlockByKey(contents, 'sso_failed');
  if (ssoFailedBlock) {
    return <SsoLogoutBlock />;
  }

  return null;
};
