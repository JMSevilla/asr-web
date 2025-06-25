import { useEffect, useState } from 'react';
import { ListLoader } from '../..';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { UserBankDetails } from '../../../api/mdp/types';
import { DEFAULT_BANK_ACCOUNT_CURRENCY, DEFAULT_PHONE_COUNTRY_CODE } from '../../../business/constants';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedApi } from '../../../core/hooks/useCachedApi';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { useScroll } from '../../../core/hooks/useScroll';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { useRouter } from '../../../core/router';
import { MessageType } from '../../topAlertMessages';
import { BankDetailsForm } from './BankDetailsForm';
import { BankDetailsList } from './BankDetailsList';
import { BankDetailsFormType } from './validation';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
  journeyType: JourneyTypeSelection;
  pageKey: string;
}

export const BankDetailsBlock: React.FC<Props> = ({ id, parameters, journeyType, pageKey }) => {
  const { errorByKey } = useGlobalsContext();
  const { scrollTop } = useScroll();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [details, setDetails] = useState<BankDetailsFormType | null>(null);
  const router = useRouter();
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const isCloseButtonHidden = !!findValueByKey('hide_save_and_close', parameters);
  const saveAndExitButtonKey = findValueByKey('save_and_exit_button', parameters);
  const bankDetails = useApi(async api => {
    try {
      const result = await api.mdp.userBankDetails();
      return { ...result, data: mapUserBankDetails(result?.data) };
    } catch {
      return { data: mapUserBankDetails() };
    }
  });
  const submitUkBankDetailsCb = useApiCallback((api, details: UserBankDetails) => api.mdp.submitUKBankDetails(details));
  const submitNonUkBankDetailsCb = useApiCallback((api, details: UserBankDetails) =>
    api.mdp.submitNonUKBankDetails(details),
  );
  const validateUkBankDetailsCb = useApiCallback((api, details: UserBankDetails) =>
    api.mdp.validateUKBankDetails(details),
  );
  const validateNonUkBankDetailsCb = useApiCallback((api, details: UserBankDetails) =>
    api.mdp.validateNonUKBankDetails(details),
  );
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { setJourneyInnerStep, setJourneyInnerStepsCount, setCustomHeader } = useJourneyIndicatorContext();

  useCachedApi(async api => {
    try {
      const response = await api.mdp.countryList();
      return response.data;
    } catch {
      await router.parseUrlAndPush('error_page_idv');
    }
  }, 'countries-currencies');

  useEffect(() => {
    setJourneyInnerStep(isSubmitted ? 1 : 0);
    setJourneyInnerStepsCount(2);
    if (!isSubmitted) {
      setCustomHeader({ title: null, action: null, icon: null });
    }
  }, [isSubmitted, setCustomHeader, setJourneyInnerStep, setJourneyInnerStepsCount]);

  useEffect(() => {
    const errors =
      (validateUkBankDetailsCb.error as string[] | undefined) ||
      (validateNonUkBankDetailsCb.error as string[] | undefined);

    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          title: errorByKey('bank_details_form_error'),
          message: errorByKey(error),
        })),
      );
    }
  }, [validateUkBankDetailsCb.error, validateNonUkBankDetailsCb.error, showNotifications, errorByKey]);

  useEffect(() => {
    hideNotifications();
  }, [isSubmitted, hideNotifications]);

  const isUk = details?.bankCountryCode === DEFAULT_PHONE_COUNTRY_CODE;

  if (bankDetails.loading) {
    return <ListLoader id={id} loadersCount={4} />;
  }

  if (isSubmitted) {
    return (
      <BankDetailsList
        id={id}
        details={details!}
        bankDetails={isUk ? validateUkBankDetailsCb?.result?.data : validateNonUkBankDetailsCb?.result?.data}
        submitLoading={
          submitUkBankDetailsCb.loading ||
          submitNonUkBankDetailsCb.loading ||
          submitStepCb.loading ||
          router.loading ||
          router.parsing
        }
        onContinue={onContinue}
        onBackClick={() => setIsSubmitted(false)}
      />
    );
  }

  return (
    <BankDetailsForm
      id={id}
      initialData={bankDetails.result!.data}
      currentData={details!}
      isValidating={validateNonUkBankDetailsCb.loading || validateUkBankDetailsCb.loading}
      submitLoading={
        submitUkBankDetailsCb.loading ||
        submitNonUkBankDetailsCb.loading ||
        submitStepCb.loading ||
        router.loading ||
        router.parsing
      }
      onSubmit={onSubmit}
      pageKey={pageKey}
      isCloseButtonHidden={isCloseButtonHidden}
      isLoading={bankDetails.loading}
      saveAndExitButtonKey={saveAndExitButtonKey}
    />
  );

  async function onSubmit(formData: BankDetailsFormType, isDirty: boolean) {
    const validDetails = details == null || JSON.stringify(bankDetails.result!.data) === JSON.stringify(details);

    if (!isDirty && validDetails) {
      onContinue(isDirty);
      return;
    }

    setDetails(formData);
    const isUk = formData?.bankCountryCode === DEFAULT_PHONE_COUNTRY_CODE;
    isUk
      ? await validateUkBankDetailsCb.execute({
          ...formData,
          accountNumber: formData.accountNumber!,
          accountName: formData.accountName,
          sortCode: formData.sortCode!,
        })
      : await validateNonUkBankDetailsCb.execute({
          ...formData,
          bankCountryCode: formData.bankCountryCode,
          iban: formData.iban!,
          bic: formData.bic!,
          clearingCode: formData.clearingCode!,
          accountCurrency: formData.accountCurrency,
        });

    setIsSubmitted(true);
    scrollTop();
  }

  async function onContinue(isDirty?: boolean) {
    if (isDirty) {
      isUk
        ? await submitUkBankDetailsCb.execute(details as UserBankDetails)
        : await submitNonUkBankDetailsCb.execute(details as UserBankDetails);
    }

    if (!nextPageKey) {
      return;
    }

    if (journeyType) {
      await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    }

    await journeyNavigation.goNext();
  }
};

function mapUserBankDetails(details?: UserBankDetails | BankDetailsFormType): BankDetailsFormType {
  return {
    bankCountryCode: details?.bankCountryCode ?? DEFAULT_PHONE_COUNTRY_CODE,
    accountCurrency: details?.accountCurrency ?? DEFAULT_BANK_ACCOUNT_CURRENCY,
    accountName: details?.accountName ?? '',
    accountNumber: details?.accountNumber ?? '',
    sortCode: details?.sortCode ?? '',
    iban: details?.iban ?? '',
    bic: details?.bic ?? '',
    clearingCode: details?.clearingCode ?? '',
  };
}
