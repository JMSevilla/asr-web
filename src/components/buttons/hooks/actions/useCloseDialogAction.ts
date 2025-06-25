import { useDialogContext } from '../../../../core/contexts/dialog/DialogContext';
import { CustomActionHook } from '../types';

export const useCloseDialogAction: CustomActionHook = () => {
  const { closeDialog, loading } = useDialogContext();

  return { execute: closeDialog, loading };
};
