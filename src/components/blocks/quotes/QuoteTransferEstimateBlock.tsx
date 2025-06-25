import { Grid, Typography } from '@mui/material';
import { currencyValue } from '../../../business/currency';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { DetailsContainer } from '../../DetailsContainer';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
}

export const QuoteTransferEstimateBlock: React.FC<Props> = ({ id, parameters }) => {
  const { labelByKey } = useGlobalsContext();
  const hideTitle = findValueByKey('hide_title', parameters) === 'true';
  const { retirementCalculation, retirementCalculationLoading, transferOptions, transferOptionsLoading } =
    useRetirementContext();

  if (!retirementCalculation?.totalAVCFund) {
    return (
      <DetailsContainer
        id={id}
        isLoading={transferOptionsLoading || retirementCalculationLoading}
        bgcolor="appColors.support80.transparentLight"
        title={hideTitle ? '' : labelByKey('transfer_option_header')}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold">
            {labelByKey('transfer_option_DB_value_non_AVCs')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="total-value"
            fontWeight="bold"
          >
            {labelByKey('currency:GBP')}
            {currencyValue(transferOptions?.totalTransferValue)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">{labelByKey('transfer_option_DB_value')}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="total-value"
            fontWeight="bold"
          >
            {labelByKey('currency:GBP')}
            {currencyValue(transferOptions?.totalGuaranteedTransferValue)}
          </Typography>
        </Grid>
      </DetailsContainer>
    );
  }

  return (
    <DetailsContainer
      id={id}
      isLoading={transferOptionsLoading || retirementCalculationLoading}
      bgcolor="appColors.support80.transparentLight"
      title={hideTitle ? '' : labelByKey('transfer_option_header')}
    >
      <Grid item xs={12} container spacing={6}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold">
            {labelByKey('transfer_option_total_value')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
          <Typography color="primary" variant="secondLevelValue" component="span" data-testid="total-value">
            {labelByKey('currency:GBP')}
            {currencyValue(transferOptions?.totalTransferValue)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">{labelByKey('transfer_option_DB_value')}</Typography>
        </Grid>
        <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
          <Typography color="primary" variant="secondLevelValue" component="span" data-testid="db-value">
            {labelByKey('currency:GBP')}
            {currencyValue(transferOptions?.totalGuaranteedTransferValue)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">{labelByKey('transfer_option_DC_value')}</Typography>
        </Grid>
        <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
          <Typography color="primary" variant="secondLevelValue" component="span" data-testid="dc-value">
            {labelByKey('currency:GBP')}
            {currencyValue(transferOptions?.totalNonGuaranteedTransferValue)}
          </Typography>
        </Grid>
      </Grid>
    </DetailsContainer>
  );
};
