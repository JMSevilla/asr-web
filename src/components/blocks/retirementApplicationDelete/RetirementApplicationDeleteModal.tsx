import { Grid, Typography } from '@mui/material';
import { Modal, PrimaryButton, SecondaryButton } from '../../';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  isLoading: boolean;
}
export const RetirementApplicationDeleteModal: React.FC<Props> = ({ open, onClose, onDelete, isLoading }) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();

  return (
    <Modal
      open={open}
      onClose={onClose}
      topCloseButton={true}
      aria-label={labelByKey('retirement_aplication_delete_modal')}
    >
      <Typography mb={8} align="center" variant="h4" fontWeight="bold">
        {labelByKey('retirement_application_deletion_modal_title')}
      </Typography>
      <Typography mb={8} align="center" variant="body1" component="div">
        {htmlByKey('retirement_application_deletion_modal_text')}
      </Typography>
      <Grid container>
        <Grid item xs={12} mb={8}>
          <PrimaryButton onClick={onClose} fullWidth>
            {labelByKey('retirement_application_deletion_modal_close')}
          </PrimaryButton>
        </Grid>
        <Grid item xs={12}>
          <SecondaryButton onClick={handleDeleteClick} loading={isLoading} fullWidth>
            {labelByKey('retirement_application_deletion_modal_delete')}
          </SecondaryButton>
        </Grid>
      </Grid>
    </Modal>
  );

  function handleDeleteClick() {
    onDelete();
  }
};
