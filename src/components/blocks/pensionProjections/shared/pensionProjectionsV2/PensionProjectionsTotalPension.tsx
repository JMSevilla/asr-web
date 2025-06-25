import { Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { currencyValue } from '../../../../../business/currency';
import { useGlobalsContext } from '../../../../../core/contexts/GlobalsContext';
import { useTenantContext } from '../../../../../core/contexts/TenantContext';
import { trackButtonClick } from '../../../../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../../../../core/mixpanel-tracker';
import { PensionsProjectionsModal } from '../PensionsProjectionsModal';

interface Props {
  ageLines: number[];
  totalPension?: number;
  normalRetirementAge?: number | null;
  hideExploreOptions: boolean;
}

export const PensionProjectionsTotalPension: React.FC<Props> = ({
  totalPension,
  ageLines,
  normalRetirementAge,
  hideExploreOptions,
}) => {
  const { tenant } = useTenantContext();
  const { labelByKey } = useGlobalsContext();
  const [open, setOpen] = useState(false);
  const increasedAccessibility = tenant?.increasedAccessibility?.value;

  return (
    <Grid container spacing={6} data-testid="total-pension-data-block">
      <Grid item xs={12}>
        <Typography variant="h3" flexWrap={'wrap'} data-mdp-key="proj_value" sx={{ wordBreak: 'break-word', pr: 25 }}>
          {labelByKey('proj_value')}
        </Typography>
      </Grid>
      {(!!totalPension || totalPension === 0) && (
        <Grid item xs={12} data-testid="total-pension-block">
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
      {!hideExploreOptions && (
        <Grid item style={{ cursor: 'pointer' }}>
          <Button variant="text" onClick={handleExpandClick} data-testid="pension-modal-button">
            <Typography
              variant="body1"
              sx={{
                textDecoration: 'underline',
                textUnderlineOffset: 6,
                fontSize: increasedAccessibility ? 'accessibleText.fontSize' : 'body1',
                fontWeight: increasedAccessibility ? 'accessibleText.fontWeight' : 'unset',
              }}
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
      )}
    </Grid>
  );

  function handleExpandClick() {
    setOpen(true);
    mixpanelTrackButtonClick({
      Category: 'explore other scenarios',
    });
    trackButtonClick('explore other scenarios');
  }
};
