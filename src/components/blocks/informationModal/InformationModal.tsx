import { Box, Typography } from '@mui/material';
import React from 'react';
import { PanelListItem } from '../../../api/content/types/page';
import { CmsButton } from '../../../cms/types';
import { useTenantContext } from '../../../core/contexts/TenantContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { Modal } from '../../Modal';
import { ParsedHtml } from '../../ParsedHtml';
import { PanelBlock } from '../PanelBlock';

interface Props {
  open: boolean;
  onClose: () => void;
  header?: string;
  text?: string;
  buttons?: CmsButton[];
  isAlternateStyle?: boolean;
  hideCloseInAlternateStyle?: boolean;
  panel?: PanelListItem;
}

export const InformationModal: React.FC<Props> = ({
  open,
  onClose,
  header,
  text,
  buttons,
  isAlternateStyle,
  hideCloseInAlternateStyle,
  panel,
}) => {
  const { page } = useContentDataContext();
  const { tenant } = useTenantContext();

  return (
    <Modal
      open={open}
      onClose={onClose}
      showBottomActionButtons={!isAlternateStyle}
      isBottomCloseButtonVisibleXS={isAlternateStyle}
      hideCloseInAlternateStyle={hideCloseInAlternateStyle}
      bottomCloseButton={true}
      bottomActionButtons={buttons}
      data-testid="document-view-modal"
      headerTitle={header}
      maxWidth={'md'}
    >
      {isAlternateStyle && panel ? (
        <Box width={{ xs: 300, sm: 400, md: 660 }}>
          <PanelBlock
            page={page!}
            tenant={tenant}
            header={panel.elements?.header}
            columns={panel.elements?.columns}
            layout={panel.elements?.layout}
            reverseStacking={panel.elements?.reverseStacking}
            panelKey={panel.elements?.panelKey?.value}
          />
        </Box>
      ) : (
        <Typography variant="body1">
          <ParsedHtml html={text || ''} />
        </Typography>
      )}
    </Modal>
  );
};
