import { Box, Stack } from '@mui/material';
import { AnimatedBoxSkeleton } from '../../../animations';

interface Props {
  id: string;
}

export const AlertsNonPriorityListLoader: React.FC<Props> = ({ id }) => {
  return (
    <Stack
      id={id}
      data-testid="alerts-non-priority-list-loader"
      component="ul"
      gap={{ xs: 2, md: 4 }}
      px={{ xs: 5, md: 12 }}
      py={{ xs: 6, md: 12 }}
      mx={{ xs: -5, md: 0 }}
      bgcolor="appColors.support60.transparentLight"
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <Box
          key={index}
          p={{ xs: 4, md: 8 }}
          borderRadius="8px"
          bgcolor="background.paper"
          component="section"
          sx={{ cursor: 'progress' }}
        >
          <Stack direction="row" position="relative" justifyContent="space-between" mb={2}>
            <AnimatedBoxSkeleton height={{ xs: 23, md: 32 }} maxWidth="60%" sx={{ borderRadius: '2px' }} />
          </Stack>
          <Stack mb={{ xs: 0, md: 4 }} maxWidth="80%">
            <AnimatedBoxSkeleton height={{ xs: 18, md: 20 }} maxWidth="120px" sx={{ borderRadius: '2px' }} />
          </Stack>
          <Stack display={{ xs: 'none', md: 'flex' }} gap={1}>
            <AnimatedBoxSkeleton height={{ xs: 16, md: 24 }} maxWidth="80%" sx={{ borderRadius: '2px' }} />
            <AnimatedBoxSkeleton height={{ xs: 16, md: 24 }} maxWidth="40%" sx={{ borderRadius: '2px' }} />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};
