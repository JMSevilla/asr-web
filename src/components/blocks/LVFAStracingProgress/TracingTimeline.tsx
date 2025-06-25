import Timeline from '@mui/lab/Timeline';
import { ReferralHistory } from '../../../api/mdp/types';
import { formatDate } from '../../../business/dates';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { TimelineItem } from '../../timeline/TimelineItem';
import { HistoryKeys } from './constants';

interface Props {
  data: HistoryKeys[];
  historyItems?: ReferralHistory[];
}

export const TracingTimeline: React.FC<Props> = ({ data, historyItems }) => {
  const { labelByKey } = useGlobalsContext();

  return (
    <Timeline
      position="right"
      data-testid="tracking-timeline"
      aria-label={labelByKey('aria-retirement-journey-timeline')}
    >
      {data?.map((item, index) => (
        <TimelineItem
          key={index}
          dataTestid={item._id}
          first={index === 0}
          last={data.length === index + 1}
          title={labelByKey(item.titleKey)}
          status={findHistoryItem(item._id)?.referralBadgeStatus}
          html={getHtml(item)}
        />
      ))}
    </Timeline>
  );

  function findHistoryItem(id?: string) {
    return historyItems?.find(item => item.referralStatus === id);
  }

  function getHtml(key: HistoryKeys) {
    const item = findHistoryItem(key._id);
    if (item?.referralBadgeStatus == 'Cancelled') {
      return labelByKey('Track_LVFAS_stopped_referral');
    }
    return formatDate(item?.referralDate ?? '');
  }
};
