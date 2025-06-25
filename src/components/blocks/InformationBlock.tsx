import { useApiCallback } from '../../core/hooks/useApi';
import { useRouter } from '../../core/router';
import { InformationDownloadMessage } from '../InformationDownloadMessage';

interface Props {
  id?: string;
}

export const InformationBlock: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const pdfDownloadCb = useApiCallback(api => api.mdp.retirementJourneyDocument());

  return (
    <InformationDownloadMessage
      id={id}
      onClick={onClick}
      onDownload={onDownload}
      titleKey="retirement_download_title"
      descriptionKey="retirement_download_text"
      downloadKey="retirement_application_download"
      buttonKey="retirement_download_button"
    />
  );

  function onClick() {
    router.parseUrlAndPush('e_documents');
  }

  function onDownload() {
    if (!pdfDownloadCb.loading) {
      pdfDownloadCb.execute();
    }
  }
};
