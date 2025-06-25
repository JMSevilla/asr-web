import * as yup from 'yup';

export const PensionIncomeSchema = (minimumResidualPension: number, maximumResidualPension: number) =>
  yup.object({
    requestedResidualPension: yup
      .number()
      .min(minimumResidualPension, 'PT_enter_pension_amount_min_error')
      .max(maximumResidualPension, 'PT_enter_pension_amount_max_error')
      .required('PT_enter_pension_amount_mandatory'),
  });

export type PensionIncomeForm = yup.InferType<ReturnType<typeof PensionIncomeSchema>>;
