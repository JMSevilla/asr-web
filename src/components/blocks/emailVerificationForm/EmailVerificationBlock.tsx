import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { ListLoader } from '../..';
import { apiErrorCodes } from '../../../api/constants';
import { PanelListItem } from '../../../api/content/types/page';
import { SubmitEmailParams, SubmitStepParams, VerificationEmailTokenParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useTenantContext } from '../../../core/contexts/TenantContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useScroll } from '../../../core/hooks/useScroll';
import { useRouter } from '../../../core/router';
import { MessageType } from '../../topAlertMessages';
import { EmailValidationHeaderIcon } from './EmailValidationHeaderIcon';
import { EmailVerificationForm } from './EmailVerificationForm';
import { EmailVerificationValidation } from './EmailVerificationValidation';
import { EmailsFormType } from './validation';

interface Props {
  id?: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  isJourney: boolean;
  isStandAlone?: boolean;
  panelList?: PanelListItem[];
}

export const EmailVerificationBlock: React.FC<Props> = ({ id, pageKey, parameters, isJourney, panelList }) => {
  const scroll = useScroll();
  const router = useRouter();
  const { bereavement } = usePersistentAppState();
  const { tenant } = useTenantContext();
  const { updateCmsToken } = useContentDataContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { labelByKey, errorByKey } = useGlobalsContext();
  const { setJourneyInnerStep, setJourneyInnerStepsCount, setCustomHeader } = useJourneyIndicatorContext();
  const isCloseButtonHidden = !!findValueByKey('hide_save_and_close', parameters);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const submitStepCb = useApiCallback((api, params: SubmitStepParams) => api.mdp.bereavementJourneySubmitStep(params));
  const exchangeBereavementToken = useApiCallback(api => api.authentication.bereavementVerificationExchangeToken());
  const generateTokenCb = useApiCallback(async (api, params: VerificationEmailTokenParams) => {
    const result = await api.mdp.bereavementJourneyEmailToken(params);
    updateCmsToken('email', params.emailAddress);
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
                  labelByKey('email_verification_form_countdown_prefix'),
                  `${minutes}:${seconds}`,
                  labelByKey('email_verification_form_countdown_suffix'),
                ].join(' ')
              }
            />
          ),
        },
      ]);
    }
    return result;
  });

  const submitEmailCb = useApiCallback(async (api, args: SubmitEmailParams) => {
    const result = await api.mdp.bereavementJourneySubmitEmail(args);
    await exchangeBereavementToken.execute();
    updateCmsToken('email', email);
    bereavement.form.saveForm({ personType: 'reporter', values: { email } });
    return result;
  });
  const [confirmPage, setConfirmPage] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [expiredToken, setExpiredToken] = useState<boolean>(false);
  const [isCodeResent, setIsCodeResent] = useState<boolean>(false);
  const contentAccessKey = JSON.stringify({ tenantUrl: tenant?.tenantUrl.value });

  useEffect(() => {
    setJourneyInnerStep(confirmPage ? 1 : 0);
    setJourneyInnerStepsCount(2);
    if (!confirmPage) {
      setCustomHeader({
        title: labelByKey('email_verification_form_header'),
        action: null,
        icon: EmailValidationHeaderIcon,
      });
    }
  }, [setJourneyInnerStep, setJourneyInnerStepsCount, setCustomHeader, confirmPage]);

  useEffect(() => {
    scroll.scrollTop();
  }, [confirmPage, scroll]);

  useEffect(() => {
    const errors = [submitStepCb.error, generateTokenCb.error, submitEmailCb.error].filter(Boolean).flat();

    if (errors) {
      showNotifications(
        (errors as unknown as string[]).map(error => ({ type: MessageType.Problem, message: errorByKey(error) })),
      );
    }

    if (!errors) hideNotifications();
  }, [submitStepCb.error, submitEmailCb.error, generateTokenCb.error]);

  useEffect(() => {
    const submitErrors = submitEmailCb.error as string[] | undefined;
    const tokenHasExpired = !!submitErrors?.includes(apiErrorCodes.OTP_TOKEN_EXPIRED);
    const tokenIsInvalid = !!submitErrors?.includes(apiErrorCodes.OTP_TOKEN_INVALID);

    if (tokenHasExpired) {
      showNotifications([
        { type: MessageType.Problem, message: labelByKey('email_verification_form_max_tries_exceeded') },
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
                  labelByKey('email_verification_form_error_prefix'),
                  `${minutes}:${seconds}`,
                  labelByKey('email_verification_form_error_suffix'),
                ].join(' ')
              }
            />
          ),
        },
      ]);
    }

    if (!tokenHasExpired && !tokenIsInvalid) hideNotifications();
  }, [submitEmailCb.error]);

  if (generateTokenCb.loading) {
    return <ListLoader id={id} loadersCount={3} />;
  }

  if (confirmPage) {
    return (
      <EmailVerificationValidation
        id={id}
        onContinue={onTokenSubmit}
        onBackClick={onBackClick}
        onTokenChange={handleTokenChange}
        enabled={enabled}
        onTokenCompleted={handleTokenEnable}
        defaultEmail=""
        onDefaultEmailClick={onDefaultEmailClick}
        isCloseButtonHidden={isCloseButtonHidden}
        submitLoading={submitEmailCb.loading || submitStepCb.loading || router.loading || router.parsing}
        email={email}
        expiredToken={expiredToken}
        onExpiredTokenClick={handleTokenExpiredClick}
        isCodeResent={isCodeResent}
        panelList={panelList}
      />
    );
  }

  return (
    <EmailVerificationForm
      id={id}
      initialData={{
        email: bereavement.form.values.reporter?.email || bereavement.form.values.reporter?.unverifiedEmail || '',
      }}
      submitLoading={submitEmailCb.loading || submitStepCb.loading || router.loading || router.parsing}
      pageKey={pageKey}
      onSubmit={onSubmit}
      errorTooltipDisabled
      panelList={panelList}
      isDisabled={!!bereavement.form.values.reporter?.email}
    />
  );

  async function onSubmit(values: EmailsFormType) {
    if (bereavement.form.values.reporter?.email) {
      return onContinue();
    }
    setEmail(values.email);
    bereavement.form.saveForm({ personType: 'reporter', values: { unverifiedEmail: values.email } });
    await generateTokenCb.execute({ emailAddress: values.email, contentAccessKey });
    setConfirmPage(true);
  }

  function onBackClick() {
    hideNotifications();
    setEnabled(false);
    setConfirmPage(false);
    setExpiredToken(false);
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

  async function onTokenSubmit() {
    await submitEmailCb.execute({ emailConfirmationToken: token });
    hideNotifications();
    await onContinue('email_updated');
  }

  async function handleTokenExpiredClick() {
    await generateTokenCb.execute({ emailAddress: email, contentAccessKey });
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
    showNotifications([{ type: MessageType.Problem, message: labelByKey('email_verification_form_countdown_end') }]);
  }

  async function onContinue(message?: string) {
    if (nextPageKey) {
      isJourney && (await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey }));
      await router.parseUrlAndPush(message ? { key: nextPageKey, query: { message } } : nextPageKey);
    }
  }
};
