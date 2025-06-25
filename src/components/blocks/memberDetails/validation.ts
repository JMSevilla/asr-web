import * as yup from 'yup';

export const contactPreferencesFormSchema = yup.object({
  email: yup.boolean().default(false),
  sms: yup.boolean().default(false),
  post: yup.boolean().default(false),
});

export type ContactPreferenceFormType = yup.InferType<typeof contactPreferencesFormSchema>;
