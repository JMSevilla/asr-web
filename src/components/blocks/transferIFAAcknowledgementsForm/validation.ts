import * as yup from 'yup';

export const transferIFAAcknowledgementsSchema = yup.object({
  option1: yup.boolean().default(false),
});

export type TransferIFAAcknowledgementsFormType = yup.InferType<typeof transferIFAAcknowledgementsSchema>;
