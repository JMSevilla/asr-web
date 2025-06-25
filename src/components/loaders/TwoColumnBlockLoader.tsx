import { Box, Grid } from '@mui/material';
import { AnimatedBoxSkeleton } from '../animations';

export const TwoColumnBlockLoader: React.FC = () => {
  return (
    <Box position="relative" data-testid="two-column-loader">
      <AnimatedBoxSkeleton pt={16} pb={10} pl={25} pr={8} light>
        <Grid container spacing={40} pr={40} pb={10}>
          <Grid item xs={12} md={6} container spacing={6}>
            <Grid item xs={12}>
              <Box height={24} bgcolor="appColors.support80.light" />
            </Grid>
            <Grid item xs={6}>
              <Box height={24} bgcolor="appColors.support80.light" />
            </Grid>
            <Grid item xs={10} mt={4}>
              <Box height={24} bgcolor="appColors.tertiary.light" />
            </Grid>
          </Grid>
          <Grid item xs={6} display={{ xs: 'none', md: 'flex' }} container spacing={6}>
            <Grid item xs={12}>
              <Box height={24} bgcolor="appColors.support80.light" />
            </Grid>
            <Grid item xs={6}>
              <Box height={24} bgcolor="appColors.support80.light" />
            </Grid>
            <Grid item xs={10} mt={4}>
              <Box height={24} bgcolor="appColors.tertiary.light" />
            </Grid>
          </Grid>
        </Grid>
      </AnimatedBoxSkeleton>
    </Box>
  );
};
