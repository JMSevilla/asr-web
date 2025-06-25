import { JourneyTypeSelection } from '../../../../api/content/types/page';
import { useFormSubmissionContext } from '../../../../core/contexts/FormSubmissionContext';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { useSubmitJourneyStep } from '../../../../core/hooks/useSubmitJourneyStep';
import { CustomActionHook } from '../types';

export const useJourneyFormSubmissionAction: CustomActionHook = params => {
  const { page } = useContentDataContext();
  const journeyType = page?.journeyType?.value?.selection.toLowerCase() as JourneyTypeSelection;
  const submitJourneyStepCb = useSubmitJourneyStep(journeyType);
  const formSubmission = useFormSubmissionContext();

  const submit = async () => {
    journeyType &&
      params?.linkKey &&
      params?.pageKey &&
      (await submitJourneyStepCb.execute({ currentPageKey: params.pageKey, nextPageKey: params.linkKey }));
    await formSubmission.submit();
  };

  return {
    execute: submit,
    loading: formSubmission.loading || submitJourneyStepCb.loading,
    disabled: !formSubmission.enabled,
  };
};
