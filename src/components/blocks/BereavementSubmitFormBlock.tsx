import React, { useEffect, useState } from 'react';
import { Button, MessageType } from '..';
import { SubmitStepParams } from '../../api/mdp/types';
import { findValueByKey } from '../../business/find-in-array';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../core/contexts/NotificationsContext';
import { useBereavementSession } from '../../core/contexts/bereavement/BereavementSessionContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useRouter } from '../../core/router';

interface Props {
  id: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
}

export const BereavementSubmitFormBlock: React.FC<Props> = ({ id, pageKey, parameters }) => {
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const router = useRouter();
  const { buttonByKey, errorByKey } = useGlobalsContext();
  const { bereavementSubmit, submitError } = useBereavementSession();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const submitStepCb = useApiCallback((api, params: SubmitStepParams) => api.mdp.bereavementJourneySubmitStep(params));
  const [loading, setLoading] = useState(false);
  const button = buttonByKey('bereavement_submit_submit');

  useEffect(() => {
    if (!submitError) return;
    showNotifications([{ type: MessageType.Problem, message: errorByKey(String(submitError)) }]);
    return () => hideNotifications();
  }, [submitError]);

  return (
    <Button {...button} loading={loading} onClick={handleSubmit} id={id} data-testid="bereavement-submit-btn">
      {button?.text}
    </Button>
  );

  async function handleSubmit() {
    setLoading(true);
    try {
      await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
      await bereavementSubmit();
      await router.parseUrlAndPush(nextPageKey);
    } finally {
      setLoading(false);
    }
  }
};
