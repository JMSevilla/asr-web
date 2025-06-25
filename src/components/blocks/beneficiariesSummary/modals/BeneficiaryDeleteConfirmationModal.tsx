import { Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { Row } from 'react-table';
import { Modal, PrimaryButton, SecondaryButton } from '../../../';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { BeneficiaryFormType } from '../beneficiaryWizardForm/types';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: (row: Row<BeneficiaryFormType>) => void;
  isLoading: boolean;
  context?: Row<BeneficiaryFormType>;
}
export const BeneficiaryDeleteConfirmationModal: FC<Props> = ({ isOpen, onCancel, onDelete, isLoading, context }) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();

  return (
    <Modal
      open={isOpen}
      onClose={onCancel}
      topCloseButton={true}
      maxWidth="sm"
      aria-label={labelByKey('benef_summary_delete_modal')}
    >
      <Typography mb={8} align="center" variant="h4" fontWeight="bold">
        {labelByKey('benef_summary_remove_beneficiary')}
      </Typography>
      <Typography mb={8} align="center" variant="body1" component="div">
        {htmlByKey('benef_summary_remove_question')}
      </Typography>
      <Grid container>
        <Grid item xs={12} mb={4}>
          <PrimaryButton
            onClick={handleDeleteClick}
            loading={isLoading}
            fullWidth
            data-testid="beneficiary_delete_modal_remove_button"
          >
            {labelByKey('benef_summary_remove_button')}
          </PrimaryButton>
        </Grid>
        <Grid item xs={12} mb={8}>
          <SecondaryButton onClick={onCancel} fullWidth data-testid="beneficiary_delete_modal_cancel_button">
            {labelByKey('benef_summary_cancel_button')}
          </SecondaryButton>
        </Grid>
      </Grid>
    </Modal>
  );

  function handleDeleteClick() {
    if (!context) return;

    onDelete(context);
  }
};
