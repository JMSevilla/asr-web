import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import React, { useState } from 'react';
import { InfoIcon, Tooltip } from '../../..';
import { TimeToRetirement } from '../../../../api/mdp/types';
import { NA_SYMBOL } from '../../../../business/constants';
import { currencyValue } from '../../../../business/currency';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { trackButtonClick } from '../../../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../../../core/mixpanel-tracker';
import { PensionsProjectionsModal } from './PensionsProjectionsModal';

interface Props {
  ageLines: number[];
  totalPension?: number;
  totalAVCFund: number | null;
  currentMemberAge?: number | null;
  timeToRetirement: TimeToRetirement;
  normalRetirementAge?: number | null;
}

export const PensionProjections: React.FC<Props> = ({
  currentMemberAge,
  totalPension,
  totalAVCFund,
  timeToRetirement: { years, months },
  ageLines,
  normalRetirementAge,
}) => {
  const theme = useTheme();
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const [open, setOpen] = useState(false);
  const avcsHelpTooltip = tooltipByKey('proj_avcs_help');
  const isRetirementTodayAvailable = years === 0 && months === 0;

  return (
    <>
      <Grid item lg={12}>
        <Grid container direction="column" height="100%" wrap="nowrap">
          <Grid item container mb={6} wrap="nowrap" height="100%" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
            <Grid item container lg={7} sx={innerBoxStyle} data-testid="retirement-data-block">
              <Grid item mb={6}>
                <Typography variant="h3" data-mdp-key="proj_retirement|proj_value">
                  {labelByKey(isRetirementTodayAvailable ? 'proj_retirement_today' : 'proj_retirement')}
                </Typography>
              </Grid>
              <Grid mb={6}>
                <Typography
                  color="primary"
                  variant="firstLevelValue"
                  component="span"
                  data-mdp-key="years|year|months|month|hub_ret_age"
                >
                  {calculatedAgeInfo()}
                </Typography>
              </Grid>
              <Grid>
                <Tooltip
                  header={tooltipByKey('proj_retirement_date_help')?.header}
                  html={tooltipByKey('proj_retirement_date_help')?.html}
                  underlinedText
                >
                  {tooltipByKey('proj_retirement_date_help')?.text}
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item container lg={5} sx={{ ...innerBoxStyle }} pl={{ md: 0 }} data-testid="total-pension-data-block">
              <Grid item mb={6}>
                <Typography variant="h3" data-mdp-key="proj_value">
                  {labelByKey('proj_value')}
                </Typography>
              </Grid>
              {(!!totalPension || totalPension === 0) && (
                <Grid item mb={6} data-testid="total-pension-block">
                  <Typography
                    color="primary"
                    variant="firstLevelValue"
                    component="span"
                    data-mdp-key="currency:GBP|hub_ret_per_year"
                  >
                    {`${labelByKey('currency:GBP')}${currencyValue(totalPension)}${labelByKey('hub_ret_per_year')}`}
                  </Typography>
                </Grid>
              )}
              <Grid item container>
                <Grid item style={{ cursor: 'pointer' }} xs={12}>
                  <Button variant="text" onClick={handleExpandClick} data-testid="pension-modal-button">
                    <Typography
                      variant="body1"
                      sx={{ textDecoration: 'underline', textUnderlineOffset: 6 }}
                      color="primary"
                      data-mdp-key="proj_expand"
                      noWrap
                    >
                      {labelByKey('proj_expand')}
                    </Typography>
                  </Button>
                  <PensionsProjectionsModal
                    open={open}
                    onClose={() => setOpen(false)}
                    ages={ageLines}
                    normalRetirementAge={normalRetirementAge}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {(!!totalAVCFund || totalAVCFund === 0) && (
        <Grid item data-testid="additional-contributions-block" p={0}>
          <Grid
            container
            height="100%"
            mb={6}
            pt={{ md: 6, xs: 0 }}
            px={10}
            pb={{ md: 22.5, xs: 8 }}
            display="flex"
            flexDirection="column"
            borderLeft={{ md: `1px solid ${theme.palette.primary.main}` }}
          >
            <Grid item mb={{ xs: 6 }}>
              <Typography variant="h3" data-mdp-key="proj_avcs">
                {labelByKey('proj_avcs')}
              </Typography>
            </Grid>
            <Grid item container alignItems="center">
              <Box mr={2}>
                <Typography
                  color="primary"
                  variant="firstLevelValue"
                  component="span"
                  data-mdp-key="currency:GBP"
                >{`${labelByKey('currency:GBP')}${currencyValue(totalAVCFund)}`}</Typography>
              </Box>
              <Tooltip
                header={avcsHelpTooltip?.header ?? ''}
                html={avcsHelpTooltip?.html ?? ''}
                data-testid="pension-tooltip"
              >
                <Box display="flex" alignItems="center">
                  <InfoIcon customColor={theme.palette.primary.main} />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );

  function handleExpandClick() {
    setOpen(true);
    mixpanelTrackButtonClick({
      Category: 'explore other scenarios',
    });
    trackButtonClick('explore other scenarios');
  }

  function calculatedAgeInfo() {
    const age =
      normalRetirementAge && currentMemberAge
        ? currentMemberAge > normalRetirementAge
          ? currentMemberAge
          : normalRetirementAge
        : null;

    if (isRetirementTodayAvailable) {
      return `${labelByKey('pension_proj_late_retire_age')} (${labelByKey('pension_proj_age')} ${age ?? NA_SYMBOL})`;
    }

    return `${years ? `${years} ${years > 1 ? labelByKey('years') : labelByKey('year')}` : ''} ${
      months ? `${months} ${months > 1 ? labelByKey('months') : labelByKey('month')}` : ''
    } ${age ? `(${labelByKey('hub_ret_age')} ${age})` : ''}`;
  }
};

const innerBoxStyle: SxProps<Theme> = {
  height: '100%',
  flexDirection: 'column',
  padding: theme => ({ md: theme.spacing(6, 10, 0), xs: 8 }),
};
