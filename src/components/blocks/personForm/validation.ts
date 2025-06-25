import { isAfter, isValid, startOfDay } from 'date-fns';
import * as yup from 'yup';
import { DEFAULT_PHONE_COUNTRY_CODE, PHONE_REGEX } from '../../../business/constants';
import { getLocalStartOfDay, isNotFutureDate } from '../../../business/dates';

export const personFormSchema = (fields: string[], errorKeyPrefix: string, maxCharactersCommment: number) => {
  const fieldErrorName = (field: string, errorKey: string) => `${errorKeyPrefix}_${field}_${errorKey}`;

  return yup.object({
    name: fields.includes('name')
      ? yup
        .string()
        .matches(/^(?!\s+$).*/, fieldErrorName('name', 'not_only_whitespace_character'))
        .max(32, fieldErrorName('name', 'max_length'))
        .required(fieldErrorName('name', 'required'))
      : yup.string(),
    surname: fields.includes('surname')
      ? yup
        .string()
        .matches(/^(?!\s+$).*/, fieldErrorName('surname', 'not_only_whitespace_character'))
        .max(20, fieldErrorName('surname', 'max_length'))
        .required(fieldErrorName('surname', 'required'))
      : yup.string(),
    advisorName: fields.includes('advisor_name')
      ? yup
        .string()
        .matches(/^(?!\s+$).*/, fieldErrorName('advisor_name', 'not_only_whitespace_character'))
        .max(50, fieldErrorName('advisor_name', 'max_length'))
      : yup.string(),
    schemeName: fields.includes('scheme_name')
      ? yup
        .string()
        .matches(/^(?!\s+$).*/, fieldErrorName('scheme_name', 'not_only_whitespace_character'))
        .max(50, fieldErrorName('scheme_name', 'max_length'))
      : yup.string(),
    comment: (() => {
      if (fields.includes('comment')) {
        return yup
          .string()
          .matches(/^(?!\s+$).*/, fieldErrorName('comment', 'not_only_whitespace_character'))
          .max(maxCharactersCommment, fieldErrorName('comment', 'max_length'));
      }
      if (fields.includes('mandatory_comment')) {
        return yup
          .string()
          .matches(/^(?!\s+$).*/, fieldErrorName('comment', 'not_only_whitespace_character'))
          .max(maxCharactersCommment, fieldErrorName('comment', 'max_length'))
          .required(fieldErrorName('comment', 'required'));
      }
      return yup.string();
    })(),
    companyName: fields.includes('company_name')
      ? yup
        .string()
        .matches(/^(?!\s+$).*/, fieldErrorName('company_name', 'not_only_whitespace_character'))
        .max(50, fieldErrorName('company_name', 'max_length'))
      : yup.string(),
    email: fields.includes('email')
      ? yup
        .string()
        .email(fieldErrorName('email', 'invalid_value'))
        .max(50, fieldErrorName('email', 'max_length'))
        .required(fieldErrorName('email', 'required'))
      : yup
        .string()
        .email(fieldErrorName('email', 'invalid_value'))
        .max(50, fieldErrorName('email', 'max_length'))
        .transform(val => (val ? val : undefined)),
    dateOfBirth: fields.includes('date_of_birth')
      ? yup
        .date()
        .default(null)
        .nullable()
        .typeError(fieldErrorName('date_of_birth', 'invalid_value'))
        .min(new Date(Date.UTC(1900, 0, 0)), fieldErrorName('date_of_birth', 'min_date'))
        .test('dateOfBirth', fieldErrorName('date_of_birth', 'no_future_date'), isNotFutureDate)
        .transform(getLocalStartOfDay)
      : yup.date(),
    dateOfDeath: fields.includes('date_of_death')
      ? yup
        .date()
        .default(null)
        .typeError(fieldErrorName('date_of_death', 'invalid_value'))
        .min(new Date(Date.UTC(1900, 0, 0)), fieldErrorName('date_of_death', 'min_date'))
        .test(
          'after-birth-date',
          fieldErrorName('date_of_death', 'min_date'),
          function (value) {
            const { dateOfBirth } = this.parent as { dateOfBirth?: Date | null }
            if (!value || !dateOfBirth || !isValid(dateOfBirth)) return true
            return isAfter(startOfDay(value), startOfDay(dateOfBirth))
          }
        )
        .test('no-future-date', fieldErrorName('date_of_death', 'no_future_date'), isNotFutureDate)
        .transform(getLocalStartOfDay)
      : yup.date(),
    phoneCode: yup.string().default(DEFAULT_PHONE_COUNTRY_CODE),
    phoneNumber: fields.includes('phone')
      ? yup
        .string()
        .test('phoneNumber', fieldErrorName('phone', 'invalid_value'), value => (value ? value[0] !== '0' : true))
        .when('phoneCode', (phoneCode: string, schema: yup.StringSchema) =>
          phoneCode === DEFAULT_PHONE_COUNTRY_CODE
            ? schema.min(10, fieldErrorName('phone', 'min_length_GB'))
            : schema.min(7, fieldErrorName('phone', 'min_length')),
        )
        .max(20, fieldErrorName('phone', 'max_length'))
        .nullable()
        .transform(value => (value ? value : null))
        .matches(new RegExp(PHONE_REGEX), fieldErrorName('phone', 'invalid_format'))
      : yup.string(),
    relationship: fields.includes('relationship')
      ? yup.string().required(fieldErrorName('relationship', 'required'))
      : yup.string(),
  });
};

export type PersonFormType = yup.InferType<ReturnType<typeof personFormSchema>>;
