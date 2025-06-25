import { MemberRecord } from '../../../../api/mdp/types';
import { authHeaders } from '../../../../core/contexts/auth/singleAuth/constants';
import { useSingleAuthStorage } from '../../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { httpClient, useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { initializeAnalyticsUser } from '../../../../core/mixpanel-tracker';
import { useRouter } from '../../../../core/router';
import { useCachedSelectedRow } from '../../../blocks/dataTable/dataTableV2/hooks';
import { CustomActionHook } from '../types';
import { useFormSubmissionContext } from './../../../../core/contexts/FormSubmissionContext';

export const useSelectLinkedRecordAction: CustomActionHook = () => {
  const router = useRouter();
  const formSubmission = useFormSubmissionContext();
  const { clearCmsTokens } = useContentDataContext();
  const cachedAccessKey = useCachedAccessKey();
  const [selection] = useCachedSelectedRow();
  const [saData, setSAData] = useSingleAuthStorage();
  const analyticsParamsCb = useApiCallback((api, contentAccessKey: string) =>
    api.mdp.analyticsParams(contentAccessKey),
  );

  const submit = async () => {
    if (!selection?.referenceNumber || !selection?.businessGroup) {
      return;
    }

    const { businessGroup: bgroup, referenceNumber: refno } = selection;

    setSAData(saData => ({
      ...saData,
      linkedBgroup: bgroup,
      linkedRefno: refno,
      memberRecord: selection as unknown as MemberRecord,
    }));

    httpClient.updateHeaders({
      [authHeaders.bgroup]: bgroup,
      [authHeaders.refno]: refno,
    });

    clearCmsTokens();
    const accessKeyResult = await cachedAccessKey.refresh();

    await initializeAnalyticsUser(
      analyticsParamsCb,
      'linked account selected',
      accessKeyResult?.contentAccessKey,
      `${bgroup}${refno}`,
      saData.authGuid,
    );

    await formSubmission.submit();
  };

  const loading = router.parsing || router.loading || cachedAccessKey.loading || formSubmission.loading;

  return {
    execute: submit,
    loading,
    disabled: !formSubmission.enabled,
  };
};