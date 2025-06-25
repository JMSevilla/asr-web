import * as yup from 'yup';

export const emailFormSchema = yup.object({
  email: yup
    .string()
    .email('email_field_invalid_email_address_error')
    .max(50, 'email_field_max_length')
    .required('email_field_mandatory_error'),
});

export type EmailsFormType = yup.InferType<typeof emailFormSchema>;
