import { useState } from 'react';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { SecondaryButton } from '../buttons';
import { CloseAppModal } from './CloseAppModal';

interface Props {
  disabled?: boolean;
}

export const CloseAppButton: React.FC<Props> = ({ disabled }) => {
  const [open, setOpen] = useState(false);
  const { labelByKey } = useGlobalsContext();

  return (
    <>
      <SecondaryButton onClick={onClick} disabled={disabled} data-testid="close_app_save_and_exit">
        {labelByKey('save_and_exit')}
      </SecondaryButton>
      <CloseAppModal open={open} onClose={() => setOpen(false)} />
    </>
  );

  function onClick() {
    setOpen(true);
  }
};
