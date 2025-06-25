import { Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { Modal, PrimaryButton, SecondaryButton } from '../../../';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onSave: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export const BeneficiarySaveConfirmationModal: FC<Props> = ({ isOpen, onCancel, onSave, onClose, isLoading }) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      topCloseButton
      maxWidth="sm"
      aria-label={labelByKey('benef_summary_save_modal')}
    >
      <Typography mb={8} align="center" variant="h4" fontWeight="bold">
        {labelByKey('benef_summary_save_beneficiaries')}
      </Typography>
      <Typography mb={8} align="center" variant="body1" component="div">
        {htmlByKey('benef_summary_save_question')}
      </Typography>
      <Grid container>
        <Grid item xs={12} mb={4}>
          <PrimaryButton onClick={handleSave} loading={isLoading} fullWidth>
            {labelByKey('benef_summary_save_button')}
          </PrimaryButton>
        </Grid>
        <Grid item xs={12} mb={8}>
          <SecondaryButton onClick={onCancel} fullWidth>
            {labelByKey('benef_summary_dont_save_button')}
          </SecondaryButton>
        </Grid>
      </Grid>
    </Modal>
  );

  function handleSave() {
    onSave();
  }
};
