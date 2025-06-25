import * as yup from 'yup';
import { DEFAULT_PHONE_COUNTRY_CODE, ADDRESS_REGEX, POSTCODE_REGEX } from '../../../business/constants';

export const addressFormSchema = yup.object({
    addressLine1: yup.string().max(50, 'address_line_max_length').required('address_line_required').matches(ADDRESS_REGEX, `alphanumeric_special_only`).default(''),
    addressLine2: yup.string().max(50, 'address_line2_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).default(''),
    addressLine3: yup.string().max(50, 'address_line3_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).default(''),
    addressLine4: yup.string().max(50, 'address_line4_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).default(''),
    addressLine5: yup.string().max(50, 'address_line5_max_length').matches(ADDRESS_REGEX, `alphanumeric_special_only`).default(''),
    postCode: yup.string().max(8, 'postcode_max_length').matches(POSTCODE_REGEX, `alphanumeric_special_only`).default(''),
  countryCode: yup.string().default(DEFAULT_PHONE_COUNTRY_CODE),
  city: yup.string().default(''),
});

export type AddressFormType = yup.InferType<typeof addressFormSchema>;
