import { parseISO } from 'date-fns';
import { Beneficiary, BeneficiaryListUpdateRequest } from '../../../../api/mdp/types';
import { normalizeDate } from '../../../../business/dates';
import { BeneficiaryFormType } from './types';

export function mapBeneficiariesSummaryFormValuesToUpdateRequest(
  contentAccessKey: string,
  data?: BeneficiaryFormType[],
): BeneficiaryListUpdateRequest {
  return {
    beneficiaries:
      data?.map(item => ({
        address:
          item.relationship === 'Charity'
            ? {}
            : {
                city: item.address?.city,
                country: item.address?.country!,
                countryCode: item.address?.countryCode!,
                line1: item.address?.line1!,
                line2: item.address?.line2!,
                line3: item.address?.line3!,
                line4: item.address?.line4!,
                line5: item.address?.line5!,
                postCode: item.address?.postCode!,
              },
        id: item.id,
        lumpSumPercentage: item.lumpSumPercentage,
        isPensionBeneficiary: item.isPensionBeneficiary,
        charityName: item.charityName!,
        charityNumber: item.charityNumber!,
        relationship: item.relationship!,
        dateOfBirth:
          item.relationship === 'Charity'
            ? null
            : item?.dateOfBirth
            ? normalizeDate(item.dateOfBirth).toISOString()
            : null,
        forenames: item.forenames!,
        surname: item.surname!,
        notes: item.notes,
      })) ?? [],
    contentAccessKey,
  };
}

export function mapBeneficiariesToWizardFormValues(data?: Beneficiary[]): BeneficiaryFormType[] {
  return data?.map(mapBeneficiaryToWizardFormValue) ?? [];
}

export function mapBeneficiaryToWizardFormValue(item: Beneficiary, index: number): BeneficiaryFormType {
  return {
    valueId: item.id ? `${item.id}` : '',
    optionId: (index + 2)?.toString(),
    address:
      item.relationship === 'Charity'
        ? null
        : {
            city: item.address.city,
            country: item.address.country,
            countryCode: item.address.countryCode,
            line1: item.address.line1,
            line2: item.address.line2,
            line3: item.address.line3,
            line4: item.address.line4,
            line5: item.address.line5,
            postCode: item.address.postCode,
          },
    id: item.id,
    relationship: item.relationship,
    lumpSumPercentage: item.lumpSumPercentage,
    isPensionBeneficiary: item.isPensionBeneficiary,
    dateOfBirth: item.relationship === 'Charity' ? null : item.dateOfBirth ? parseISO(item.dateOfBirth) : null,
    charityName: item.charityName,
    charityNumber: item?.charityNumber,
    forenames: item.forenames,
    surname: item.surname,
    notes: item.notes,
    type: item.relationship === 'Charity' ? 'CHARITY' : 'PERSON',
  };
}
