import { Box, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { InfoIcon, Tooltip } from '../../../..';
import { currencyValue } from '../../../../../business/currency';
import { useGlobalsContext } from '../../../../../core/contexts/GlobalsContext';

interface Props {
  totalAVCFund: number | null;
}
export const PensionProjectionsAVC: React.FC<Props> = ({ totalAVCFund }) => {
  const theme = useTheme();
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const avcsHelpTooltip = tooltipByKey('proj_avcs_help');

  return (
    <Grid data-testid="additional-contributions-block" container spacing={6} display="flex">
      <Grid item xs={12}>
        <Typography variant="h3" data-mdp-key="proj_avcs">
          {labelByKey('proj_avcs')}
        </Typography>
      </Grid>
      <Grid item xs={12} container alignItems="center">
        <Typography
          color="primary"
          variant="firstLevelValue"
          component="span"
          data-mdp-key="currency:GBP"
        >{`${labelByKey('currency:GBP')}${currencyValue(totalAVCFund)}`}</Typography>

        <Tooltip
          header={avcsHelpTooltip?.header ?? ''}
          html={avcsHelpTooltip?.html ?? ''}
          data-testid="pension-tooltip"
          hideIcon={true}
        >
          <Box display="flex" ml={2}>
            <InfoIcon customColor={theme.palette.primary.main} />
          </Box>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
