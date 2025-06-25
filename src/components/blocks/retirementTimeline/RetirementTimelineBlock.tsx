import Timeline from '@mui/lab/Timeline';
import { Box } from '@mui/material';
import isBefore from 'date-fns/isBefore';
import { ListLoader } from '../../';
import { formatDate } from '../../../business/dates';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi } from '../../../core/hooks/useApi';
import { TimelineItem } from '../../timeline/TimelineItem';
interface Props {
  id?: string;
}

export const RetirementTimelineBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey } = useGlobalsContext();
  const timeline = useApi(api => api.mdp.retirementTimeline());

  if (timeline.loading) {
    return <ListLoader id={id} loadersCount={5} />;
  }

  const timelineData = timeline?.result?.data ?? null;
  const earliestDate = timelineData?.earliestStartRaDateForSelectedDate
    ? formatDate(timelineData.earliestStartRaDateForSelectedDate)
    : '';
  const latestDate = timelineData?.latestStartRaDateForSelectedDate
    ? formatDate(timelineData.latestStartRaDateForSelectedDate)
    : '';
  const firstItem = {
    title: labelByKey('ret_timeline_decide_how_to_take'),
    html: earliestDate
      ? labelByKey('ret_timeline_apply_date_range')
          ?.replace('[[early]]', earliestDate)
          ?.replace('[[latest]]', latestDate)
      : labelByKey('ret_timeline_apply_date_latest')?.replace('[[latest]]', latestDate),
  };
  const items = [
    {
      title: labelByKey('ret_timeline_get_confirmation'),
      html: `${
        timelineData?.retirementConfirmationDate ? formatDate(timelineData.retirementConfirmationDate) : ''
      } ${labelByKey('ret_timeline_estimated')}`,
      date: timelineData?.retirementConfirmationDate,
    },
    {
      title: labelByKey('ret_timeline_you_retire'),
      html: timelineData?.retirementDate ? formatDate(timelineData.retirementDate) : '',
      date: timelineData?.retirementDate,
    },
    {
      title: labelByKey('ret_timeline_first_monthly_pension'),
      html: `${
        timelineData?.firstMonthlyPensionPayDate ? formatDate(timelineData.firstMonthlyPensionPayDate) : ''
      } ${labelByKey('ret_timeline_estimated')}`,
      date: timelineData?.firstMonthlyPensionPayDate,
    },
    {
      title: labelByKey('ret_timeline_decide_lumpsum_pay_date'),
      html: `${timelineData?.lumpSumPayDate ? formatDate(timelineData.lumpSumPayDate) : ''} ${labelByKey(
        'ret_timeline_estimated',
      )}`,
      date: timelineData?.lumpSumPayDate,
    },
  ]
    .filter(a => a.date)
    .sort((a, b) => {
      if (a?.date && b?.date) {
        return isBefore(new Date(b.date), new Date(a.date)) ? 1 : -1;
      }

      return -1;
    });

  return (
    <Box id={id} mb={8}>
      <Timeline position="right" aria-label={labelByKey('aria-retirement-journey-timeline')}>
        <TimelineItem first title={firstItem?.title} html={firstItem?.html} />
        {items?.map((item, idx) => (
          <TimelineItem key={idx} last={items.length === idx + 1} title={item?.title} html={item?.html} />
        ))}
      </Timeline>
    </Box>
  );
};
