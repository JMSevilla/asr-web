import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TransferOptions } from '../../../../api/mdp/types';
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
import { TransferValueCalculatorForm, TransferValueSchema } from './transferValueValidation';

interface Props {
  index: number;
  transferOptions: TransferOptions;
}

export const ExploreByTransferValueCalculatorTab: React.FC<Props> = ({ index, transferOptions }) => {
  const { isMobile } = useResolution();
  const { activeTabIndex } = useTabsContext();
  const { labelByKey, tooltipByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { onTransferCalculationChanged, toggleIsSubmitting } = useTransferJourneyContext();
  const { membership } = useContentDataContext();
  const requestedTransferValueCb = useApiCallback((api, params: number) => api.mdp.pensionTranches(params));
  const validationSchema = TransferValueSchema(
    transferOptions?.minimumPartialTransferValue ?? 0,
    transferOptions?.maximumPartialTransferValue ?? 1,
  );

  const { handleSubmit, control, formState, reset, clearErrors } = useForm<TransferValueCalculatorForm>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: validationSchema.getDefault(),
  });

  const transferAmountTooltip = tooltipByKey('PT_enter_transfer_amount_tooltip');

  useEffect(() => {
    const value = requestedTransferValueCb.currentParams?.[0];
    if (index === activeTabIndex) {
      reset({ requestedTransferValue: value ? +value : undefined });
      onTransferCalculationChanged({ requestedTransferValue: value ? +value : undefined });
    }
  }, [index, activeTabIndex]);

  useEffect(() => {
    if (!requestedTransferValueCb.error) return;

    showNotifications([{ type: MessageType.Problem, message: errorByKey('partial_transfer_calculation_failed') }]);

    return () => hideNotifications();
  }, [requestedTransferValueCb.error]);

  return (
    <PartialTransferCalculatorLayout
      id={`tab-${index}`}
      leftPaneLabel={labelByKey('PT_transfer_amount')}
      rightPaneLabel={labelByKey('PT_after_transfer_benefits')}
      leftPane={
        <>
          <Grid item xs={12} md={10} mb={{ md: 6, xs: 6 }}>
            <Typography variant="body1">{labelByKey('PT_transfer_amount_info')}</Typography>
          </Grid>
          <Grid item xs={12} container spacing={4} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <NumberField
                allowEmpty
                decimalScale={2}
                thousandSeparator
                control={control}
                isLoading={requestedTransferValueCb.loading}
                name="requestedTransferValue"
                onEnter={handleSubmit(handleRequestTransferValue)}
                onBlur={() => clearErrors()}
                placeholder={labelByKey('PT_enter_transfer_amount_ghost')}
                showErrorBelowLabel
                label={
                  <Typography minWidth={{ md: 'max-content' }} display="flex" data-testid="PT-enter-transfer-amount">
                    {`${labelByKey('PT_enter_transfer_amount')} ${labelByKey('currency:GBP')}${currencyValue(
                      transferOptions.minimumPartialTransferValue,
                    )}`}
                    {transferAmountTooltip && (
                      <Tooltip header={transferAmountTooltip.header} html={transferAmountTooltip.html} />
                    )}
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PrimaryButton
                onClick={handleSubmit(handleRequestTransferValue)}
                loading={requestedTransferValueCb.loading}
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
            label={labelByKey('PT_pension_income')}
            value={`${labelByKey('currency:GBP')} ${`${currencyValue(
              requestedTransferValueCb.result?.data.pensionTranchesResidualTotal,
            )} ${labelByKey('year_before_tax_at_date_of_leaving')}`}`}
            loading={requestedTransferValueCb.loading}
            valueDataTestId="PT-pension-income-value"
          />
          {membership?.hasAdditionalContributions && (
            <PartialTransferCalculatorResultField
              label={labelByKey('PT_pension_avcs')}
              value={`${labelByKey('currency:GBP')} ${currencyValue(0)}`}
              infoLabel={labelByKey('PT_avcs_additional_info')}
              loading={requestedTransferValueCb.loading}
              valueDataTestId="PT-pension-avcs-value"
            />
          )}
        </>
      }
    />
  );

  async function handleRequestTransferValue(values: TransferValueCalculatorForm) {
    toggleIsSubmitting(true);

    try {
      await requestedTransferValueCb.execute(values.requestedTransferValue!);
      onTransferCalculationChanged({ requestedTransferValue: values.requestedTransferValue! });
    } finally {
      toggleIsSubmitting(false);
    }
  }
};
