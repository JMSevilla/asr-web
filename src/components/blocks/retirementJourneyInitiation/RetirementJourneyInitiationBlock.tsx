import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { PrimaryButton } from '../..';
import { CmsTenant } from '../../../api/content/types/tenant';
import { JourneyStepParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { mixpanelTrackButtonClick } from '../../../core/mixpanel-tracker';
import { useRouter } from '../../../core/router';
import { MessageType } from '../../topAlertMessages';

interface Props {
  id?: string;
  tenant: CmsTenant | null;
  parameters: { key: string; value: string }[];
}

export const RetirementJourneyInitiationBlock: React.FC<Props> = ({ id, parameters, tenant }) => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const { clearCmsTokens } = useContentDataContext();
  const { labelByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const currentPageKey = findValueByKey('current_page', parameters) ?? '';
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const selectedQuote = useApi(api => api.mdp.quoteSelectionJourneySelections());
  const startCb = useApiCallback(async (api, params: JourneyStepParams) => {
    const result = await api.mdp.retirementJourneyStartV2(params);
    clearCmsTokens();
    return result;
  });

  useEffect(() => {
    const errors = startCb.error as string[] | undefined;
    errors && showNotifications(errors.map(error => ({ type: MessageType.Problem, message: errorByKey(error) })));
    return () => hideNotifications();
  }, [startCb.error, showNotifications, errorByKey]);

  return (
    <Grid id={id} container direction="column" spacing={4}>
      <Grid item>
        <PrimaryButton
          onClick={onStart}
          loading={
            startCb.loading || cachedAccessKey.loading || selectedQuote.loading || router.loading || router.parsing
          }
          data-mdp-key="retirement_start_button"
          data-testid="retirement_start_button"
        >
          {labelByKey('retirement_start_button')}
        </PrimaryButton>
      </Grid>
    </Grid>
  );

  async function onStart() {
    const selectedQuoteName = selectedQuote.result?.data.selectedQuoteName;
    if (selectedQuoteName) {
      mixpanelTrackButtonClick({
        Category: 'Start your retirement application',
      });
      await startCb.execute({ currentPageKey, nextPageKey, selectedQuoteName });
      await cachedAccessKey.refresh();
    }

    await router.parseUrlAndPush(nextPageKey);
  }
};
