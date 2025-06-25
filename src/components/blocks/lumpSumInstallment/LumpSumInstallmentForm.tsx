import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack } from '@mui/material';
import { endOfDay, startOfDay } from 'date-fns';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { getUTCDate } from '../../../business/dates';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { PrimaryButton } from '../../buttons';
import { DateField, NumberField } from '../../form';
import { ChangeLumpSumForm, changeLumpSumSchema, getDefaultDateFromMinMax } from './validation';

interface Props {
  prefix: string;
  totalLumpSum: number;
  maxLumpSum: number;
  retirementDate: Date;
  onSubmit(values: ChangeLumpSumForm): void;
  defaultFirstPaymentAmount?: string;
  defaultSecondPaymentDate?: string;
  loading: boolean;
  minDate: Date;
  maxDate: Date;
}

export const LumpSumInstallmentForm: React.FC<Props> = ({
  prefix,
  totalLumpSum,
  maxLumpSum,
  retirementDate,
  onSubmit,
  defaultFirstPaymentAmount,
  defaultSecondPaymentDate,
  loading,
  minDate,
  maxDate,
}) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const validationSchema = changeLumpSumSchema({
    prefix,
    maxLumpSum: +maxLumpSum,
    retirementDate,
    minDate: startOfDay(minDate),
    maxDate: endOfDay(maxDate),
  });
  const { control, reset, clearErrors, handleSubmit } = useForm<ChangeLumpSumForm>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    defaultValues: validationSchema.getDefault(),
    mode: 'onChange',
  });
  const { isValid, isDirty } = useFormState({ control });

  useFormSubmissionBindingHooks({
    key: prefix,
    isValid: !isDirty && !loading,
    isDirty,
    cb: () => handleSubmit(onSubmit)(),
  });

  useEffect(() => {
    reset({
      firstPaymentAmount: defaultFirstPaymentAmount ? +defaultFirstPaymentAmount : +(totalLumpSum / 2).toFixed(2),
      secondPaymentDate: defaultSecondPaymentDate
        ? getUTCDate(defaultSecondPaymentDate)
        : getDefaultDateFromMinMax(retirementDate, minDate, maxDate),
    });
  }, [defaultFirstPaymentAmount, defaultSecondPaymentDate]);

  return (
    <Stack gap={12} flexDirection="column" flexWrap="nowrap">
      <Stack
        gap={6}
        component="form"
        data-testid={`${prefix}_form`}
        sx={{ '& .MuiOutlinedInput-root': { width: theme => theme.sizes.numberFieldWidth } }}
      >
        <NumberField
          boldLabelFirstWord
          name="firstPaymentAmount"
          control={control}
          label={labelByKey(`${prefix}_first_payment_amount`)}
          errorTooltip={tooltipByKey(`${prefix}_first_payment_amount_error_tooltip`)}
          tooltip={tooltipByKey(`${prefix}_first_payment_tooltip`)}
          onBlur={() => clearErrors()}
          asStringValue={false}
          decimalScale={2}
          thousandSeparator
          fixedDecimalScale
        />

        <DateField
          boldLabelFirstWord
          name="secondPaymentDate"
          control={control}
          label={labelByKey(`${prefix}_second_payment_date`)}
          errorTooltip={tooltipByKey(`${prefix}_second_payment_date_error_tooltip`)}
          tooltip={tooltipByKey(`${prefix}_second_payment_date_tooltip`)}
          onBlur={() => clearErrors()}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Stack>
      <Box>
        <PrimaryButton
          data-testid="apply-button"
          onClick={() => handleSubmit(onSubmit)()}
          disabled={!isDirty || !isValid}
          loading={loading}
        >
          {labelByKey(`${prefix}_recalculate`)}
        </PrimaryButton>
      </Box>
    </Stack>
  );
};
