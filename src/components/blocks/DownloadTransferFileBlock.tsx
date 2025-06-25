import { useApiCallback } from '../../core/hooks/useApi';
import { trackButtonClick } from '../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../core/mixpanel-tracker';
import { useRouter } from '../../core/router';
import { InformationDownloadMessage } from '../InformationDownloadMessage';

interface Props {
  id?: string;
}

export const DownloadTransferFileBlock: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const pdfDownloadCb = useApiCallback(api => api.mdp.transferDocument());

  return (
    <InformationDownloadMessage
      id={id}
      onClick={onClick}
      onDownload={onDownload}
      titleKey="transfer_file_download_title"
      descriptionKey="transfer_file_download_text"
      downloadKey="transfer_file_download"
      buttonKey="transfer_file_download_button"
    />
  );

  function onClick() {
    router.parseUrlAndPush('e_documents');
  }

  async function onDownload() {
    mixpanelTrackButtonClick({
      Category: 'download transfer pack',
    });
    trackButtonClick('download transfer pack');
    await pdfDownloadCb.execute();
  }
};
