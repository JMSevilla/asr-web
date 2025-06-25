import * as yup from 'yup';

export const acknowledgementsFormSchema = yup.object({
  option1: yup.boolean().default(false),
  option2: yup.boolean().default(false),
  option3: yup.boolean().default(false),
});

export type AcknowledgementsFormType = yup.InferType<typeof acknowledgementsFormSchema>;
