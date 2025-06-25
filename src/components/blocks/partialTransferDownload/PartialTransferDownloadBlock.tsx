import { Grid } from '@mui/material';
import { PartialTransferDownloadPdfParams } from '../../../api/mdp/types';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useTransferJourneyContext } from '../../../core/contexts/TransferJourneyContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useResolution } from '../../../core/hooks/useResolution';
import { SecondaryButton } from '../../buttons';

interface Props {
  id?: string;
}

export const PartialTransferDownloadBlock: React.FC<Props> = ({ id }) => {
  const accessKey = useCachedAccessKey();
  const { labelByKey } = useGlobalsContext();
  const { isMobile } = useResolution();

  const { transferCalculations, isSubmitting } = useTransferJourneyContext();

  const pdfDownloadCb = useApiCallback((api, params: PartialTransferDownloadPdfParams) =>
    api.mdp.partialTransferDocument(params),
  );

  return (
    <Grid id={id} container>
      <Grid item xs={12}>
        <SecondaryButton
          loading={pdfDownloadCb.loading}
          disabled={
            isSubmitting ||
            (typeof transferCalculations?.requestedResidualPension !== 'number' &&
              typeof transferCalculations?.requestedTransferValue !== 'number')
          }
          fullWidth={isMobile}
          onClick={onClick}
        >
          {labelByKey('PT_save_as_pdf_button')}
        </SecondaryButton>
      </Grid>
    </Grid>
  );

  async function onClick() {
    if (!accessKey.data?.contentAccessKey || !transferCalculations) return;

    await pdfDownloadCb.execute({ ...transferCalculations, contentAccessKey: accessKey.data.contentAccessKey });
  }
};
