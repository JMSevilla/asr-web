import * as yup from 'yup';

export const phoneFormSchema = (countryCode?: string) => {
  return yup.object({
    phone: yup
      .string()
      .required('phone_field_mandatory_error')
      .min(3, 'phone_field_min_length')
      .when([], {
        is: () => countryCode === 'GB',
        then: schema =>
          schema
            .test('phone', 'gb_phone_field_incorrect_start', value => /^7/.test(value ?? ''))
            .min(10, 'gb_phone_field_length')
            .max(10, 'gb_phone_field_length'),
        otherwise: schema => schema.max(20, 'phone_field_max_length'),
      }),
  });
};

export type PhoneFormType = yup.InferType<ReturnType<typeof phoneFormSchema>>;
