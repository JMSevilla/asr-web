import { Box } from '@mui/material';
import { PrimaryButton } from '..';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { trackButtonClick } from '../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../core/mixpanel-tracker';
import { useRouter } from '../../core/router';
interface Props {
  id?: string;
}

export const DownloadTransferApplicationButtonBlock: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { labelByKey } = useGlobalsContext();
  const pdfDownloadCb = useApiCallback(api => api.mdp.transferDocument());

  return (
    <Box id={id} data-testid="download-transfer-application-block">
      <PrimaryButton loading={router.loading || pdfDownloadCb.loading} onClick={onClick}>
        {labelByKey('download_transfer_application')}
      </PrimaryButton>
    </Box>
  );

  async function onClick() {
    mixpanelTrackButtonClick({
      Category: 'download transfer pack',
    });

    trackButtonClick('download transfer pack');
    await pdfDownloadCb.execute();
  }
};
