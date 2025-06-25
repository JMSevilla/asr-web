import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button, MessageType } from '..';
import { findValueByKey } from '../../business/find-in-array';
import { isServiceEnabled } from '../../business/service-toggle';
import { config } from '../../config';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../core/contexts/NotificationsContext';
import { useBereavementSession } from '../../core/contexts/bereavement/BereavementSessionContext';
import { usePersistentAppState } from '../../core/contexts/persistentAppState/PersistentAppStateContext';
import { BereavementFormStatus } from '../../core/contexts/persistentAppState/hooks/bereavement/form';
import { useApiCallback } from '../../core/hooks/useApi';
import { useRouter } from '../../core/router';

interface Props {
  id: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
}

export const BereavementStartFormBlock: React.FC<Props> = ({ id, pageKey, parameters }) => {
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const router = useRouter();
  const { buttonByKey, errorByKey } = useGlobalsContext();
  const { bereavement } = usePersistentAppState();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { bereavementLogin, bereavementContinue, bereavementRestart, loginError } = useBereavementSession();
  const verifyTokenCb = useApiCallback((api, token: string) => api.mdp.bereavementJourneyCaptchaVerify(token));
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const startButton = buttonByKey('bereavement_start_start');
  const continueButton = buttonByKey('bereavement_start_form_continue');
  const restartButton = buttonByKey('bereavement_start_form_new');
  const persistentFormStatusRef = useRef(bereavement.form.status);
  const RECAPTCHA_ENABLED = !!config.value.RECAPTCHA_KEY && isServiceEnabled('RECAPTCHA');

  useEffect(() => {
    if (!loginError) return;
    showNotifications([{ type: MessageType.Problem, message: errorByKey(String(loginError)) }]);
    return () => hideNotifications();
  }, [loginError]);

  if (persistentFormStatusRef.current === BereavementFormStatus.Started) {
    return (
      <Grid id={id} container spacing={4}>
        <Grid item>
          <Button {...continueButton} loading={loading} onClick={handleContinue} data-testid="bereavement-continue-btn">
            {continueButton?.text}
          </Button>
        </Grid>
        <Grid item>
          <Button {...restartButton} loading={loading} onClick={handleRestart} data-testid="bereavement-restart-btn">
            {restartButton?.text}
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid id={id} container spacing={12}>
      {RECAPTCHA_ENABLED && (
        <Grid item xs={12}>
          <ReCAPTCHA sitekey={config.value.RECAPTCHA_KEY} size="normal" onChange={handleCaptchaChange} />
        </Grid>
      )}
      <Grid item xs={12}>
        <Button
          {...startButton}
          loading={loading}
          disabled={!token && RECAPTCHA_ENABLED}
          onClick={handleStart}
          data-testid="bereavement-start-btn"
        >
          {startButton?.text}
        </Button>
      </Grid>
    </Grid>
  );

  async function handleCaptchaChange(token: string | null) {
    if (!token) return;
    const result = await verifyTokenCb.execute(token);
    if (result.data.success) setToken(token);
  }

  async function handleStart() {
    setLoading(true);
    try {
      await bereavementLogin({ currentPageKey: pageKey, nextPageKey });
      await router.parseUrlAndPush(nextPageKey);
    } finally {
      setLoading(false);
    }
  }

  async function handleContinue() {
    setLoading(true);
    try {
      await bereavementContinue();
      await router.parseUrlAndPush(nextPageKey);
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setLoading(true);
    bereavementRestart();
    router.reload();
  }
};
