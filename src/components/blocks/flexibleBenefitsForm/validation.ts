import * as yup from 'yup';
import { isNotFutureDate } from '../../../business/dates';

export const flexibleBenefitsFormSchema = (errorKeyPrefix: string) => {
  const fieldErrorName = (field: string, errorKey: string) => `${errorKeyPrefix}_${field}_${errorKey}`;

  return yup.object({
    nameOfPlan: yup
      .string()
      .matches(/^(?!\s+$).*/, fieldErrorName('name_of_plan', 'invalid_value'))
      .max(50, fieldErrorName('name_of_plan', 'max_length'))
      .nullable(),
    typeOfPayment: yup
      .string()
      .matches(/^(?!\s+$).*/, fieldErrorName('type_of_payment', 'invalid_value'))
      .max(50, fieldErrorName('type_of_payment', 'max_length'))
      .nullable(),
    dateOfPayment: yup
      .date()
      .default(null)
      .nullable()
      .typeError(fieldErrorName('date_of_payment', 'invalid_value'))
      .min(new Date(Date.UTC(1900, 0, 0)), fieldErrorName('date_of_payment', 'min_date'))
      .test('dateOfPayment', fieldErrorName('date_of_payment', 'no_future_date'), isNotFutureDate),
  });
};

export type FlexibleBenefitsFormType = yup.InferType<ReturnType<typeof flexibleBenefitsFormSchema>>;
