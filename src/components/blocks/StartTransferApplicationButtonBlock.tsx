import { Box } from '@mui/material';
import { Button } from '..';
import { StartTransferJourneyParams } from '../../api/mdp/types';
import { findValueByKey } from '../../business/find-in-array';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
}

export const StartTransferApplicationButtonBlock: React.FC<Props> = ({ id, parameters }) => {
  const router = useRouter();
  const { buttonByKey } = useGlobalsContext();
  const accessKey = useCachedAccessKey();
  const nextPageKey = findValueByKey('success_next_page', parameters);
  const currentPageKey = findValueByKey('current_page', parameters);
  const startJourneyCb = useApiCallback((api, p: StartTransferJourneyParams) => api.mdp.transferJourneyStart(p));
  const button = buttonByKey('start_transfer_start_btn');

  if (!button) return null;

  return (
    <Box id={id} my={8} data-testid="start-transfer-application-block">
      <Button
        {...button}
        data-testid="membership-personal-details-action-btn"
        onClick={onClick}
        loading={router.loading || router.parsing || startJourneyCb.loading || accessKey.loading}
      >
        {button?.text}
      </Button>
    </Box>
  );

  async function onClick() {
    if (!currentPageKey || !nextPageKey) return;

    try {
      accessKey.data?.contentAccessKey &&
        (await startJourneyCb.execute({
          currentPageKey,
          nextPageKey,
          contentAccessKey: accessKey.data.contentAccessKey,
        }));
      await accessKey.refresh();
    } catch {
      return;
    }
    await router.parseUrlAndPush(nextPageKey);
  }
};
