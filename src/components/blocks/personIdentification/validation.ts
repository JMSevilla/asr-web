import * as yup from 'yup';
import { ButtonsType } from './types';

export const personIdentificationFormSchema = (errorKeyPrefix: string) => {
  const fieldErrorName = (field: string, errorKey: string) => `${errorKeyPrefix}_${field}_${errorKey}`;

  return yup.object({
    identification: yup
      .object({
        type: yup.string().required(fieldErrorName('options', 'required')),
        nationalInsuranceNumber: yup
          .string()
          .when('type', (type: ButtonsType, schema: yup.StringSchema) =>
            type === 'INSURANCE_NUMBER'
              ? schema
                  .required(fieldErrorName('insurance_number', 'required'))
                  .max(9, fieldErrorName('insurance_number', 'max_length'))
                  .test('format', fieldErrorName('insurance_number', 'incorrect_pattern'), number =>
                    /[a-zA-Z]{2}\d{6}[a-zA-Z]{1}/.test(number ?? ''),
                  )
              : schema.notRequired(),
          )
          .default(''),
        personalPublicServiceNumber: yup
          .string()
          .when('type', (type: ButtonsType, schema: yup.StringSchema) =>
            type === 'SERVICE_NUMBER'
              ? schema
                  .required(fieldErrorName('service_number', 'required'))
                  .max(9, fieldErrorName('service_number', 'max_length'))
                  .test('format', fieldErrorName('service_number', 'incorrect_pattern'), number =>
                    /\d{7}[a-zA-Z\d]{1}[a-zA-Z]{1}/.test(number ?? ''),
                  )
              : schema.notRequired(),
          )
          .default(''),
        pensionReferenceNumbers: yup
          .array()
          .default([])
          .of(yup.string().max(7, fieldErrorName('reference_number', 'max_length')).default('')),
      })
      .default(undefined),
  });
};

export type PersonIdentificationFormType = yup.InferType<ReturnType<typeof personIdentificationFormSchema>>;
