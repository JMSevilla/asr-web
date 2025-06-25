import { Box, Stack, SxProps, Theme, Typography } from '@mui/material';
import { memo } from 'react';
import { TimelineItemStatus } from '../../../api/content/types/page';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { EvaIcon } from '../../EvaIcon';
import { ParsedHtml } from '../../ParsedHtml';
import { Badge } from '../badge/Badge';
import { TimelineItem } from './types';

interface Props {
  prefix: string;
  index: number;
  item: TimelineItem;
  simplified?: boolean;
  onTextDataReplace: (data?: string) => string | undefined;
  dataReplaceProps: (key?: string, path?: string) => { 'aria-tag'?: undefined } | { 'aria-tag': string | undefined };
}

export const TimelineBlockItem: React.FC<Props> = memo(
  ({ prefix, index, item, simplified, onTextDataReplace, dataReplaceProps }) => {
    const { labelByKey } = useGlobalsContext();

    return (
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={4}
        px={simplified ? 4 : 6}
        py={simplified ? 3 : 6}
        bgcolor={containerBg(item.status)}
        border={simplified ? '1px solid' : '2px solid'}
        borderRadius={simplified ? '10px' : '4px'}
        borderColor={simplified ? theme => theme.palette.grey[200] : statusBg(item.status)}
        data-testid={`item-${index}`}
        position="relative"
      >
        <Box sx={iconWrapperStyles(item.status, simplified)}>
          <EvaIcon name={iconName(item.status)} width={simplified ? 29 : 50} height={simplified ? 29 : 50} />
        </Box>
        <Stack
          gap={simplified ? 4 : 2}
          direction={simplified ? 'row' : 'column'}
          justifyContent={simplified ? 'space-between' : undefined}
          alignItems={simplified ? 'center' : undefined}
          flex={1}
        >
          {item.status !== 'Future' && (
            <Badge
              id={`panel-status-${index + 1}`}
              data-testid={`panel-status-${index}`}
              accessibilityText={labelByKey(`${prefix}_status_text`)}
              text={labelByKey(`timeline_item_status_${item.status}`)}
              backgroundColor={statusBg(item.status)}
              color={item.status === 'Current' ? 'primary.contrastText' : 'text.primary'}
            />
          )}
          <Typography
            id={`panel-heading-${index + 1}`}
            aria-describedby={`panel-status-${index + 1}`}
            variant={simplified ? 'body2' : 'h2'}
            fontWeight={simplified ? 'normal' : 'bold'}
            flex={simplified ? 1 : undefined}
            {...dataReplaceProps(prefix, item.header)}
          >
            <ParsedHtml html={onTextDataReplace(item.header)!} fontSize="inherit" />
          </Typography>
          <Typography
            variant={simplified ? 'body2' : 'body1'}
            noWrap={simplified}
            {...dataReplaceProps(prefix, item.description)}
          >
            <Box component="span" className="visually-hidden" aria-describedby={`panel-heading-${index + 1}`}>
              {labelByKey(`${prefix}_status_update_on_text`)}
            </Box>
            <ParsedHtml html={onTextDataReplace(item.description)!} fontSize="inherit" />
          </Typography>
        </Stack>
      </Stack>
    );
  },
);

function iconName(status: TimelineItemStatus) {
  switch (status) {
    case 'Completed':
      return 'checkmark-circle-2-outline';
    case 'Current':
      return 'question-mark-circle-outline';
    case 'Future':
      return 'clock-outline';
  }
}

function containerBg(status: TimelineItemStatus) {
  switch (status) {
    case 'Completed':
      return 'success.light';
    case 'Current':
      return 'primary.light';
    case 'Future':
      return 'transparent';
  }
}

function statusBg(status: TimelineItemStatus) {
  switch (status) {
    case 'Completed':
      return 'success.main';
    case 'Current':
      return 'primary.main';
    case 'Future':
      return 'primary.main';
  }
}

function iconColor(status: TimelineItemStatus, simplified?: boolean) {
  return (theme: Theme) => {
    switch (status) {
      case 'Completed':
        return theme.palette.success.main;
      case 'Current':
        return theme.palette.primary.main;
      case 'Future':
        return simplified ? theme.palette.primary.main : theme.palette.appColors.support60.light;
    }
  };
}

function iconWrapperStyles(status: TimelineItemStatus, simplified?: boolean): SxProps<Theme> {
  return {
    position: 'absolute',
    top: '50%',
    left: simplified ? -33 : -76,
    transform: 'translateY(-50%)',
    bgcolor: 'background.paper',
    borderRadius: '50%',
    height: simplified ? 22 : 42,
    width: simplified ? 22 : 42,
    svg: { mt: '-4px', ml: '-4px', fill: iconColor(status, simplified) },
  };
}
