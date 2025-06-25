import * as yup from 'yup';

export const ltaPercentageFormSchema = yup.object({
  percentage: yup
    .number()
    .typeError('LTA_percentage_only_digits')
    .required('LTA_percentage_required')
    .min(0.01, 'LTA_percentage_low_amount')
    .max(999.99, 'LTA_percentage_high_amount')
    .test('maxDigitsAfterDecimal', 'LTA_percentage_decimal_limit', number =>
      /^\d+(\.\d{1,2})?$/.test(number?.toString() ?? ''),
    )
});

export type LTAPercentageFormType = yup.InferType<typeof ltaPercentageFormSchema>;
