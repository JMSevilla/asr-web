import * as yup from 'yup';

export const lsaQuestionSchema = (prefix: string) =>
  yup.object({
    paidLSACashAmount: yup
      .number()
      .typeError(`${prefix}_only_digits`)
      .min(0, `${prefix}_low_amount_error`)
      .required(`${prefix}_mandatory`),
    paidLSDBACashAmount: yup
      .number()
      .typeError(`${prefix}_only_digits`)
      .min(0, `${prefix}_low_amount_error`)
      .required(`${prefix}_mandatory`),
  });

export type LSAQuestionForm = yup.InferType<ReturnType<typeof lsaQuestionSchema>>;
