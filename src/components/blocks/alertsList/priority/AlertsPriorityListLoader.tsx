import { Stack } from '@mui/material';
import { AnimatedBoxSkeleton } from '../../../animations';

interface Props {
  id: string;
}

export const AlertsPriorityListLoader: React.FC<Props> = ({ id }) => {
  return (
    <Stack id={id} data-testid="alerts-priority-list-loader" component="ul" gap={6} m={0} p={0}>
      {Array.from({ length: 2 }).map((_, index) => (
        <Stack
          key={index}
          component="li"
          direction="row"
          alignItems="center"
          p={6}
          gap={6}
          border="1px solid"
          borderLeft="4px solid"
          borderColor="appColors.support80.light"
          sx={{ cursor: 'progress' }}
        >
          <AnimatedBoxSkeleton height={20} width={20} maxWidth={20} sx={{ borderRadius: '50%' }} />
          <AnimatedBoxSkeleton height={26} width="100%" sx={{ borderRadius: '2px' }} />
        </Stack>
      ))}
    </Stack>
  );
};
