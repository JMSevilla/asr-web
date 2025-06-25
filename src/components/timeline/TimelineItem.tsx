import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Item from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { ReferralHistoryStatus } from '../../api/mdp/types';
import { TimelineItemContent } from './TimelineItemContent';

interface Props {
  first?: boolean;
  last?: boolean;
  title: string;
  status?: ReferralHistoryStatus;
  html?: string;
  dataTestid?: string;
}

export const TimelineItem: React.FC<Props> = ({ title, first, last, html, status, dataTestid }) => {
  return (
    <Item data-testid={dataTestid}>
      <TimelineOppositeContent sx={{ flex: 0, padding: 0 }} />
      <TimelineSeparator>
        <TimelineConnector sx={{ opacity: first ? 0 : 1, color: theme => theme.palette.appColors.incidental['075'] }} />
        <TimelineDot variant="outlined" sx={{ border: 'none', boxShadow: 'none', my: 1 }}>
          {status === 'Completed' ? (
            <CheckCircleOutlineIcon data-testid="completed-icon" fontSize="large" sx={{ color: 'success.main' }} />
          ) : (
            <AccessTimeOutlinedIcon fontSize="large" sx={{ color: theme => theme.palette.appColors.support60.light }} />
          )}
        </TimelineDot>
        <TimelineConnector
          sx={{
            opacity: last ? 0 : 1,
            color: theme => theme.palette.appColors.incidental['075'],
          }}
        />
      </TimelineSeparator>
      <TimelineContent ml={4}>
        <TimelineItemContent title={title} html={html} status={status} />
      </TimelineContent>
    </Item>
  );
};
