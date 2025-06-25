import * as yup from 'yup';
import { ADDRESS_REGEX, POSTCODE_REGEX } from '../../../business/constants';

export const personAddressFormSchema = (prefix: string, isOptional: boolean) =>
  yup.object({
    address: yup.object({
      line1: isOptional
        ? yup
            .string()
            .max(50, `${prefix}_addressLine1_max_length`)
            .matches(ADDRESS_REGEX, `alphanumeric_special_only`)
            .default('')
        : yup
            .string()
            .max(50, `${prefix}_addressLine1_max_length`)
            .required(`${prefix}_addressLine_required`)
            .matches(ADDRESS_REGEX, `alphanumeric_special_only`)
            .default(''),
      line2: yup
        .string()
        .max(50, `${prefix}_addressLine2_max_length`)
        .matches(ADDRESS_REGEX, `alphanumeric_special_only`),
      line3: yup
        .string()
        .max(50, `${prefix}_addressLine3_max_length`)
        .matches(ADDRESS_REGEX, `alphanumeric_special_only`),
      line4: yup
        .string()
        .max(50, `${prefix}_addressLine4_max_length`)
        .matches(ADDRESS_REGEX, `alphanumeric_special_only`),
      line5: yup
        .string()
        .max(50, `${prefix}_addressLine5_max_length`)
        .matches(ADDRESS_REGEX, `alphanumeric_special_only`),
      postCode: yup
        .string()
        .max(8, `${prefix}_postcode_max_length`)
        .matches(POSTCODE_REGEX, `alphanumeric_special_only`),
      countryCode: yup.string().default(''),
      countryName: yup.string(),
    }),
  });

export type PersonAddressFormType = yup.InferType<ReturnType<typeof personAddressFormSchema>>;
