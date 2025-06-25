import React, { useEffect } from 'react';
import { MessageType } from '../..';
import { CmsTenant } from '../../../api/content/types/tenant';
import { MdpUserParams, TransferJourneySubmitData } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useRouter } from '../../../core/router';
interface Props {
  id: string;
  parameters: { key: string; value: string }[];
  tenant: CmsTenant | null;
}

export const TransferSubmissionFormBlock: React.FC<Props> = ({ id, parameters, tenant }) => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const { errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { clearCmsTokens } = useContentDataContext();
  const version3 = findValueByKey('version', parameters) === '3';
  const successPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const submitJourneyCb = useApiCallback(async (api, data: TransferJourneySubmitData) => {
    const result = version3 ? await api.mdp.transferJourneySubmitV3(data) : await api.mdp.transferJourneySubmit(data);
    clearCmsTokens();
    return result;
  });
  const userRetirementApplicationStatusCb = useApiCallback((api, params: MdpUserParams) =>
    api.mdp.userRetirementApplicationStatus(params),
  );
  useFormSubmissionBindingHooks({ key: id, isValid: true, cb: onSubmit });

  useEffect(() => {
    const errors = submitJourneyCb.error as string[] | undefined;
    errors && showNotifications(errors.map(error => ({ type: MessageType.Problem, message: errorByKey(error) })));
    return () => hideNotifications();
  }, [submitJourneyCb.error, showNotifications, errorByKey]);

  // MAB-4671 Checkboxes form will be added and moved to TransferSubmissionForm component
  return null;

  async function onSubmit() {
    try {
      await submitJourneyCb.execute({
        contentAccessKey: cachedAccessKey.data!.contentAccessKey,
      });
      await userRetirementApplicationStatusCb.execute({
        preRetirementAgePeriod: tenant?.preRetiremetAgePeriod?.value ?? 0,
        newlyRetiredRange: tenant?.newlyRetiredRange?.value ?? 0,
        retirementApplicationPeriod: 6,
      });
      await cachedAccessKey.refresh();
      await router.parseUrlAndPush(successPageKey);
    } catch {}
  }
};
