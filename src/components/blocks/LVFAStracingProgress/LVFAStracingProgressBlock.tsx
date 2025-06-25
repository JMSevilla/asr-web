import { Box } from '@mui/material';
import { ListLoader } from '../../';
import { useApi } from '../../../core/hooks/useApi';
import { HISTORY_KEYS } from './constants';
import { TracingTimeline } from './TracingTimeline';

interface Props {
  id?: string;
}

export const LVFAStracingProgressBlock: React.FC<Props> = ({ id }) => {
  const history = useApi(api => api.mdp.referralHistories());

  if (history.loading) {
    return <ListLoader id={id} loadersCount={5} />;
  }

  const historyItems = history?.result?.data?.referralHistories;

  return (
    <Box id={id} mb={8} data-testid="lvfas-tracking-progress">
      <TracingTimeline data={HISTORY_KEYS} historyItems={historyItems} />
    </Box>
  );
};
