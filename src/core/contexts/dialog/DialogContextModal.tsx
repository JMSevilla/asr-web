import { Grid, Typography } from '@mui/material';
import { callToActionValuesToCmsButtons } from '../../../cms/parse-cms';
import { CmsButton } from '../../../cms/types';
import { Button, ListLoader, ParsedHtml, SecondaryButton } from '../../../components';
import { useDataReplacerApi } from '../../hooks/useDataReplacerApi';
import { CustomDialogElement } from './DialogContext';

interface Props {
  dialogElement?: CustomDialogElement;
  isButtonLoading: boolean;
  sourceUrl?: string;
  handleButtonClick: (button: CmsButton) => any;
  handleClose: () => void;
  modalSubContent?: string;
}

export const DialogContextModal: React.FC<Props> = ({
  dialogElement,
  isButtonLoading,
  sourceUrl,
  handleButtonClick,
  handleClose,
  modalSubContent,
}) => {
  const replacer = useDataReplacerApi(sourceUrl);
  const modalContent = replacer.replaceDataInText(dialogElement?.value?.elements?.text?.value);

  if (replacer.loading) {
    return <ListLoader data-testid="modal-content-loader" loadersCount={2} />;
  }

  const actionButtons = callToActionValuesToCmsButtons(dialogElement?.value?.elements?.callToAction?.values ?? []);
  const closeButton = dialogElement?.value?.elements?.closeDialogButtonText?.value;

  return (
    <Grid container spacing={{ xs: 6, sm: 12 }} {...replacer.elementProps('dialog-modal')}>
      <Grid item xs={12}>
        {modalContent && (
          <>
            <Typography variant="body1" textAlign="center" component="div" data-testid="modal-content">
              <ParsedHtml html={modalContent} />
            </Typography>
            {modalSubContent && (
              <Typography
                mt={7}
                variant="body1"
                textAlign="center"
                component="div"
                data-testid="websession-label-content"
              >
                {modalSubContent}
              </Typography>
            )}
          </>
        )}
      </Grid>
      {(actionButtons.length > 0 || closeButton) && (
        <Grid item xs={12} container spacing={4}>
          {actionButtons.map(({ text, ...button }, index) => (
            <Grid item xs={12} key={index}>
              <Button
                fullWidth
                onClick={handleButtonClick(button)}
                data-testid={`action-button-${index}`}
                loading={isButtonLoading}
                {...button}
              >
                {text}
              </Button>
            </Grid>
          ))}
          {closeButton && modalSubContent && (
            <Grid item xs={12}>
              <SecondaryButton
                fullWidth
                onClick={handleClose}
                data-testid="close-dialog-button"
                disabled={isButtonLoading}
              >
                {closeButton}
              </SecondaryButton>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};
