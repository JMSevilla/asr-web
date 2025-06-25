import { Grid, useTheme } from '@mui/material';
import React from 'react';
import { RetirementTime, TimeToRetirement } from '../../../../../api/mdp/types';
import { NA_SYMBOL } from '../../../../../business/constants';
import { formatDate } from '../../../../../business/dates';
import { mapTimeValues, trimLabelKey } from '../../../../../business/retirement-dates';
import { useGlobalsContext } from '../../../../../core/contexts/GlobalsContext';
import { PensionProjectionsAVC } from './PensionProjectionsAVC';
import { PensionProjectionsRetirementToday } from './PensionProjectionsRetirementToday';
import { PensionProjectionsTotalPension } from './PensionProjectionsTotalPension';

interface Props {
  ageLines: number[];
  totalPension?: number;
  totalAVCFund: number | null;
  timeToRetirement: TimeToRetirement;
  normalRetirementAge?: number | null;
  hideExploreOptions: boolean;
  showAtDate: boolean;
  retirementDate: string;
}

export const PensionProjectionsV2: React.FC<Props> = ({
  totalPension,
  totalAVCFund,
  timeToRetirement: { currentAge, timeToNormalRetirement, ageAtNormalRetirement },
  ageLines,
  normalRetirementAge,
  hideExploreOptions,
  showAtDate,
  retirementDate,
}) => {
  const theme = useTheme();
  const { labelByKey } = useGlobalsContext();
  const isRetirementTodayAvailable =
    timeToNormalRetirement?.years === 0 &&
    timeToNormalRetirement?.months === 0 &&
    timeToNormalRetirement?.days === 0 &&
    timeToNormalRetirement?.weeks === 0;

  return (
    <Grid container spacing={6} flexWrap={{ md: 'nowrap', xs: 'wrap' }}>
      <Grid item>
        <PensionProjectionsRetirementToday
          firstAgeInfo={calculatedYearsInfo()}
          secondAgeInfo={calculatedAgeInfo()}
          isRetirementTodayAvailable={isRetirementTodayAvailable}
        />
      </Grid>
      <Grid item>
        <PensionProjectionsTotalPension
          totalPension={totalPension}
          ageLines={ageLines}
          normalRetirementAge={normalRetirementAge}
          hideExploreOptions={hideExploreOptions}
        />
      </Grid>
      {(!!totalAVCFund || totalAVCFund === 0) && (
        <Grid item pb={6} borderLeft={{ md: `1px solid ${theme.palette.primary.main}` }}>
          <PensionProjectionsAVC totalAVCFund={totalAVCFund} />
        </Grid>
      )}
    </Grid>
  );

  function calculatedYearsInfo() {
    if (showAtDate) {
      return `${retirementDate ? formatDate(retirementDate) : NA_SYMBOL}`;
    }

    if (isRetirementTodayAvailable) {
      return `${labelByKey('pension_proj_late_retire_age')}`;
    }

    const ages = timeToNormalRetirement ? mapTimeValues(timeToNormalRetirement) : null;

    if (!ages) return '';

    const firstPart = ages?.[0]?.value
      ? `${ages[0].value} ${labelByKey(trimLabelKey(ages[0].value, ages[0].key))}`
      : '';
    const secondPart = ages?.[1]?.value
      ? `${ages[1].value} ${labelByKey(trimLabelKey(ages[1].value, ages[1].key))}`
      : '';
    return [firstPart, secondPart].filter(Boolean).join(', ');
  }

  function calculatedAgeInfo() {
    if (isRetirementTodayAvailable) {
      const currentAges = currentAge ? mapTimeValues(currentAge!) : null;
      return currentAges ? formatLabel(currentAges) : '';
    }

    const ages = ageAtNormalRetirement ? mapTimeValues(ageAtNormalRetirement!) : null;

    return ages ? formatLabel(ages) : '';
  }

  function formatLabel(ages: { key: keyof RetirementTime; value: number }[]) {
    if (!ages) return '';

    const firstPart = ages?.[0]?.value
      ? `${labelByKey('hub_ret_age')} ${ages[0].value} ${labelByKey(trimLabelKey(ages[0].value, ages[0].key))}`
      : '';
    const secondPart = ages?.[1]?.value
      ? `${ages[1].value} ${labelByKey(trimLabelKey(ages[1].value, ages[1].key))}`
      : '';
    return `(${[firstPart, secondPart].filter(Boolean).join(', ')})`;
  }
};
