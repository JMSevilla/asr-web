import { useFormSubmissionContext } from '../../../../core/contexts/FormSubmissionContext';
import { useRetirementContext } from '../../../../core/contexts/retirement/RetirementContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useStartDbCoreJourneyAction: CustomActionHook = props => {
  const { selectedRetirementDate } = useRetirementContext();
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const formSubmission = useFormSubmissionContext();
  const startCb = useApiCallback(async api => {
    if (props?.pageKey && props?.linkKey && props?.journeyType && selectedRetirementDate) {
      await api.mdp.dBCoreJourneyStart(props.journeyType, {
        currentPageKey: props.pageKey,
        nextPageKey: props.linkKey,
        retirementDate: selectedRetirementDate,
        journeyStatus: 'started',
      });
    }
    await cachedAccessKey.refresh();
    props?.linkKey && (await router.parseUrlAndPush(props.linkKey));
  });

  return {
    execute: startCb.execute,
    loading: router.parsing || router.loading || startCb.loading || cachedAccessKey.loading,
    disableFurtherActions: true,
    disabled: !formSubmission.enabled,
  };
};
