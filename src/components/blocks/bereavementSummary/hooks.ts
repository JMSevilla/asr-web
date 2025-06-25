import { useEffect } from 'react';
import { SelectOption } from '../..';
import { UploadedFile } from '../../../api/mdp/types';
import { classifierLabelByValue } from '../../../business/classifier';
import { NA_SYMBOL } from '../../../business/constants';
import { formatDate } from '../../../business/dates';
import { findValueByKey } from '../../../business/find-in-array';
import { isAnswerNo, isAnswerYes } from '../../../business/questions';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import {
  BereavementFormValues,
  BereavementPersonFormValues,
} from '../../../core/contexts/persistentAppState/hooks/bereavement/form';
import { useApi } from '../../../core/hooks/useApi';
import { BereavementSummaryDetailsValuePath, BereavementSummaryFormValuePath } from './types';

export const useBereavementSummaryDetailsValues = (
  prefixedLabel: (key: string) => string,
  parameters: { key: string; value: string }[],
  relationshipOptions?: SelectOption[],
) => {
  const { bereavement } = usePersistentAppState();
  const initialApiData = useApi(async api => {
    if (!bereavement.expiration.date) return;

    const [maritalStatus, cohabitantsStatus, dependantsStatus, nextOfKinStatus, executorStatus, uploadedFiles] =
      await Promise.all([
        api.mdp.bereavementJourneyQuestionForm(findValueByKey('marital_status_page', parameters)!),
        api.mdp.bereavementJourneyQuestionForm(findValueByKey('cohabitants_status_page', parameters)!),
        api.mdp.bereavementJourneyQuestionForm(findValueByKey('dependants_status_page', parameters)!),
        api.mdp.bereavementJourneyQuestionForm(findValueByKey('next_of_kin_status_page', parameters)!),
        api.mdp.bereavementJourneyQuestionForm(findValueByKey('executor_status_page', parameters)!),
        api.mdp.bereavementDocuments(),
      ]);

    const shouldCheckNextOfKinAboutAnswer = isAnswerNo(nextOfKinStatus.data);
    const nextOfKinAboutStatus = shouldCheckNextOfKinAboutAnswer
      ? await api.mdp.bereavementJourneyQuestionForm(findValueByKey('next_of_kin_about_status_page', parameters)!)
      : undefined;
    const shouldCheckExecutorAboutAnswer = isAnswerNo(executorStatus.data);
    const executorAboutStatus = shouldCheckExecutorAboutAnswer
      ? await api.mdp.bereavementJourneyQuestionForm(findValueByKey('executor_about_status_page', parameters)!)
      : undefined;

    return {
      maritalStatus,
      cohabitantsStatus,
      dependantsStatus,
      nextOfKinStatus,
      nextOfKinAboutStatus,
      executorStatus,
      executorAboutStatus,
      uploadedFiles,
    };
  });

  const shouldDisplayNextOfKinQuestionDetails =
    isAnswerYes(initialApiData.result?.nextOfKinStatus.data) ||
    (isAnswerNo(initialApiData.result?.nextOfKinStatus.data) &&
      isAnswerNo(initialApiData.result?.nextOfKinAboutStatus?.data));
  const shouldDisplayExecutorQuestionDetails =
    isAnswerYes(initialApiData.result?.executorStatus.data) ||
    (isAnswerNo(initialApiData.result?.executorStatus.data) &&
      isAnswerNo(initialApiData.result?.executorAboutStatus?.data));
  const shouldDisplayContactPersonQuestionDetails =
    bereavement.form.values.contactSelection === 'YOU' ||
    bereavement.form.values.contactSelection === 'NEXT_OF_KIN' ||
    bereavement.form.values.contactSelection === 'EXECUTOR';
  const nextOfKinWasSelectedAsContactAndReset =
    bereavement.form.values.contactSelection === 'NEXT_OF_KIN' && !bereavement.form.values.nextOfKin;
  const executorWasSelectedAsContactAndReset =
    bereavement.form.values.contactSelection === 'EXECUTOR' && !bereavement.form.values.executor;

  useEffect(() => {
    if (shouldDisplayNextOfKinQuestionDetails) {
      bereavement.form.resetPersonType({ personType: 'nextOfKin' });
    }
    if (shouldDisplayExecutorQuestionDetails) {
      bereavement.form.resetPersonType({ personType: 'executor' });
    }
    if (shouldDisplayContactPersonQuestionDetails) {
      bereavement.form.resetPersonType({ personType: 'contactPerson' });
    }
    if (nextOfKinWasSelectedAsContactAndReset || executorWasSelectedAsContactAndReset) {
      bereavement.form.saveContactSelection({ contactSelection: 'YOU' });
    }
  }, [
    shouldDisplayNextOfKinQuestionDetails,
    shouldDisplayExecutorQuestionDetails,
    shouldDisplayContactPersonQuestionDetails,
    nextOfKinWasSelectedAsContactAndReset,
    executorWasSelectedAsContactAndReset,
  ]);

  function parseValue(personType: string, fieldName: BereavementSummaryDetailsValuePath) {
    switch (fieldName) {
      case 'address':
        return address(bereavement.form.values, personType);
      case 'identification.pensionReferenceNumbers':
        return referenceNumbers(bereavement.form.values, personType);
      case 'phoneNumber':
        return phone(bereavement.form.values, personType);
      case 'dateOfBirth':
      case 'dateOfDeath':
        return date(bereavement.form.values, personType, fieldName);
      case 'relationship':
        return relationship(bereavement.form.values, personType, relationshipOptions);
      case 'maritalStatus':
        return (personType === 'deceased' && initialApiData.result?.maritalStatus?.data.answerValue) || undefined;
      case 'cohabitantsStatus':
        return (personType === 'deceased' && initialApiData.result?.cohabitantsStatus?.data.answerValue) || undefined;
      case 'dependantsStatus':
        return (personType === 'deceased' && initialApiData.result?.dependantsStatus?.data.answerValue) || undefined;
      case 'question':
        if (personType === 'nextOfKin') {
          return initialApiData.result?.nextOfKinStatus.data.answerValue;
        }
        if (personType === 'executor') {
          return initialApiData.result?.executorStatus.data.answerValue;
        }
        if (personType === 'contactPerson') {
          return contactPersonQuestionValue(bereavement.form.values, prefixedLabel);
        }
        return NA_SYMBOL;
      case 'uploaded':
        return files(initialApiData?.result?.uploadedFiles?.data);
      default:
        return fieldPathToValue(bereavement.form.values, personType, fieldName as BereavementSummaryFormValuePath);
    }
  }

  return {
    parseValue,
    loading: initialApiData.loading,
    shouldDisplayNextOfKinQuestionDetails,
    shouldDisplayExecutorQuestionDetails,
    shouldDisplayContactPersonQuestionDetails,
  };
};

