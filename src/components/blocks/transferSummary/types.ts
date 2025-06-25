import { ReactNode } from 'react';
import { Path } from 'react-hook-form';
import {
  TransferJourneyApplication,
  UploadedFile,
  UserAddress,
  UserEmail,
  UserPersonalDetails,
  UserPhone,
} from '../../../api/mdp/types';

export interface TransferSummaryDetailsSetProps {
  loading?: boolean;
  actionButton: ReactNode;
  personType: string;
  fields: { key: string; value: any; disabled?: boolean }[];
  prefixedLabel(key?: string): string;
  parsedValue(personType: string, fieldPath: TransferSummaryDetailsValuePath): string | string[] | boolean | undefined;
  actionsRow?: ReactNode;
}

export type TransferSummaryValues = {
  name?: string;
  dateOfBirth?: string;
  address?: string;
  consent?: boolean;
  advisorName?: string;
  schemeName?: string;
  companyName?: string;
  email?: string;
  optionalEmail?: string;
  phone?: number;
  country?: string;
  postCode?: string;
  question?: string;
  consent2?: string;
  uploaded?: string;
  nameOfPlan?: string;
  typeOfPayment?: string;
  dateOfPayment?: string;
  benefitsTaken?: string;
  pensionWiseDate?: string;
  shouldHideRest?: boolean;
  occupationalQuestion?: string;
  uploadedIdentity?: string;
};
export type TransferSummaryDetailsValuePath = Path<TransferSummaryValues>;

export type TransferData = {
  transferData: TransferJourneyApplication;
  uploadedFiles: UploadedFile[];
  personalDetails: UserPersonalDetails;
  userAddress: UserAddress;
  userPhone: UserPhone;
  userEmail: UserEmail;
  identityFiles: UploadedFile[];
};
