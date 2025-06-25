import * as yup from 'yup';

export const loginFormSchema = yup.object({
  userName: yup.string().required('user_id_mandatory_field').max(80, 'user_id_max_length').default(''),
  password: yup.string().required('password_mandatory_field').max(128, 'password_max_length').default(''),
});

export type LoginForm = yup.InferType<typeof loginFormSchema>;
