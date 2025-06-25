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

export const LeavePensionBenefitsBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const { transferOptions, transferOptionsLoading } = useRetirementContext();
  const { membership } = useContentDataContext();
  const pensionIncomeTooltip = tooltipByKey('partial_transfer_pen_inc_tooltip');

  return (
    <Grid id={id} container>
      <Typography variant="body1" fontWeight="bold" mb={2}>
        {labelByKey('partial_transfer_benefits_header')}
      </Typography>
      <Grid item xs={12}>
        <DetailsContainer isLoading={transferOptionsLoading} bgcolor="appColors.support80.transparentLight">
          <Grid item xs={12} md={6}>
            <Typography variant="body1" fontWeight="bold" display="flex" data-testid="leave-pension-inc-label">
              {labelByKey('partial_transfer_pension_income')}
              {pensionIncomeTooltip && (
                <Tooltip header={pensionIncomeTooltip.header} html={pensionIncomeTooltip.html} />
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              color="primary"
              variant="secondLevelValue"
              component="span"
              data-testid="leave-pension-inc-value"
              fontWeight="bold"
              sx={{ textAlign: { md: 'end' } }}
            >
              {`${labelByKey('currency:GBP')}${currencyValue(transferOptions?.totalPensionAtDOL)}/${labelByKey(
                'year',
              )}`}
            </Typography>
          </Grid>
          {!!membership?.hasAdditionalContributions && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" fontWeight="bold" data-testid="leave-pension-transfer-avcs-label">
                  {labelByKey('partial_transfer_avcs')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  color="primary"
                  variant="secondLevelValue"
                  component="span"
                  data-testid="leave-pension-transfer-avcs-value"
                  fontWeight="bold"
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
