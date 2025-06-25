import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { ListLoader } from '../..';
import { apiErrorCodes } from '../../../api/constants';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { PhoneTokenParams, SubmitPhoneParams } from '../../../api/mdp/types';
import { DEFAULT_PHONE_COUNTRY_CODE } from '../../../business/constants';
import { countryByCode } from '../../../business/country';
import { findValueByKey } from '../../../business/find-in-array';
import { countryFromPhoneCode, isPhoneCodeValid, phoneCodeFromCountry } from '../../../business/phone';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { useScroll } from '../../../core/hooks/useScroll';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { trackButtonClick } from '../../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../../core/mixpanel-tracker';
import { useRouter } from '../../../core/router';
import { MessageType } from '../../topAlertMessages';
import { PhoneForm } from './PhoneForm';
import { PhoneInformation } from './PhoneInformation';
import { PhoneValidation } from './PhoneValidation';
import { PhoneFormType } from './validation';
import { useSubmitWithVerification } from '../../../core/hooks/useSubmitWithVerification';

interface Props {
  id?: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  isStandAlone?: boolean;
  journeyType?: JourneyTypeSelection;
}

export const PhoneFormBlock: React.FC<Props> = ({ id, pageKey, parameters, journeyType, isStandAlone }) => {
  const scroll = useScroll();
  const router = useRouter();
  const accessKey = useCachedAccessKey();
  const { updateCmsToken } = useContentDataContext();
  const { labelByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { setJourneyInnerStep, setJourneyInnerStepsCount, setCustomHeader } = useJourneyIndicatorContext();
  const isCloseButtonHidden = !!findValueByKey('hide_save_and_close', parameters);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const closeNextPageKey = findValueByKey('close_next_page', parameters) ?? '';
  const saveAndExitButtonKey = findValueByKey('save_and_exit_button', parameters);
  const submitJourneyStepCb = useSubmitJourneyStep(journeyType);
  const submitPhoneCb = useSubmitWithVerification<SubmitPhoneParams>(
    (api, args, nonce) => api.mdp.submitPhone(args, nonce),
    () => updateCmsToken('phoneNumber', `${phoneDialCode.replace('+', '')} ${phone}`)
  );
  const userPhone = useApi(api => api.mdp.userPhone());
  const [confirmPage, setConfirmPage] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [token, setToken] = useState('');
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [expiredToken, setExpiredToken] = useState<boolean>(false);
  const [isCodeResent, setIsCodeResent] = useState<boolean>(false);
  const [phone, setPhone] = useState('');
  const [isPhoneUpdated, setIsPhoneUpdated] = useState(false);
  const [countryCode, setCountryCode] = useState(DEFAULT_PHONE_COUNTRY_CODE);
  const [defaultCountryCode, setDefaultCountryCode] = useState(DEFAULT_PHONE_COUNTRY_CODE);
  const [navigatedBack, setNavigatedBack] = useState(false);
  const defaultPhone = isPhoneCodeValid(userPhone.result?.data?.code) ? userPhone.result?.data?.number ?? '' : '';
  const phoneDialCode = phoneCodeFromCountry(countryCode);
  const defaultPhoneDialCode = phoneCodeFromCountry(defaultCountryCode);
  const phoneTokenCb = useApiCallback(async (api, args: PhoneTokenParams) => {
    const result = await api.mdp.phoneToken(args);
    if (result?.data.tokenExpirationDate) {
      showNotifications([
        {
          type: MessageType.PrimaryTenant,
          timer: true,
          children: (
            <Countdown
              zeroPadTime={2}
              onComplete={() => {
                setExpiredToken(true);
                showNotifications([
                  { type: MessageType.Problem, message: labelByKey('phone_confirmation_form_countdown_end') },
                ]);
              }}
              onTick={({ total }) => setTotalTimeLeft(total)}
              date={new Date(result.data.tokenExpirationDate)}
              renderer={({ formatted: { minutes, seconds } }) =>
                [
                  labelByKey('phone_confirmation_form_countdown_prefix'),
                  `${minutes}:${seconds}`,
                  labelByKey('phone_confirmation_form_countdown_suffix'),
                ].join(' ')
              }
            />
          ),
        },
      ]);
    }
    return result;
  });

  useEffect(() => {
    setJourneyInnerStep(confirmPage ? 1 : 0);
    setJourneyInnerStepsCount(2);
    if (!confirmPage) {
      setCustomHeader({ title: null, action: null, icon: null });
    }
  }, [setJourneyInnerStep, setJourneyInnerStepsCount, setCustomHeader, confirmPage]);

  useEffect(() => {
    scroll.scrollTop();
  }, [confirmPage, scroll]);

  useEffect(() => {
    const errors = [submitJourneyStepCb.error, submitPhoneCb.error].filter(Boolean).flat();

    if (errors) {
      showNotifications(
        (errors as unknown as string[]).map(error => ({ type: MessageType.Problem, message: errorByKey(error) })),
      );
    }

    if (!errors) hideNotifications();
  }, [submitJourneyStepCb.error, submitPhoneCb.error]);

  useEffect(() => {
    const submitErrors = submitPhoneCb.error as string[] | undefined;
    const tokenHasExpired = !!submitErrors?.includes(apiErrorCodes.OTP_TOKEN_EXPIRED);
    const tokenIsInvalid = !!submitErrors?.includes(apiErrorCodes.OTP_TOKEN_INVALID);

    if (tokenHasExpired) {
      showNotifications([
        { type: MessageType.Problem, message: labelByKey('phone_confirmation_form_max_tries_exceeded') },
      ]);

      setExpiredToken(true);
    }

    if (tokenIsInvalid) {
      showNotifications([
        {
          type: MessageType.Problem,
          timer: true,
          children: (
            <Countdown
              zeroPadTime={2}
              onComplete={() => {
                showNotifications([
                  { type: MessageType.Problem, message: labelByKey('phone_confirmation_form_countdown_end') },
                ]);
                setExpiredToken(true);
              }}
              onTick={({ total }) => setTotalTimeLeft(total)}
              date={Date.now() + totalTimeLeft}
              renderer={({ formatted: { minutes, seconds } }) =>
                [
                  labelByKey('phone_confirmation_form_error_prefix'),
                  `${minutes}:${seconds}`,
                  labelByKey('phone_confirmation_form_error_suffix'),
                ].join(' ')
              }
            />
          ),
        },
      ]);
    }

    if (!tokenHasExpired && !tokenIsInvalid) hideNotifications();
  }, [submitPhoneCb.error]);

  useEffect(() => {
    if (userPhone.result?.data?.code && isPhoneCodeValid(userPhone.result.data.code)) {
      setCountryCode(countryFromPhoneCode(`+${userPhone.result.data.code}`));
      setDefaultCountryCode(countryFromPhoneCode(`+${userPhone.result.data.code}`));
    }
  }, [userPhone.result?.data?.code]);

  if (userPhone.loading) {
    return <ListLoader id={id} loadersCount={4} />;
  }

  if (isPhoneUpdated) {
    return (
      <PhoneInformation
        id={id}
        phone={phone}
        submitLoading={submitJourneyStepCb.loading || router.loading || router.parsing}
        onContinue={onContinue}
        onBackClick={onEmailInformationBackClick}
        phoneCode={phoneDialCode}
      />
    );
  }

  if (confirmPage) {
    return (
      <PhoneValidation
        id={id}
        onContinue={onTokenSubmit}
        onBackClick={onBackClick}
        onTokenChange={handleTokenChange}
        enabled={enabled}
        phoneCode={phoneDialCode}
        onTokenCompleted={token => {
          setToken(token);
          setEnabled(true);
        }}
        defaultPhone={defaultPhone}
        defaultPhoneCode={defaultPhoneDialCode}
        onDefaultPhoneClick={onDefaultPhoneClick}
        isCloseButtonHidden={isCloseButtonHidden}
        submitLoading={submitPhoneCb.loading || router.loading || router.parsing}
        phone={phone}
        expiredToken={expiredToken}
        onExpiredTokenClick={handleExpiredTokenClick}
        isCodeResent={isCodeResent}
      />
    );
  }

  return (
    <PhoneForm
      id={id}
      isStandAlone={isStandAlone}
      initialData={{ phone: phone ? phone : defaultPhone }}
      onSubmit={onSubmit}
      submitLoading={phoneTokenCb.loading || router.loading || router.parsing}
      isCloseButtonHidden={isCloseButtonHidden}
      countryCode={countryCode}
      onCountryCodeChanged={setCountryCode}
      isDirty={navigatedBack || countryCode !== defaultCountryCode}
      isLoading={userPhone.loading}
      onClosed={handleClose}
      saveAndExitButtonKey={saveAndExitButtonKey}
      submitError={phoneTokenCb.error}
    />
  );

  async function handleExpiredTokenClick() {
    await phoneTokenCb.execute({
      number: phone,
      code: phoneCodeFromCountry(countryCode).replace('+', ''),
      contentAccessKey: accessKey.data!.contentAccessKey,
      countryCode: countryCode,
    });
    setExpiredToken(false);
    setIsCodeResent(true);
  }

  async function onSubmit(values: PhoneFormType, isDirty: boolean) {
    if (!isDirty) {
      onContinue();
      return;
    }
    setPhone(values.phone);
    await phoneTokenCb.execute({
      number: values.phone,
      code: phoneCodeFromCountry(countryCode).replace('+', ''),
      contentAccessKey: accessKey.data!.contentAccessKey,
      countryCode: countryCode,
    });
    setConfirmPage(true);
    setNavigatedBack(false);
  }

  function onBackClick() {
    hideNotifications();
    setEnabled(false);
    setConfirmPage(false);
    setExpiredToken(false);
    setNavigatedBack(true);
  }

  function onEmailInformationBackClick() {
    hideNotifications();
    router.push(router.asPath);
  }

  function onDefaultPhoneClick() {
    hideNotifications();
    setEnabled(false);
    setConfirmPage(false);
    setPhone(defaultPhone);
    setCountryCode(defaultCountryCode);
  }

  function handleTokenChange(value: string) {
    if (value.length !== 6 && enabled) {
      setEnabled(false);
    }
  }

  async function onContinue() {
    if (!nextPageKey) {
      return;
    }

    if (journeyType) {
      await submitJourneyStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    }

    await journeyNavigation.goNext();
  }

  async function onTokenSubmit() {
    await submitPhoneCb.execute({
      mobilePhoneConfirmationToken: token,
      mobilePhoneCountry: countryByCode(countryCode),
    });
    hideNotifications();
    mixpanelTrackButtonClick({
      Category: 'phone updated',
    });
    trackButtonClick('phone updated');

    if (isStandAlone) {
      await router.parseUrlAndPush({ key: nextPageKey, query: { message: 'phone_updated' } });
      return;
    }

    setIsPhoneUpdated(true);
  }

  async function handleClose() {
    await router.parseUrlAndPush(closeNextPageKey);
  }
};
