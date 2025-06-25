import { Grid, SxProps, Typography } from '@mui/material';
import { ReferralHistoryStatus } from '../../api/mdp/types';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { ParsedHtml } from '../ParsedHtml';

interface Props {
  title?: string;
  html?: string;
  status?: ReferralHistoryStatus;
  sx?: SxProps;
  spacing?: number;
}

export const TimelineItemContent: React.FC<Props> = ({ title, html, status, sx, spacing }) => {
  const { labelByKey } = useGlobalsContext();
  return (
    <Grid
      data-testid="timeline-content"
      container
      spacing={spacing}
      sx={{
        p: 8,
        borderRadius: '4px',
        border: `2px solid`,
        borderColor: theme => (status ? borderColor(status) : theme.palette.appColors.support60.light),
        backgroundColor: status ? backgroundColor(status) : 'common.white',
        ...sx,
      }}
    >
      {status && (
        <Grid item xs={12} mb={4} data-testid={`status-badge-${status}`}>
          <Typography
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            sx={{
              backgroundColor: markBackgroundColor(status),
              py: 1,
              px: 2,
              borderRadius: '2px',
              color: 'common.white',
            }}
          >
            {labelByKey(statusTitle(status))}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} mb={4}>
        <Typography variant="secondLevelValue" component="span">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {html && <ParsedHtml html={html} />}
      </Grid>
    </Grid>
  );
};

function statusTitle(status?: ReferralHistoryStatus) {
  switch (status) {
    case 'Completed':
      return 'Track_LVFAS_completed_badge';
    case 'Pending':
      return 'Track_LVFAS_pending_badge';
    case 'Cancelled':
      return 'Track_LVFAS_cancelled_badge';
    default:
      return '';
  }
}

function borderColor(status?: ReferralHistoryStatus) {
  switch (status) {
    case 'Completed':
      return 'success.main';
    case 'Pending':
      return 'primary.main';
    case 'Cancelled':
      return 'error.main';
    default:
      return 'primary.main';
  }
}

function backgroundColor(status?: ReferralHistoryStatus) {
  switch (status) {
    case 'Completed':
      return 'success.light';
    case 'Pending':
      return 'primary.light';
    case 'Cancelled':
      return 'error.light';
    default:
      return 'common.white';
  }
}

function markBackgroundColor(status?: ReferralHistoryStatus) {
  switch (status) {
    case 'Completed':
      return 'success.main';
    case 'Pending':
      return 'primary.main';
    case 'Cancelled':
      return 'error.main';
    default:
      return 'common.white';
  }
}
