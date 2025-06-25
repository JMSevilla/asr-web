import { Box, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { Badge, OneColumnBlockLoader } from '../..';
import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { isFalse, isTrue } from '../../../business/boolean';
import { formatDate } from '../../../business/dates';
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
  dataSourceUrl?: string;
  trackerItems: TrackerItem[];
}

type TrackerItem = {
  stageKey: string;
  trackerItemHeader: string;
  firstPage: string;
  endPage: string;
  hideButton?: boolean;
};

type TrackerStatus = 'missing' | 'incomplete' | 'completed';
type ExtendedTrackerItem = TrackerItem & { status: TrackerStatus; completedDate?: string | null };
type TrackerStage = { stage: string; completedDate?: string | null; inProgress?: boolean };

export const TrackerBlock: React.FC<Props> = ({ id, panelList, journeyType, dataSourceUrl, trackerItems }) => {
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const { panelByKey } = usePanelBlock(panelList);
  const stages = useApi(
    async api => {
      if (!dataSourceUrl) {
        return Promise.reject();
      }
      const result = await api.mdp.postByUrl<TrackerStage[]>(dataSourceUrl, {
        stages: trackerItems.map(trackerItemToReqBody),
      });
      return result.data
        .map<ExtendedTrackerItem>(stage => ({
          ...stage,
          ...trackerItems.find(item => item.stageKey === stage.stage)!,
          status: trackerStatus(stage),
        }))
        .sort(sortByStatus);
    },
    [dataSourceUrl],
  );

  if (stages.loading) {
    return <OneColumnBlockLoader id={id} data-testid="tracker-block-loader" />;
  }

  const noItemsPanel = panelByKey(`tracker_empty_panel`);
  const betweenCompletedIncompletePanel = panelByKey(`tracking_${journeyType}_between_completed_incomplete_panel`);
  const betweenIncompleteMissingPanel = panelByKey(`tracking_${journeyType}_between_incomplete_missing_panel`);

  return (
    <Stack
      id={id}
      gap={6}
      data-testid="tracker-block"
      component="ul"
      sx={{
        marginBlockStart: 0,
        marginBlockEnd: 0,
        paddingInlineStart: 0,
        listStyleType: 'none',
      }}
    >
      {stages.result?.length === 0 && noItemsPanel}
      {stages.result?.map((item, index) => (
        <Fragment key={index}>
          <Stack
            component="li"
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            gap={4}
            p={6}
            bgcolor={containerBg(item.status)}
            border="2px solid"
            borderRadius="4px"
            borderColor={statusBg(item.status)}
            data-testid={`tracker-item-${item.stageKey}`}
          >
            <Stack gap={2}>
              <Badge
                data-testid={`${item.stageKey}-${item.status}`}
                id={`panel-status-${index + 1}`}
                accessibilityText={labelByKey(`${id}_status_text`)}
                text={labelByKey(`tracking_stage_status_${item.status}`)}
                backgroundColor={statusBg(item.status)}
                color={'common.white'}
              />
              <Typography
                id={`panel-heading-${index + 1}`}
                aria-describedby={`panel-status-${index + 1}`}
                variant="h3"
                fontWeight="bold"
                sx={{ wordBreak: 'break-word' }}
              >
                {item.trackerItemHeader}
              </Typography>
              {item.completedDate && (
                <Typography>
                  <Box component="span" className="visually-hidden" aria-describedby={`panel-heading-${index + 1}`}>
                    {labelByKey(`${id}_status_update_on_text`)}
                  </Box>
                  {formatDate(item.completedDate)}
                </Typography>
              )}
            </Stack>
            {!item.hideButton &&
              item.status === 'completed' &&
              !!buttonByKey(`tracking_${journeyType}_${item.stageKey}_button`)?.key && (
                <Button
                  {...buttonByKey(`tracking_${journeyType}_${item.stageKey}_button`)}
                  data-testid={`tracker-item-${item.stageKey}-button`}
                  type="Success"
                />
              )}
            {!item.hideButton &&
              item.status === 'incomplete' &&
              !!buttonByKey(`tracking_${journeyType}_continue_button`)?.key && (
                <Button
                  {...buttonByKey(`tracking_${journeyType}_continue_button`)}
                  data-testid={`tracker-item-${item.stageKey}-button`}
                  type="Critical"
                />
              )}
          </Stack>
          {isLastOfStatus('completed', index) && betweenCompletedIncompletePanel && (
            <li>{betweenCompletedIncompletePanel}</li>
          )}
          {isLastOfStatus('incomplete', index) && betweenIncompleteMissingPanel && (
            <li>{betweenIncompleteMissingPanel}</li>
          )}
        </Fragment>
      ))}
    </Stack>
  );

  function isLastOfStatus(status: TrackerStatus, index: number) {
    const currentItem = stages.result?.[index],
      nextItem = stages.result?.[index + 1];
    const currentItemIsOfStatus = currentItem && currentItem.status === status;
    const nextItemIsNotOfStatus = nextItem && nextItem.status !== status;
    return currentItemIsOfStatus && nextItemIsNotOfStatus;
  }
};

function containerBg(status?: TrackerStatus) {
  switch (status) {
    case 'incomplete':
      return 'error.light';
    case 'completed':
      return 'success.light';
    case 'missing':
    default:
      return 'primary.light';
  }
}

function statusBg(status?: TrackerStatus) {
  switch (status) {
    case 'incomplete':
      return 'error.main';
    case 'completed':
      return 'success.main';
    case 'missing':
    default:
      return 'primary.main';
  }
}

const trackerStatus = (trackerStage: TrackerStage): TrackerStatus => {
  if (!trackerStage.completedDate && isFalse(trackerStage.inProgress)) {
    return 'missing';
  }

  if (!trackerStage.completedDate && isTrue(trackerStage.inProgress)) {
    return 'incomplete';
  }

  if (trackerStage.completedDate && isFalse(trackerStage.inProgress)) {
    return 'completed';
  }

  return 'missing';
};

const trackerItemToReqBody = (trackerItem: TrackerItem) => {
  return {
    stage: trackerItem.stageKey,
    page: { start: trackerItem.firstPage.split(';'), end: trackerItem.endPage.split(';') },
  };
};

const sortByStatus = (item1: ExtendedTrackerItem, item2: ExtendedTrackerItem) => {
  if (item1.status === item2.status) {
    return 0;
  }

  if (item1.status === 'completed') {
    return -1;
  }

  if (item1.status === 'incomplete' && item2.status === 'missing') {
    return -1;
  }

  return 1;
};
