import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { ListLoader } from '../../';
import { apiErrorCodes } from '../../../api/constants';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { EmailTokenParams, SubmitEmailParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useScroll } from '../../../core/hooks/useScroll';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { trackButtonClick } from '../../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../../core/mixpanel-tracker';
import { useRouter } from '../../../core/router';
import { MessageType } from '../../topAlertMessages';
import { EmailForm } from './EmailForm';
import { EmailInformation } from './EmailInformation';
import { EmailValidation } from './EmailValidation';
import { EmailsFormType } from './validation';
import { useSubmitWithVerification } from '../../../core/hooks/useSubmitWithVerification';


interface Props {
  id?: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  isStandAlone?: boolean;
  journeyType?: JourneyTypeSelection;
}

export const EmailFormBlock: React.FC<Props> = ({ id, pageKey, parameters, journeyType, isStandAlone }) => {
  const scroll = useScroll();
  const router = useRouter();
  const accessKey = useCachedAccessKey();
  const { updateCmsToken } = useContentDataContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { labelByKey, errorByKey } = useGlobalsContext();
  const { setJourneyInnerStep, setJourneyInnerStepsCount, setCustomHeader } = useJourneyIndicatorContext();
  const isCloseButtonHidden = !!findValueByKey('hide_save_and_close', parameters);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const closeNextPageKey = findValueByKey('close_next_page', parameters) ?? '';
  const saveAndExitButtonKey = findValueByKey('save_and_exit_button', parameters);
  const userEmail = useApi(api => api.mdp.userEmail());
  const submitJourneyStepCb = useSubmitJourneyStep(journeyType);
  const generateTokenCb = useApiCallback(async (api, args: EmailTokenParams) => {
    const result = await api.mdp.emailToken(args);
    if (result.data.tokenExpirationDate) {
      showNotifications([
        {
          type: MessageType.PrimaryTenant,
          timer: true,
          children: (
            <Countdown
              zeroPadTime={2}
              onComplete={handleCountdownComplete}
              onTick={({ total }) => setTotalTimeLeft(total)}
              date={new Date(result.data.tokenExpirationDate)}
              renderer={({ formatted: { minutes, seconds } }) =>
                [
                  labelByKey('email_confirmation_form_countdown_prefix'),
                  `${minutes}:${seconds}`,
                  labelByKey('email_confirmation_form_countdown_suffix'),
                ].join(' ')
              }
            />
          ),
        },
      ]);
    }
    return result;
  });

  const [confirmPage, setConfirmPage] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [expiredToken, setExpiredToken] = useState<boolean>(false);
  const [isCodeResent, setIsCodeResent] = useState<boolean>(false);

  const submitEmailCb = useSubmitWithVerification<SubmitEmailParams>(
    (api, args, nonce) => api.mdp.submitEmail(args, nonce),
    () => updateCmsToken('email', email)
  );

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
    const errors = [submitJourneyStepCb.error, generateTokenCb.error, submitEmailCb.error].filter(Boolean).flat();

    if (errors) {
      showNotifications(
        (errors as unknown as string[]).map(error => ({ type: MessageType.Problem, message: errorByKey(error) })),
      );
    }

    if (!errors) hideNotifications();
  }, [submitJourneyStepCb.error, submitEmailCb.error, generateTokenCb.error]);

  useEffect(() => {
    const submitErrors = submitEmailCb.error as string[] | undefined;
    const tokenHasExpired = !!submitErrors?.includes(apiErrorCodes.OTP_TOKEN_EXPIRED);
    const tokenIsInvalid = !!submitErrors?.includes(apiErrorCodes.OTP_TOKEN_INVALID);

    if (tokenHasExpired) {
      showNotifications([
        { type: MessageType.Problem, message: labelByKey('email_confirmation_form_max_tries_exceeded') },
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
              onComplete={handleCountdownComplete}
              onTick={({ total }) => setTotalTimeLeft(total)}
              date={Date.now() + totalTimeLeft}
              renderer={({ formatted: { minutes, seconds } }) =>
                [
                  labelByKey('email_confirmation_form_error_prefix'),
                  `${minutes}:${seconds}`,
                  labelByKey('email_confirmation_form_error_suffix'),
                ].join(' ')
              }
            />
          ),
        },
      ]);
    }

    if (!tokenHasExpired && !tokenIsInvalid) hideNotifications();
  }, [submitEmailCb.error]);

  if (userEmail.loading || generateTokenCb.loading) {
    return <ListLoader id={id} loadersCount={4} />;
  }

  if (isEmailUpdated) {
    return (
      <EmailInformation
        id={id}
        email={email}
        submitLoading={submitEmailCb.loading || submitJourneyStepCb.loading || router.loading}
        onContinue={onContinue}
        onBackClick={onEmailInformationBackClick}
      />
    );
  }

  if (confirmPage) {
    return (
      <EmailValidation
        id={id}
        onContinue={onTokenSubmit}
        onBackClick={onBackClick}
        onTokenChange={handleTokenChange}
        enabled={enabled}
        onTokenCompleted={handleTokenEnable}
        defaultEmail={userEmail.result?.data?.email}
        onDefaultEmailClick={onDefaultEmailClick}
        isCloseButtonHidden={isCloseButtonHidden}
        submitLoading={submitEmailCb.loading || submitJourneyStepCb.loading || router.loading}
        email={email}
        expiredToken={expiredToken}
        onExpiredTokenClick={handleTokenExpiredClick}
        isCodeResent={isCodeResent}
      />
    );
  }

  return (
    <EmailForm
      id={id}
      isStandAlone={isStandAlone}
      initialData={{ email: userEmail.result?.data?.email ?? '' }}
      submitLoading={submitEmailCb.loading || submitJourneyStepCb.loading || router.loading}
      pageKey={pageKey}
      isCloseButtonHidden={isCloseButtonHidden}
      isLoading={userEmail.loading}
      onClosed={handleClose}
      onSubmit={onSubmit}
      errorTooltipDisabled
      saveAndExitButtonKey={saveAndExitButtonKey}
    />
  );

  async function onSubmit(values: EmailsFormType, isDirty: boolean) {
    if (!isDirty) {
      onContinue();
      return;
    }
    setEmail(values.email);
    await generateTokenCb.execute({ emailAddress: values.email, contentAccessKey: accessKey.data!.contentAccessKey });
    setConfirmPage(true);
  }

  function onBackClick() {
    hideNotifications();
    setEnabled(false);
    setConfirmPage(false);
    setExpiredToken(false);
  }

  function onEmailInformationBackClick() {
    hideNotifications();
    router.push(router.asPath);
  }

  function onDefaultEmailClick() {
    hideNotifications();
    setEnabled(false);
    setConfirmPage(false);
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

    journeyType && (await submitJourneyStepCb.execute({ currentPageKey: pageKey, nextPageKey }));

    router.parseUrlAndPush(nextPageKey);
  }

  async function onTokenSubmit() {
    await submitEmailCb.execute({ emailConfirmationToken: token });
    hideNotifications();
    mixpanelTrackButtonClick({
      Category: 'email updated',
    });
    trackButtonClick('email updated');

    if (isStandAlone && nextPageKey) {
      await router.parseUrlAndPush({ key: nextPageKey, query: { message: 'email_updated' } });
      return;
    }

    setIsEmailUpdated(true);
  }

  async function handleClose() {
    await router.parseUrlAndPush(closeNextPageKey);
  }

  async function handleTokenExpiredClick() {
    await generateTokenCb.execute({ emailAddress: email, contentAccessKey: accessKey.data!.contentAccessKey });
    setEnabled(false);
    setExpiredToken(false);
    setIsCodeResent(true);
  }

  function handleTokenEnable(token: string) {
    setToken(token);
    setEnabled(true);
  }

  function handleCountdownComplete() {
    setExpiredToken(true);
    showNotifications([{ type: MessageType.Problem, message: labelByKey('email_confirmation_form_countdown_end') }]);
  }
};
