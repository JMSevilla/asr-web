import { Box, Stack, Typography } from '@mui/material';
import { Badge } from '../../';
import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { CaseDocumentsListItem } from '../../../api/mdp/types';
import { formatDate } from '../../../business/dates';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi } from '../../../core/hooks/useApi';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { Button } from '../../buttons';

interface Props {
  id: string;
  pageKey: string;
  panelList?: PanelListItem[];
  journeyType?: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}

export const CaseTrackerBlock: React.FC<Props> = ({ id, parameters, panelList }) => {
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const { panelByKey } = usePanelBlock(panelList);
  const caseType = findValueByKey('case_type', parameters);
  const documentCodes = findValueByKey('document_codes', parameters)?.split(';') ?? [];
  const caseDocuments = useApi(api => (caseType ? api.mdp.caseDocuments(caseType) : Promise.reject()), [caseType]);
  const documents = documentCodes
    .map(code => caseDocuments.result?.data.documents.find(({ tag }) => tag === code))
    .filter(Boolean) as CaseDocumentsListItem[];
  const noItemsPanel = panelByKey(`case_tracker_empty_panel`);

  return (
    <Stack
      id={id}
      spacing={6}
      data-testid="case-tracker-block"
      component="ul"
      sx={{
        marginBlockStart: 0,
        marginBlockEnd: 0,
        paddingInlineStart: 0,
        listStyleType: 'none',
      }}
    >
      {documents.length === 0 && noItemsPanel}
      {documents.map((caseDoc, index) => (
        <Stack
          key={caseDoc.tag}
          component="li"
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={4}
          p={6}
          bgcolor={containerBg(caseDoc.status)}
          border="2px solid"
          borderRadius="4px"
          borderColor={statusBg(caseDoc.status)}
          data-testid={`case-doc-${caseDoc.tag}`}
        >
          <Stack spacing={2}>
            <Badge
              id={`panel-status-${index + 1}`}
              accessibilityText={labelByKey(`${id}_status_text`)}
              text={labelByKey(`tracking_document_status_${caseDoc.status}`)}
              backgroundColor={statusBg(caseDoc.status)}
              color={caseDoc.status !== 'AWR' ? 'primary.contrastText' : 'text.primary'}
            />
            <Typography
              id={`panel-heading-${index + 1}`}
              aria-describedby={`panel-status-${index + 1}`}
              variant="h2"
              fontWeight="bold"
            >
              {labelByKey(`tracking_document_name_${caseDoc.tag}`)}
            </Typography>
            {caseDoc.receivedDate && (
              <Typography>
                <Box component="span" className="visually-hidden" aria-describedby={`panel-heading-${index + 1}`}>
                  {labelByKey(`${id}_status_update_on_text`)}
                </Box>
                {formatDate(caseDoc.receivedDate)}
              </Typography>
            )}
          </Stack>
          {shouldDisplayButton(caseDoc.status) && !!buttonByKey(`tracking_document_upload_${caseDoc.tag}`)?.key && (
            <Box>
              <Button
                {...buttonByKey(`tracking_document_upload_${caseDoc.tag}`)}
                disabled={caseDoc.status === 'NA'}
                type="Critical"
              />
            </Box>
          )}
        </Stack>
      ))}
    </Stack>
  );
};

function shouldDisplayButton(status: CaseDocumentsListItem['status']) {
  switch (status) {
    case 'INC':
    case 'MIR':
    case 'NA':
      return true;
    case 'AWR':
    case 'COMP':
    default:
      return false;
  }
}

function containerBg(status: CaseDocumentsListItem['status']) {
  switch (status) {
    case 'INC':
    case 'MIR':
      return 'error.light';
    case 'AWR':
      return 'warning.light';
    case 'COMP':
      return 'success.light';
    case 'NA':
      return 'appColors.incidental.035';
  }
}

function statusBg(status: CaseDocumentsListItem['status']) {
  switch (status) {
    case 'INC':
    case 'MIR':
      return 'error.main';
    case 'AWR':
      return 'warning.main';
    case 'COMP':
      return 'success.main';
    case 'NA':
      return 'appColors.grey';
  }
}
