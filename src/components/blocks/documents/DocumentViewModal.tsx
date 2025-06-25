import { CircularProgress, Grid, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';
import { DownloadIcon, Modal, PDFViewer, SecondaryButton } from '../..';
import { CmsTenant } from '../../../api/content/types/tenant';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi } from '../../../core/hooks/useApi';
import { trackButtonClick } from '../../../core/matomo-analytics';

import { mixpanelTrackButtonClick } from '../../../core/mixpanel-tracker';
import { MessageType } from '../../topAlertMessages';
import { AlertMessage } from '../../topAlertMessages/AlertMessage';

interface Props {
  open: boolean;
  onClose: () => void;
  tenant: CmsTenant | null;
  documentId: string;
}
export const DocumentViewModal: React.FC<Props> = ({ open, onClose, documentId, tenant }) => {
  const { labelByKey, errorByKey } = useGlobalsContext();
  const theme = useTheme();
  const [isPDFLoaded, setIsPDFLoaded] = useState(false);
  const document = useApi(api => api.mdp.downloadUserDocument(documentId));
  const errors = document.error as string[] | undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      topCloseButton={true}
      data-testid="document-view-modal"
      headerBackgroundColor={theme.palette.primary.main}
      headerColor={theme.palette.common.white}
      tenant={tenant}
      maxWidth={false}
    >
      {document.loading && (
        <Box width="100%" height="100%" my={4} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={36} />
        </Box>
      )}

      {errors && errors.map(e => <AlertMessage key={e} type={MessageType.Problem} html={errorByKey(e)} />)}
      {document.result?.url && <PDFViewer fileUrl={document.result.url} onLoaded={handlePDFLoaded} />}
      {document?.result?.file && isPDFLoaded && (
        <Grid mt={4} item xs={12} container spacing={4}>
          <Grid item>
            <SecondaryButton onClick={handleDownloadClick} data-testid="modal-download-button">
              <Box display="flex" mr={2}>
                <DownloadIcon customColor={theme.palette.primary.main} />
              </Box>
              {labelByKey('my_doc_download')}
            </SecondaryButton>
          </Grid>
        </Grid>
      )}
    </Modal>
  );

  function handleDownloadClick() {
    mixpanelTrackButtonClick({
      Category: 'download document',
    });
    trackButtonClick('download document');
    if (document.result?.file) {
      saveAs(document.result?.file, `document-${documentId}.pdf`);
    }
  }

  function handlePDFLoaded() {
    setIsPDFLoaded(true);
  }
};
