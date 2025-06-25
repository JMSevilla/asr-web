import { JourneyTypeSelection } from '../../../api/content/types/page';
import { isYes } from '../../../business/boolean';
import { NA_SYMBOL } from '../../../business/constants';
import { countryByCode } from '../../../business/country';
import { formatDate } from '../../../business/dates';
import { toTitleCase } from '../../../business/strings';
import { useApi } from '../../../core/hooks/useApi';
import { PersonAddressFormType } from '../personAddressForm/validation';
import { PersonFormType } from '../personForm/validation';
import { TransferData, TransferSummaryDetailsValuePath } from './types';

export const useTransferSummaryDetailsValues = (
  labelByKey: (key: string) => string,
  journeyType?: JourneyTypeSelection,
) => {
  const initialApiData = useApi(async api => {
    const [transferData, uploadedFiles, personalDetails, userAddress, userPhone, userEmail, identityFiles] = await Promise.all([
      api.mdp.transferJourneyTransferApplication(),
      journeyType ? api.mdp.documents(journeyType) : Promise.resolve({ data: [] }),
      api.mdp.userPersonalDetails(),
      api.mdp.userAddress(),
      api.mdp.userPhone(),
      api.mdp.userEmail(),
      journeyType ? api.mdp.documents('Identity') : Promise.resolve({ data: [] }),
    ]);

    return {
      transferData: transferData?.data,
      uploadedFiles: uploadedFiles?.data,
      personalDetails: personalDetails?.data,
      userAddress: userAddress?.data,
      userPhone: userPhone?.data,
      userEmail: userEmail?.data,
      identityFiles: identityFiles?.data,
    };
  });

  function parseValue(personType: string, fieldName: TransferSummaryDetailsValuePath) {
    switch (fieldName) {
      case 'address':
        return address(parseFormValuesFromGenericData('person_address_data', personType));
      case 'phone':
        return phone(parseFormValuesFromGenericData('person_data', personType));
      case 'dateOfBirth':
        return date(parseFormValuesFromGenericData('person_data', personType), fieldName);
      case 'country':
        return country(parseFormValuesFromGenericData('person_address_data', personType));
      case 'postCode':
        return postCode(parseFormValuesFromGenericData('person_address_data', personType));
      case 'question':
        const questionAnswerKey = findQuestionsByKey(initialApiData?.result, 't2_transfer_advice')?.answerKey;
        return questionAnswerKey ? labelByKey(questionAnswerKey) : undefined;
      case 'consent':
        const consentAnswerKey = findQuestionsByKey(
          initialApiData?.result,
          `${personType}_consent_question`,
        )?.answerKey;
        return consentAnswerKey ? labelByKey(consentAnswerKey) : undefined;
      case 'occupationalQuestion':
        return labelByKey(findQuestionsByKey(initialApiData?.result, 't3_occupational_question')?.answerKey ?? '');
      case 'uploaded':
        const filesList = initialApiData?.result?.uploadedFiles?.map(file => file.filename);
        return filesList?.length ? filesList : undefined;
      case 'uploadedIdentity':
        const identityFilesList = initialApiData?.result?.identityFiles?.map(file => file.filename);
        return identityFilesList?.length ? identityFilesList : undefined;
      default:
        return fieldValue(parseFormValuesFromGenericData('person_data', personType), fieldName as keyof PersonFormType);
    }
  }

  function parseUserValue(_: string, fieldName: TransferSummaryDetailsValuePath) {
    switch (fieldName) {
      case 'address':
        return userAddress(initialApiData.result);
      case 'name':
        const user = initialApiData.result?.personalDetails;
        return [toTitleCase(user?.title ?? ''), user?.name].filter(Boolean).join('\n');
      case 'phone':
        return parsePhone(initialApiData.result?.userPhone?.code, initialApiData.result?.userPhone?.number);
      case 'dateOfBirth':
        return parseDate(initialApiData.result?.personalDetails?.dateOfBirth);
      case 'country':
        return initialApiData?.result?.userAddress?.country ?? NA_SYMBOL;
      case 'postCode':
        return initialApiData?.result?.userAddress?.postCode ?? NA_SYMBOL;
      case 'email':
        return initialApiData?.result?.userEmail?.email ?? NA_SYMBOL;
      default:
        return;
    }
  }

  function parseFlexibleBenefitsValue(_: string, fieldName: TransferSummaryDetailsValuePath) {
    switch (fieldName) {
      case 'benefitsTaken':
        return labelByKey(findQuestionsByKey(initialApiData?.result, `t3_flexible_benefits_q`)?.answerKey ?? '');
      case 'shouldHideRest':
        return findQuestionsByKey(initialApiData?.result, `t3_flexible_benefits_q`)?.answerKey.toLowerCase() === 'no';
      case 'nameOfPlan':
        return initialApiData?.result?.transferData.flexibleBenefits?.nameOfPlan ?? NA_SYMBOL;
      case 'typeOfPayment':
        return initialApiData?.result?.transferData.flexibleBenefits?.typeOfPayment ?? NA_SYMBOL;
      case 'dateOfPayment':
        return parseDate(initialApiData?.result?.transferData.flexibleBenefits?.dateOfPayment);
      default:
        return;
    }
  }

  function parsePensionWiseLabel(labelKey: string) {
    const answer = findQuestionsByKey(initialApiData?.result, `t3_pw_question`)?.answerKey;
    return [labelKey, answer].filter(Boolean).join('_');
  }

  function parsePensionWiseValue(_: string, fieldName: TransferSummaryDetailsValuePath) {
    switch (fieldName) {
      case 'question':
        return labelByKey(findQuestionsByKey(initialApiData?.result, `t3_pw_question`)?.answerKey ?? '');
      case 'shouldHideRest':
        return findQuestionsByKey(initialApiData?.result, `t3_pw_question`)?.answerKey.toLowerCase() === 'none';
      case 'pensionWiseDate':
        return findQuestionsByKey(initialApiData?.result, `t3_pw_question`)?.answerKey.toLowerCase() === 'no_fca'
          ? parseDate(initialApiData?.result?.transferData.financialAdviseDate)
          : parseDate(initialApiData?.result?.transferData.pensionWiseDate);
      default:
        return;
    }
  }

  function parseConsent(personType: string) {
    return isYes(findQuestionsByKey(initialApiData?.result, `${personType}_consent_question`)?.answerKey ?? '');
  }

  function parseFormValuesFromGenericData<T>(formKey: string, personType: string) {
    const form = initialApiData?.result?.transferData?.journeyGenericDataList.find(
      d => d.formKey === [formKey, personType].join('_'),
    );
    return form?.genericDataJson ? (JSON.parse(form.genericDataJson) as T) : null;
  }

  return {
    parseConsent,
    parseValue,
    parseUserValue,
    parsePensionWiseLabel,
    parsePensionWiseValue,
    parseFlexibleBenefitsValue,
    loading: initialApiData.loading,
  };
};

