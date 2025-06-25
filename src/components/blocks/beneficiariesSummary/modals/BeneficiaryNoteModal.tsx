import { Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { Modal, PrimaryButton } from '../../..';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useBeneficiaryWizardFormContext } from '../beneficiaryWizardForm/BeneficiaryWizardFormContext';

interface Props {
  isOpen: boolean;
  onContinue: () => void;
  onClose: () => void;
}

export const BeneficiaryNoteModal: FC<Props> = ({ isOpen, onContinue, onClose }) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();
  const { form } = useBeneficiaryWizardFormContext();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      topCloseButton={true}
      aria-label={labelByKey('benef_summary_note_modal')}
      maxWidth="sm"
    >
      <Typography mb={8} align="center" variant="h4" fontWeight="bold">
        {labelByKey('benef_payment_note_header')}
      </Typography>
      <Typography mb={8} align="center" variant="body1" component="div">
        {htmlByKey('benef_payment_note_text')}
      </Typography>
      <Grid container>
        <Grid item xs={12} mb={4}>
          <PrimaryButton onClick={handleSave} fullWidth data-testid="beneficiary_note_modal_button">
            {labelByKey('benef_payment_note_button')}
          </PrimaryButton>
        </Grid>
      </Grid>
    </Modal>
  );

  function handleSave() {
    onContinue();
  }
};
