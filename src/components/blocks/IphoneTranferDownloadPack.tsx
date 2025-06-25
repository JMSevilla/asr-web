import { Stack } from '@mui/material';
import { useState } from 'react';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { Button } from '../buttons/Button';
import { ContentButtonBlock } from './ContentButtonBlock';

interface Props {
  id: string;
  pageKey?: string;
  journeyType?: JourneyTypeSelection;
  queryParams?: { [key: string]: string };
}

export const IphoneTranferDownloadPack: React.FC<Props> = ({ id, journeyType, pageKey, queryParams }) => {
  const [disabled, setDisabled] = useState(true);
  const { buttonByKey } = useGlobalsContext();
  const downloadButton = buttonByKey('iphone_download_transfer_pack_download');
  const continueButton = buttonByKey('iphone_download_transfer_pack_continue');

  return (
    <Stack direction="row" spacing={4} id={id} data-testid="custom-transfer-application-block">
      <Button data-testid="download-download-transfer-btn" {...downloadButton} onClick={handleClick} pageKey={pageKey}>
        {downloadButton?.text}
      </Button>
      <ContentButtonBlock
        {...continueButton}
        data-testid="continue-download-transfer-btn"
        disabled={disabled}
        pageKey={pageKey}
        journeyType={journeyType}
        queryParams={queryParams}
        text={continueButton?.text}
      />
    </Stack>
  );

  function handleClick() {
    setDisabled(false);
  }
};
