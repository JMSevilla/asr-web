import { useFormSubmissionContext } from '../../../../core/contexts/FormSubmissionContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useStartDcJourneyAction: CustomActionHook = props => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const formSubmission = useFormSubmissionContext();
  const startCb = useApiCallback(async api => {
    const selectedQuote = await api.mdp.quoteSelectionJourneySelections();
    if (props?.pageKey && props?.linkKey && props?.journeyType) {
      await api.mdp.genericDcJourneyStart(props.journeyType, {
        currentPageKey: props.pageKey,
        nextPageKey: props.linkKey,
        selectedQuoteName: selectedQuote.data.selectedQuoteName,
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
