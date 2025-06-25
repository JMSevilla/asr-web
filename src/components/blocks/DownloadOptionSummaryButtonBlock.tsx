import { Box } from '@mui/material';
import { Button } from '..';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
}

export const DownloadOptionSummaryButtonBlock: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { buttonByKey } = useGlobalsContext();
  const { data: accessKey } = useCachedAccessKey();
  const pdfDownloadCb = useApiCallback(async api => {
    if (!accessKey) return Promise.reject();
    const result = await api.mdp.quoteSelectionJourneySelections();
    return await api.mdp.retirementOptionSummaryDownload(accessKey.contentAccessKey, result.data.selectedQuoteName);
  });
  const button = buttonByKey('option_summary_pdf_download_button');

  return (
    <Box id={id} data-testid="download-retirement-application-block">
      <Button {...button} disabled={router.loading} loading={pdfDownloadCb.loading} onClick={onClick}>
        {button?.text}
      </Button>
    </Box>
  );

  async function onClick() {
    await pdfDownloadCb.execute();
  }
};
