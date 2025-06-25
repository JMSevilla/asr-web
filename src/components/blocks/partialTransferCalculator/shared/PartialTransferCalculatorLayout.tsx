import { Box, Grid, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';

interface Props {
  id?: string;
  leftPaneLabel: string;
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  rightPaneLabel: string;
}

export const PartialTransferCalculatorLayout: React.FC<Props> = ({
  id,
  leftPaneLabel,
  leftPane,
  rightPane,
  rightPaneLabel,
}) => {
  return (
    <Grid id={id} container spacing={{ md: 8, xs: 0 }} pb={8}>
      <Grid item lg={8} xs={12}>
        <Box sx={boxStyles} pb={{ md: 8, xs: 4 }}>
          <Grid container spacing={{ md: 8, xs: 6 }}>
            <Grid item xs={12}>
              <Typography color="primary" variant="h4" fontWeight="bold">
                {leftPaneLabel}
              </Typography>
            </Grid>
            {leftPane}
          </Grid>
        </Box>
      </Grid>
      <Grid item lg={4} xs={12}>
        <Box sx={boxStyles} pt={{ md: 8, xs: 4 }}>
          <Grid container spacing={{ md: 8, xs: 6 }}>
            <Grid item>
              <Typography color="primary" variant="h4" fontWeight="bold">
                {rightPaneLabel}
              </Typography>
            </Grid>
            {rightPane}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

const boxStyles: SxProps<Theme> = {
  height: '100%',
  p: { md: 8, xs: 6 },
  backgroundColor: 'appColors.support80.transparentLight',
};
