import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TransferOptions, TransferValuesParams } from '../../../../api/mdp/types';
import { currencyValue } from '../../../../business/currency';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useTransferJourneyContext } from '../../../../core/contexts/TransferJourneyContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useResolution } from '../../../../core/hooks/useResolution';
import { PrimaryButton } from '../../../buttons';
import { NumberField } from '../../../form';
import { Tooltip } from '../../../Tooltip';
import { MessageType } from '../../../topAlertMessages';
import { PartialTransferCalculatorLayout } from '../shared/PartialTransferCalculatorLayout';
import { PartialTransferCalculatorResultField } from '../shared/PartialTransferCalculatorResultField';
import { useTabsContext } from '../tabs/TabsContextProvider';
import { PensionIncomeForm, PensionIncomeSchema } from './pensionIncomeValidation';

interface Props {
  index: number;
  transferOptions: TransferOptions;
}

export const ExploreByPensionIncomeCalculatorTab: React.FC<Props> = ({ index, transferOptions }) => {
  const { isMobile } = useResolution();
  const { activeTabIndex } = useTabsContext();
  const { labelByKey, tooltipByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { onTransferCalculationChanged, toggleIsSubmitting } = useTransferJourneyContext();
  const pensionIncomeCb = useApiCallback((api, params: TransferValuesParams) => api.mdp.transferValues(params));
  const { membership } = useContentDataContext();

  const validationSchema = PensionIncomeSchema(
    transferOptions?.minimumResidualPension ?? 0,
    transferOptions?.maximumResidualPension ?? 1,
  );
  const { handleSubmit, control, formState, reset, clearErrors } = useForm<PensionIncomeForm>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: validationSchema.getDefault(),
  });

  const pensionAmountTooltip = tooltipByKey('PT_enter_pension_amount_tooltip');

  useEffect(() => {
    const value = pensionIncomeCb.currentParams?.[0]?.requestedResidualPension;
    if (index === activeTabIndex) {
      reset({ requestedResidualPension: value ? +value : undefined });
      onTransferCalculationChanged({ requestedResidualPension: value ? +value : undefined });
    }
  }, [index, activeTabIndex]);

  useEffect(() => {
    if (!pensionIncomeCb.error) return;

    showNotifications([{ type: MessageType.Problem, message: errorByKey('partial_transfer_calculation_failed') }]);

    return () => hideNotifications();
  }, [pensionIncomeCb.error]);

  return (
    <PartialTransferCalculatorLayout
      id={`tab-${index}`}
      leftPaneLabel={labelByKey('PT_pension_amount')}
      rightPaneLabel={labelByKey('PT_after_selecting_pension')}
      leftPane={
        <>
          <Grid item xs={12} md={10} mb={{ md: 6, xs: 6 }}>
            <Typography variant="body1">{labelByKey('PT_pension_amount_info')}</Typography>
          </Grid>
          <Grid item xs={12} container spacing={4} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <NumberField
                allowEmpty
                decimalScale={2}
                thousandSeparator
                control={control}
                isLoading={pensionIncomeCb.loading}
                name="requestedResidualPension"
                onEnter={handleSubmit(handlePensionIncomeSubmit)}
                placeholder={labelByKey('PT_enter_pension_amount_ghost')}
                onBlur={() => clearErrors()}
                showErrorBelowLabel
                label={
                  <Typography
                    minWidth={{ md: 'max-content' }}
                    display="flex"
                    data-testid="PT-enter-pension-amount-ghost"
                  >
                    {`${labelByKey('PT_enter_transfer_amount_date_left')} ${labelByKey('currency:GBP')}${currencyValue(
                      transferOptions.minimumResidualPension,
                    )} ${labelByKey('and')} ${labelByKey('currency:GBP')}${currencyValue(
                      transferOptions.maximumResidualPension,
                    )}`}
                    {pensionAmountTooltip && (
                      <Tooltip header={pensionAmountTooltip.header} html={pensionAmountTooltip.html} />
                    )}
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PrimaryButton
                onClick={handleSubmit(handlePensionIncomeSubmit)}
                loading={pensionIncomeCb.loading}
                disabled={!formState.isValid}
                fullWidth={isMobile}
              >
                {labelByKey('PT_calculate_button')}
              </PrimaryButton>
            </Grid>
          </Grid>
        </>
      }
      rightPane={
        <>
          <PartialTransferCalculatorResultField
            label={labelByKey('PT_transfer_amount')}
            value={`${labelByKey('currency:GBP')} ${currencyValue(
              pensionIncomeCb.result?.data.transferValuesPartialTotal,
            )}`}
            loading={pensionIncomeCb.loading}
            valueDataTestId="PT-transfer-amount-value"
          />
          {!!membership?.hasAdditionalContributions && (
            <PartialTransferCalculatorResultField
              label={labelByKey('PT_transfer_avcs')}
              value={`${labelByKey('currency:GBP')} ${currencyValue(pensionIncomeCb.result?.data.nonGuaranteed ?? 0)}`}
              infoLabel={labelByKey('PT_avcs_additional_info')}
              loading={pensionIncomeCb.loading}
              valueDataTestId="PT-transfer-avcs-value"
            />
          )}
        </>
      }
    />
  );

  async function handlePensionIncomeSubmit(values: PensionIncomeForm) {
    toggleIsSubmitting(true);
    try {
      await pensionIncomeCb.execute(values);
      onTransferCalculationChanged({ requestedResidualPension: values.requestedResidualPension! });
    } finally {
      toggleIsSubmitting(false);
    }
  }
};
