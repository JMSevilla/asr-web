import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { Button, PrimaryButton } from '../';
import { openInNewTab } from '../../business/navigation';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useRouter } from '../../core/router';
import { DialogBox } from '../DialogBox';
interface Props {
  open: boolean;
  onClose: () => void;
}
export const CloseAppModal: React.FC<Props> = ({ open, onClose }) => {
  const { labelByKey, htmlByKey, buttonByKey } = useGlobalsContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const parseUrlCb = useApiCallback((api, key: string) => api.content.urlFromKey(key));
  const exitButton = buttonByKey('retirement_application_exit');

  return (
    <DialogBox
      data-testid="close-app-modal"
      aria-label={labelByKey('save_and_exit_modal')}
      open={open}
      handleClose={onClose}
      header={labelByKey('journey_save_and_close_modal_title')}
      loading={loading}
    >
      <Grid container spacing={{ xs: 6, sm: 12 }}>
        <Grid item xs={12}>
          <Typography variant="body1" textAlign="center">
            {htmlByKey('journey_save_and_close_modal_text')}
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={4}>
          <Grid item xs={12}>
            <PrimaryButton onClick={onClose} fullWidth data-testid="close_app_modal_save_and_continue">
              {labelByKey('save_and_continue')}
            </PrimaryButton>
          </Grid>
          {exitButton && (
            <Grid item xs={12}>
              <Button
                {...exitButton}
                fullWidth
                loading={loading}
                data-testid="close_app_modal_save_and_exit"
                onClick={handleExitClick}
              >
                {exitButton?.text}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </DialogBox>
  );

  async function handleExitClick() {
    setLoading(true);
    const parsedButtonLink = exitButton?.linkKey ? await parseUrlCb.execute(exitButton.linkKey) : null;
    const redirectUrl = parsedButtonLink?.data?.url;
    setLoading(false);
    if (!redirectUrl) return;
    onClose();
    exitButton?.openInTheNewTab ? openInNewTab(redirectUrl) : router.push(redirectUrl);
  }
};