function address(data?: PersonAddressFormType | null) {
  const addressValues = data?.address;

  const address = [
    addressValues?.line1,
    addressValues?.line2,
    addressValues?.line3,
    addressValues?.line4,
    addressValues?.line5,
  ].filter(Boolean);

  return address?.length === 0 ? NA_SYMBOL : (address as string[]);
}

function country(data: PersonAddressFormType | null) {
  return data ? countryByCode(data.address.countryCode) : NA_SYMBOL;
}

function postCode(data: PersonAddressFormType | null) {
  return data?.address?.postCode ?? NA_SYMBOL;
}

function userAddress(data: TransferData | undefined) {
  const addressValues = data?.userAddress;

  const address = [
    addressValues?.streetAddress1,
    addressValues?.streetAddress2,
    addressValues?.streetAddress3,
    addressValues?.streetAddress4,
    addressValues?.streetAddress5,
  ].filter(Boolean);

  return address?.length === 0 ? NA_SYMBOL : (address as string[]);
}

function phone(data?: PersonFormType | null) {
  const { phoneCode, phoneNumber } = data ?? {};
  return parsePhone(phoneCode, phoneNumber);
}

function date(data: PersonFormType | null, fieldName: keyof PersonFormType) {
  const dateString = data?.[fieldName];
  return dateString ? formatDate(dateString) : NA_SYMBOL;
}

function parsePhone(phoneCode?: string | null, phoneNumber?: string | null) {
  return phoneCode && phoneNumber ? `+${phoneCode} ${phoneNumber}` : undefined;
}

function parseDate(date?: string | null) {
  return date ? formatDate(date) : NA_SYMBOL;
}

function fieldValue(data: PersonFormType | null, fieldName: keyof PersonFormType): string | string[] {
  return (data?.[fieldName] as string | string[]) ?? NA_SYMBOL;
}

function findQuestionsByKey(data: TransferData | undefined, questionKey: string) {
  return data?.transferData?.questionForms.find(q => q.questionKey === questionKey);
}
