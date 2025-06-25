import { Box } from '@mui/material';
import { PrimaryButton } from '..';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
}

export const DownloadRetirementApplicationButtonBlock: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { labelByKey } = useGlobalsContext();
  const { data: accessKey } = useCachedAccessKey();
  const pdfDownloadCb = useApiCallback(api =>
    accessKey ? api.mdp.retirementApplicationDownload(accessKey.contentAccessKey) : Promise.reject(),
  );

  return (
    <Box id={id} data-testid="download-retirement-application-block">
      <PrimaryButton loading={router.loading || pdfDownloadCb.loading} onClick={onClick}>
        {labelByKey('download_retirement_application')}
      </PrimaryButton>
    </Box>
  );

  async function onClick() {
    await pdfDownloadCb.execute();
  }
};
