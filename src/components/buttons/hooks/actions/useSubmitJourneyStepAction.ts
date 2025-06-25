import { useFormSubmissionContext } from '../../../../core/contexts/FormSubmissionContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useJourneyNavigation } from '../../../../core/hooks/useJourneyNavigation';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useSubmitJourneyStepAction: CustomActionHook = props => {
  const router = useRouter();
  const formSubmission = useFormSubmissionContext();
  const cachedAccessKey = useCachedAccessKey();
  const journeyNavigation = useJourneyNavigation(props?.journeyType, props?.linkKey);

  const submitCb = useApiCallback(async api => {
    const formSubmissionActive = formSubmission.hasCallbacks();
    formSubmissionActive && formSubmission.initiateLoading();

    if (props?.pageKey && props?.linkKey && props?.journeyType) {
      await api.mdp.genericJourneySubmitStep(props.journeyType, {
        currentPageKey: props.pageKey,
        nextPageKey: props.linkKey,
      });
    }

    if (props?.actionParam === 'recalculate-access-key') {
      await cachedAccessKey.refresh();
    }

    if (formSubmissionActive) {
      await formSubmission.submit();
    }

    if (props?.linkKey) {
      await journeyNavigation.goNext();
    }
  });

  return {
    execute: submitCb.execute,
    disabled: !formSubmission.enabled,
    loading: router.parsing || router.loading || submitCb.loading || formSubmission.loading,
    disableFurtherActions: true,
  };
};
