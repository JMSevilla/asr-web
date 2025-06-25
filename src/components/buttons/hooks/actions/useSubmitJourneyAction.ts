import { useFormSubmissionContext } from '../../../../core/contexts/FormSubmissionContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useSubmitJourneyAction: CustomActionHook = props => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const formSubmission = useFormSubmissionContext();
  const formSubmissionActive = formSubmission.hasCallbacks();
  const startCb = useApiCallback(async api => {
    formSubmissionActive && formSubmission.initiateLoading();
    if (props?.journeyType && cachedAccessKey.data?.contentAccessKey) {
      if (formSubmissionActive) {
        await formSubmission.submit();
      }
      await api.mdp.genericJourneySubmit(props.journeyType, cachedAccessKey.data?.contentAccessKey);
    }
    await cachedAccessKey.refresh();
    props?.linkKey && (await router.parseUrlAndPush(props.linkKey));
  });

  return {
    execute: startCb.execute,
    disabled: !formSubmission.enabled,
    loading: router.parsing || router.loading || startCb.loading || cachedAccessKey.loading || formSubmission.loading,
    disableFurtherActions: true,
  };
};