function files(files?: UploadedFile[]) {
  return !!files?.length ? files.map(file => file.filename) : NA_SYMBOL;
}

function address(formValues: BereavementFormValues, personType: string) {
  const addressValues = formValues?.[personType]?.address;

  return [
    addressValues?.line1,
    addressValues?.line2,
    addressValues?.line3,
    addressValues?.line4,
    addressValues?.line5,
    addressValues?.country,
    addressValues?.postCode,
  ]
    .filter(Boolean)
    .join(',\n')
    .split('\n');
}

function referenceNumbers(formValues: BereavementFormValues, personType: string) {
  const refNumbers = formValues?.[personType]?.identification?.pensionReferenceNumbers
    ?.filter(Boolean)
    .join(';\n')
    .split('\n');
  return refNumbers?.some(Boolean) ? refNumbers : undefined;
}

function phone(formValues: BereavementFormValues, personType: string) {
  const { phoneCode, phoneNumber } = formValues?.[personType] || {};
  return phoneCode && phoneNumber ? `+${phoneCode} ${phoneNumber}` : undefined;
}

function date(formValues: BereavementFormValues, personType: string, fieldName: keyof BereavementPersonFormValues) {
  const dateString = formValues?.[personType]?.[fieldName]?.toString();
  return dateString ? formatDate(dateString) : NA_SYMBOL;
}

function relationship(formValues: BereavementFormValues, personType: string, relationshipOptions?: SelectOption[]) {
  const relationshipValue = fieldPathToValue(formValues, personType, 'relationship');
  return relationshipOptions && relationshipValue && classifierLabelByValue(relationshipOptions, relationshipValue);
}

function fieldPathToValue(
  formValues: BereavementFormValues,
  personType: string,
  fieldName: BereavementSummaryFormValuePath,
) {
  const fieldKeys = fieldName.split('.');
  return fieldKeys.reduce((p, c) => (p as Record<string, object>)?.[c], formValues?.[personType]) as string | undefined;
}

function contactPersonQuestionValue(formValues: BereavementFormValues, prefixedLabel: (key: string) => string) {
  if (formValues.contactSelection === 'YOU') {
    const reporter = formValues['reporter'];
    return [prefixedLabel('contactPerson_you'), reporter && `(${reporter.name} ${reporter.surname})`]
      .filter(Boolean)
      .join(' ');
  }
  if (formValues.contactSelection === 'NEXT_OF_KIN') {
    const nextOfKin = formValues['nextOfKin'];
    return [prefixedLabel('contactPerson_nextOfKin'), nextOfKin && `(${nextOfKin.name} ${nextOfKin.surname})`]
      .filter(Boolean)
      .join(' ');
  }
  if (formValues.contactSelection === 'EXECUTOR') {
    const executor = formValues['executor'];
    return [prefixedLabel('contactPerson_executor'), executor && `(${executor.name} ${executor.surname})`]
      .filter(Boolean)
      .join(' ');
  }
}
