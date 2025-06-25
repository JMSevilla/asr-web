import { Grid, Typography } from '@mui/material';
import { currencyValue } from '../../../business/currency';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { DetailsContainer } from '../../DetailsContainer';
import { Tooltip } from '../../Tooltip';

interface Props {
  id?: string;
}

export const PartialTransferLimitsBenefitsBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const { transferOptions, transferOptionsLoading } = useRetirementContext();
  const { membership } = useContentDataContext();
  const partialTransferMinTooltip = tooltipByKey('partial_transfer_min_val_tooltip');

  return (
    <Grid id={id} container>
      <Typography variant="body1" fontWeight="bold" mb={2}>
        {labelByKey('partial_transfer_limits_header')}
      </Typography>
      <Grid item xs={12}>
        <DetailsContainer isLoading={transferOptionsLoading} bgcolor="appColors.support80.transparentLight">
          <Grid item xs={12} md={6}>
            <Typography variant="body1" fontWeight="bold" data-testid="partial-transfer-max-value-label">
              {labelByKey('partial_transfer_max_value')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              color="primary"
              variant="secondLevelValue"
              component="span"
              data-testid="partial-transfer-max-value"
              sx={{ textAlign: { md: 'end' } }}
            >
              {`${labelByKey('currency:GBP')}${currencyValue(transferOptions?.maximumPartialTransferValue)}`}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" fontWeight="bold" display="flex" data-testid="partial-transfer-min-value-label">
              {labelByKey('partial_transfer_min_value')}
              {partialTransferMinTooltip && (
                <Tooltip header={partialTransferMinTooltip.header} html={partialTransferMinTooltip.html} />
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              color="primary"
              variant="secondLevelValue"
              component="span"
              data-testid="partial-transfer-min-value"
              sx={{ textAlign: { md: 'end' } }}
            >
              {`${labelByKey('currency:GBP')}${currencyValue(transferOptions?.minimumPartialTransferValue)}`}
            </Typography>
          </Grid>
          {membership?.hasAdditionalContributions && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" fontWeight="bold" data-testid="partial-transfer-avcs-label">
                  {labelByKey('partial_transfer_avcs')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  color="primary"
                  variant="secondLevelValue"
                  component="span"
                  data-testid="partial-transfer-avcs-value"
                  sx={{ textAlign: { md: 'end' } }}
                >
                  {`${labelByKey('currency:GBP')}${currencyValue(transferOptions?.totalNonGuaranteedTransferValue)}`}
                </Typography>
              </Grid>
            </>
          )}
        </DetailsContainer>
      </Grid>
    </Grid>
  );
};
