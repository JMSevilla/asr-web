import { Box, BoxProps, Grid } from '@mui/material';
import { AnimatedBoxSkeleton } from '../animations';

export const OneColumnBlockLoader: React.FC<BoxProps> = props => {
  return (
    <Box position="relative" {...props}>
      <AnimatedBoxSkeleton pt={16} pb={10} pl={25} pr={8} light>
        <Grid container spacing={2} pr={40} pb={10}>
          <Grid item xs={12} container spacing={4}>
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
