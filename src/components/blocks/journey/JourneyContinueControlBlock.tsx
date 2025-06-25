import { Grid } from '@mui/material';
import { CloseAppButton, ContentButtonBlock, PrimaryButton } from '../..';
import { SubmitStepParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';

interface Props {
  id?: string;
  pageKey?: string;
  isJourney: boolean;
  parameters: { key: string; value: string }[];
}

export const JourneyContinueControlBlock: React.FC<Props> = ({ id, pageKey, isJourney, parameters }) => {
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const saveAndExitButtonKey = findValueByKey('save_and_exit_button', parameters);
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const router = useRouter();
  const submitStepCb = useApiCallback((api, args: SubmitStepParams) => api.mdp.submitJourneyStep(args));
  const saveAndExitButton = saveAndExitButtonKey ? buttonByKey(saveAndExitButtonKey) : null;

  return (
    <Grid id={id} container spacing={4} data-testid="journey-continue-control-block">
      <Grid item>
        <PrimaryButton
          loading={submitStepCb.loading || router.loading || router.parsing}
          onClick={handleContinueClick}
          data-testid="continue"
        >
          {labelByKey('continue')}
        </PrimaryButton>
      </Grid>
      {saveAndExitButton && (
        <Grid item>
          <ContentButtonBlock {...saveAndExitButton} />
        </Grid>
      )}
      {!saveAndExitButton && (
        <Grid item>
          <CloseAppButton />
        </Grid>
      )}
    </Grid>
  );

  async function handleContinueClick() {
    if (!isJourney || !pageKey || !nextPageKey) {
      return;
    }

    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey: nextPageKey });
    await router.parseUrlAndPush(nextPageKey);
  }
};
