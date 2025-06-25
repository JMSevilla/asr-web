import { Grid, Typography } from '@mui/material';
import React from 'react';
import { Tooltip } from '../../../..';
import { useGlobalsContext } from '../../../../../core/contexts/GlobalsContext';

interface Props {
  firstAgeInfo: string;
  secondAgeInfo: string;
  isRetirementTodayAvailable: boolean;
}
export const PensionProjectionsRetirementToday: React.FC<Props> = ({
  firstAgeInfo,
  secondAgeInfo,
  isRetirementTodayAvailable,
}) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();

  return (
    <Grid container spacing={6} data-testid="retirement-data-block">
      <Grid item xs={12}>
        <Typography variant="h3" data-mdp-key="proj_retirement|proj_value" sx={{ wordBreak: 'break-word', pr: 25 }}>
          {labelByKey(isRetirementTodayAvailable ? 'proj_retirement_today' : 'proj_retirement')}
        </Typography>
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={12}>
          <Typography
            color="primary"
            variant="firstLevelValue"
            component="span"
            data-mdp-key="years|year|months|month|hub_ret_age"
          >
            {firstAgeInfo}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            fontWeight="normal"
            data-mdp-key="years|year|months|month|hub_ret_age"
          >
            {secondAgeInfo}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Tooltip
          header={tooltipByKey('proj_retirement_date_help')?.header}
          html={tooltipByKey('proj_retirement_date_help')?.html}
          underlinedText
        >
          {tooltipByKey('proj_retirement_date_help')?.text}
        </Tooltip>
      </Grid>
    </Grid>
  );
};
