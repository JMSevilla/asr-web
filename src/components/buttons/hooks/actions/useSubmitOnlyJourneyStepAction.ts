import { useFormSubmissionContext } from '../../../../core/contexts/FormSubmissionContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useSubmitOnlyJourneyStepAction: CustomActionHook = props => {
  const router = useRouter();
  const formSubmission = useFormSubmissionContext();

  const submitCb = useApiCallback(async api => {
    const formSubmissionActive = formSubmission.hasCallbacks();
    formSubmissionActive && formSubmission.initiateLoading();

    if (props?.pageKey && props?.linkKey && props?.journeyType) {
      await api.mdp.genericJourneySubmitStep(props.journeyType, {
        currentPageKey: props.pageKey,
        nextPageKey: props.linkKey,
      });
    }

    if (formSubmissionActive) {
      await formSubmission.submit();
    }
  });

  return {
    execute: submitCb.execute,
    loading: router.parsing || router.loading || submitCb.loading || formSubmission.loading,
    disableFurtherActions: false,
  };
};
