import * as yup from 'yup';
import {
  beneficiariesSchema,
  beneficiaryAddressSchema,
  beneficiaryCharityDetailsSchema,
  beneficiaryDetailsSchema,
  beneficiaryLumpSumSchema,
  beneficiarySchema,
  charityBeneficiaryLumpSumSchema,
} from './validation';

export type BeneficiariesFormType = yup.InferType<typeof beneficiariesSchema>;
export type BeneficiaryFormType = yup.InferType<typeof beneficiarySchema>;
export type BeneficiaryAddressFormType = yup.InferType<typeof beneficiaryAddressSchema>;
export type BeneficiaryDetailsFormType = yup.InferType<typeof beneficiaryDetailsSchema>;
export type BeneficiaryLumpSumType = yup.InferType<typeof beneficiaryLumpSumSchema>;
export type CharityBeneficiaryLumpSumType = yup.InferType<typeof charityBeneficiaryLumpSumSchema>;
export type BeneficiaryCharityDetailsFormType = yup.InferType<typeof beneficiaryCharityDetailsSchema>;
export type BeneficiaryChooseType = 'PERSON' | 'CHARITY';
