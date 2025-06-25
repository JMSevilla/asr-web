import { Grid, GridProps } from '@mui/material';
import React from 'react';
import { AnimatedBoxSkeleton } from './AnimatedBoxSkeleton';

type Props = Pick<GridProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'sx'>;

export const AnimatedParagraphSkeleton: React.FC<Props> = props => (
  <Grid container item {...props}>
    <Grid container item xs={10} spacing={4}>
      <Grid item xs={12}>
        <AnimatedBoxSkeleton height={24} />
      </Grid>
      <Grid item xs={6}>
        <AnimatedBoxSkeleton height={24} />
      </Grid>
      <Grid item xs={10} mt={4}>
        <AnimatedBoxSkeleton height={24} sx={{ backgroundColor: 'appColors.tertiary.light' }} />
      </Grid>
    </Grid>
  </Grid>
);
