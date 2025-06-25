import * as yup from 'yup';

export const changeLumpSumSchema = (minLumpSum: number, maxLumpSum: number) =>
  yup.object({
    taxFreeLumpSum: yup
      .number()
      .typeError('tfc_only_digits')
      .default(minLumpSum)
      .min(minLumpSum, 'tfc_low_amount_error')
      .max(maxLumpSum, 'tfc_high_amount_error')
      .required('tfc_mandatory'),
    percentage: yup.string().notRequired(),
  });

export type ChangeLumpSumForm = yup.InferType<ReturnType<typeof changeLumpSumSchema>>;
