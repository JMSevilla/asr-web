import * as yup from 'yup';
import { DEFAULT_PHONE_COUNTRY_CODE } from '../../../business/constants';
import { isIbanMandatoryByCountryCode } from '../../../business/country';

export const bankDetailsFormSchema = yup.object({
  bankCountryCode: yup.string().required('ban_country_required'),
  accountName: yup.string().required('bank_account_name_required').max(40, 'bank_account_name_max_length'),
  accountNumber: yup
    .string()
    .matches(/^(\s*|\d+)$/, 'only_digits')
    .when('bankCountryCode', (country: string, schema: yup.StringSchema) => {
      if (country === DEFAULT_PHONE_COUNTRY_CODE) {
        return schema.required('bank_account_number_required').length(8, 'bank_account_number_length');
      }
      if (!isIbanMandatoryByCountryCode(country)) {
        return schema.required('bank_account_number_required').max(20, 'bank_account_number_length_nonuk_noniban');
      }
      return schema.notRequired();
    }),
  sortCode: yup
    .string()
    .matches(/^(\s*|\d+)$/, 'only_digits')
    .when('bankCountryCode', (country: string, schema: yup.StringSchema) =>
      country === DEFAULT_PHONE_COUNTRY_CODE
        ? schema.required('bank_sort_code_required').length(6, 'bank_sort_code_length')
        : schema.notRequired(),
    ),
  iban: yup.string().when('bankCountryCode', (country: string, schema: yup.StringSchema) =>
    isIbanMandatoryByCountryCode(country)
      ? schema
          .matches(/^[A-Z\d\s]+$/, 'bank_iban_inccorect_pattern')
          .max(34, 'bank_iban_max_length')
          .required('bank_iban_required')
      : schema.notRequired(),
  ),
  bic: yup.string().when('bankCountryCode', (country: string, schema: yup.StringSchema) =>
    country !== DEFAULT_PHONE_COUNTRY_CODE
      ? schema
          .matches(/[A-Z]{4,4} ?[A-Z]{2,2} ?[A-Z0-9][A-Z0-9] ?([A-Z0-9]{3,3}){0,1}/, 'bank_bic_inccorect_pattern')
          .matches(/^[A-Z\d\s]+$/, 'bank_bic_inccorect_pattern')
          .trim()
          .test('length', 'bank_bic_min_length', val => val?.length === 8 || val?.length === 11)
          .required('bank_bic_required')
      : schema.notRequired(),
  ),
  clearingCode: yup
    .string()
    .when('bankCountryCode', (country: string, schema: yup.StringSchema) =>
      country !== DEFAULT_PHONE_COUNTRY_CODE ? schema.max(11, 'bank_clearing_code_max_length') : schema.notRequired(),
    ),
  accountCurrency: yup
    .string()
    .when('bankCountryCode', (country: string, schema: yup.StringSchema) =>
      country !== DEFAULT_PHONE_COUNTRY_CODE ? schema.required('bank_account_currency_required') : schema.notRequired(),
    ),
});

export type BankDetailsFormType = yup.InferType<typeof bankDetailsFormSchema>;
