import { useFormSubmissionContext } from '../../../../core/contexts/FormSubmissionContext';
import { CustomActionHook } from '../types';

export const useFormSavingAction: CustomActionHook = () => {
  const formSubmission = useFormSubmissionContext();

  return {
    execute: () => {},
    loading: formSubmission.loading,
    disabled: !formSubmission.unchanged,
  };
};
