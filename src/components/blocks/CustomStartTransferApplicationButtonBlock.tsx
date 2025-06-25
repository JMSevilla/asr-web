import { Stack } from '@mui/material';
import { Button, ContentButtonBlock } from '..';
import { ButtonType, FileValue } from '../../api/content/types/common';
import { StartTransferJourneyParams } from '../../api/mdp/types';
import { findValueByKey } from '../../business/find-in-array';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';

type ButtonProps = {
  linkKey?: string;
  link?: string;
  type?: ButtonType;
  text?: string;
  icon?: FileValue;
  reuseUrlParameters?: boolean;
  openInTheNewTab?: boolean;
  widthPercentage?: number;
};

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
  buttons: ButtonProps[];
}

export const CustomStartTransferApplicationButtonBlock: React.FC<Props> = ({ id, parameters, buttons }) => {
  const router = useRouter();
  const { buttonByKey } = useGlobalsContext();
  const cachedAccessKey = useCachedAccessKey();
  const nextPageKey = findValueByKey('success_next_page', parameters);
  const currentPageKey = findValueByKey('current_page', parameters);
  const startJourneyCb = useApiCallback((api, p: StartTransferJourneyParams) => api.mdp.transferV2JourneyStart(p));
  const button = buttonByKey('start_transfer_app_v2_button');

  if (!button) return null;

  return (
    <Stack direction="row" spacing={4} id={id} data-testid="custom-transfer-application-block">
      <Button
        {...button}
        data-testid="start-ta-action-btn"
        onClick={handleStart}
        loading={router.loading || router.parsing || startJourneyCb.loading || cachedAccessKey.loading}
      >
        {button?.text}
      </Button>

      {buttons.map((btn, idx) => (
        <ContentButtonBlock key={idx} {...btn} widthPercentage={btn.widthPercentage ? 100 : undefined} />
      ))}
    </Stack>
  );

  async function handleStart() {
    if (!currentPageKey || !nextPageKey) return;

    try {
      cachedAccessKey.data?.contentAccessKey &&
        (await startJourneyCb.execute({
          currentPageKey,
          nextPageKey,
          contentAccessKey: cachedAccessKey.data?.contentAccessKey,
        }));
      await cachedAccessKey.refresh();
    } catch {
      return;
    }
    await router.parseUrlAndPush(nextPageKey);
  }
};
