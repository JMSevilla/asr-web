import * as yup from 'yup';

export const emailFormSchema = yup.object({
  email: yup
    .string()
    .email('email_verification_form_field_invalid_email')
    .max(50, 'email_verification_form_field_max_length')
    .required('email_verification_form_field_mandatory_error'),
});

export type EmailsFormType = yup.InferType<typeof emailFormSchema>;
