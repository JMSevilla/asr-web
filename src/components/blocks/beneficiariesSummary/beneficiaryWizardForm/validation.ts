import isBefore from 'date-fns/isBefore';
import * as yup from 'yup';
import { DEFAULT_PHONE_COUNTRY_CODE, ADDRESS_REGEX } from '../../../../business/constants';
import { BeneficiaryChooseType, BeneficiaryFormType } from './types';

const MAX_DATE = new Date(new Date().toDateString());
MAX_DATE.setDate(MAX_DATE.getDate() + 1);

export const beneficiaryInlineErrors = {
  incorrect_lumpsum: 'benef_summary_incorrect_lumpsum_inline',
  incorrect_allocation: 'benef_summary_incorrect_allocation',
};

export const beneficiaryAddressSchema = yup
  .object({
    line1: yup.string().max(25, 'beneficiaries_wizard_address_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).nullable().default(''),
    line2: yup.string().max(25, 'beneficiaries_wizard_address2_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).nullable().default(''),
    line3: yup.string().max(25, 'beneficiaries_wizard_address3_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).nullable().default(''),
    line4: yup.string().max(25, 'beneficiaries_wizard_address4_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).nullable().default(''),
    line5: yup.string().max(25, 'beneficiaries_wizard_address5_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).nullable().default(''),
    city: yup.string(),
    country: yup.string().nullable(),
    countryCode: yup.string().default(DEFAULT_PHONE_COUNTRY_CODE).nullable(),
    postCode: yup.string().max(8, 'postcode_max_length').nullable(),
  })
  .required();

export const beneficiaryDetailsSchema = yup
  .object({
    forenames: yup
      .string()
      .matches(/^(?!\s+$).*/, 'beneficiaries_wizard_forenames_not_only_whitespace_character')
      .max(32, 'beneficiaries_wizard_forenames_max_length')
      .required('first_name_required'),
    surname: yup
      .string()
      .matches(/^(?!\s+$).*/, 'beneficiaries_wizard_surname_not_only_whitespace_character')
      .max(20, 'beneficiaries_wizard_surname_max_length')
      .required('surname_required'),
    relationship: yup.string().required('relationship_required'),
    dateOfBirth: yup
      .date()
      .notRequired()
      .typeError('dateOfBirth_invalid_value')
      .nullable()
      .min(new Date(Date.UTC(1900, 0, 0)), 'beneficiaries_wizard_dateOfBirth_min_date')
      .test('dateOfBirth', 'date_no_future_date', value =>
        value ? isBefore(new Date(new Date(value).toDateString()), MAX_DATE) : true,
      )
      .default(null),
  })
  .required();

export const beneficiaryCharityDetailsSchema = yup
  .object({
    charityName: yup
      .string()
      .matches(/^(?!\s+$).*/, 'charity_name_not_only_whitespace_character')
      .max(120, 'beneficiaries_wizard_charity_name_max_length')
      .required('charity_name_required'),
    charityNumber: yup
      .number()
      .test('length', 'beneficiaries_wizard_charity_number_max_length', number =>
        number?.toString().length === undefined || number?.toString().length <= 10 ? true : false,
      )
      .required('charity_number_required'),
  })
  .required();

export const charityBeneficiaryLumpSumSchema = yup
  .object({
    lumpSumPercentage: yup.number().required('lump_sum_percentage_required').default(0),
    isPensionBeneficiary: yup.boolean().default(false),
    notes: yup.string().max(180, 'beneficiaries_wizard_notes_max_length').optional().nullable(),
  })
  .required();

export const beneficiaryLumpSumSchema = yup
  .object({
    lumpSumPercentage: yup.number().required('lump_sum_percentage_required').default(0),
    isPensionBeneficiary: yup.boolean().required().nullable().default(false),
    notes: yup.string().max(180, 'beneficiaries_wizard_notes_max_length').optional().nullable(),
  })
  .required();

export const beneficiarySchema = yup
  .object({
    id: yup.number().optional(),
    valueId: yup.string(),
    optionId: yup.string().optional(),
    type: yup.mixed<BeneficiaryChooseType>(),
    isPensionBeneficiary: yup
      .boolean()
      .test('lumpSumAllocation', beneficiaryInlineErrors.incorrect_allocation, (value, context) =>
        testLumpSumAllocation(context.parent.lumpSumPercentage, value, context.parent.relationship === 'Charity'),
      )
      .default(false),
    lumpSumPercentage: yup
      .number()
      .required()
      .test('lumpSumAllocation', beneficiaryInlineErrors.incorrect_allocation, (value, context) =>
        testLumpSumAllocation(value, context.parent.isPensionBeneficiary, context.parent.relationship === 'Charity'),
      )
      .default(0),
    charityName: yup.string().nullable(),
    charityNumber: yup.number().nullable(),
    forenames: yup.string().nullable(),
    surname: yup.string().nullable(),
    relationship: yup.string().nullable(),
    dateOfBirth: yup.date().nullable(),
    address: beneficiaryAddressSchema.nullable().notRequired(),
  })
  .required()
  .concat(beneficiaryLumpSumSchema);

export const beneficiariesSchema = yup.object({
  beneficiaries: yup.array().default([]).of(beneficiarySchema).required(),
  // Validated only on submit
  totalLumpSumPercentage: yup
    .number()
    .test(
      'totalLumpSumPercentage',
      'benef_summary_incorrect_lumpsum_top',
      (_, context) => !isTotalLumpSumValid(context.parent.beneficiaries),
    ),
});

const testLumpSumAllocation = (lumpSumPercentage?: number, isPensionBeneficiary?: boolean, isCharity?: boolean) => {
  if (isCharity) return true;

  if (isPensionBeneficiary === false && lumpSumPercentage === 0) {
    return false;
  }

  return true;
};

const isPensionAllocationValid = (values: BeneficiaryFormType[]) => {
  if (!values.length) return null;

  if (
    !values.some(x => !testLumpSumAllocation(x.lumpSumPercentage, x.isPensionBeneficiary, x.relationship === 'Charity'))
  )
    return null;

  return beneficiaryInlineErrors.incorrect_allocation;
};

const isTotalLumpSumValid = (values: BeneficiaryFormType[]) => {
  if (!values.length) return null;

  if (totalLumpSum(values as BeneficiaryFormType[]) === 100) return null;

  return beneficiaryInlineErrors.incorrect_lumpsum;
};

function totalLumpSum(data: { lumpSumPercentage: number }[]) {
  const sum = data.reduce((sum, item) => item.lumpSumPercentage + sum, 0);
  return parseFloat(sum.toFixed(2));
}

export const inlineErrorMessages = (values: BeneficiaryFormType[]) =>
  isPensionAllocationValid(values) ?? isTotalLumpSumValid(values);
