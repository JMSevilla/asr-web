import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { DetailsContainer, ListLoader, MessageType, PrimaryButton } from '../../../';
import { JourneyTypeSelection } from '../../../../api/content/types/page';
import { formatDate } from '../../../../business/dates';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useApi, useApiCallback } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';

interface Props {
  changePageKey?: string;
  journeyType: JourneyTypeSelection;
}

type PwAnswerOptionsMap = {
  [k: string]: {
    showFaDate?: boolean;
    hideDate?: boolean;
    hideAnswerYes?: boolean;
  };
};

const pwAnswerKeyOptionsMap: PwAnswerOptionsMap = {
  pw_guidance_a: {
    showFaDate: false,
  },
  pw_guidance_b: {
    showFaDate: false,
  },
  pw_guidance_c: {
    showFaDate: true,
  },
  pw_guidance_d: {
    hideDate: true,
    hideAnswerYes: true,
  },
};

const pwGuidanceQuestionKey = 'pw_guidance';

export const PensionWiseGuidanceSummary: React.FC<Props> = ({ changePageKey, journeyType }) => {
  const router = useRouter();
  const { labelByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const pensionWiseCb = useApiCallback(api =>
    journeyType === 'transfer2' ? api.mdp.transferPensionWise() : api.mdp.pensionWise(),
  );
  const financialAdviseCb = useApiCallback(api =>
    journeyType === 'transfer2' ? api.mdp.transferFinancialAdvice() : api.mdp.financialAdvice(),
  );
  const questionAnswers = useApi(api => api.mdp.journeyQuestionAnswers([pwGuidanceQuestionKey]));
  const [sessionDate, setSessionDate] = useState<string>();

  const answerKey = questionAnswers.result?.data?.[0]?.answerKey;
  const error = pensionWiseCb.error || financialAdviseCb.error || questionAnswers.error;

  useEffect(() => {
    if (!answerKey) return;

    const answer = pwAnswerKeyOptionsMap[answerKey];

    if (!answer || answer.hideDate) return;

    (async () => {
      const date = answer.showFaDate
        ? (await financialAdviseCb.execute())?.data.financialAdviseDate
        : (await pensionWiseCb.execute())?.data.pensionWiseDate;

      setSessionDate(date ? formatDate(date) : undefined);
    })();
  }, [answerKey]);

  useEffect(() => {
    const errors = error as string[] | undefined;
    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [error]);

  if (pensionWiseCb.loading || financialAdviseCb.loading || questionAnswers.loading) {
    return <ListLoader loadersCount={2} />;
  }

  if (!answerKey) {
    return null;
  }

  return (
    <Grid item xs={12}>
      <DetailsContainer>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="pw-answer-label">
            {labelByKey(`pw_answer_${answerKey}`)}
          </Typography>
        </Grid>
        {!pwAnswerKeyOptionsMap[answerKey].hideAnswerYes && (
          <Grid item xs={12} md={6}>
            <Typography color="primary" variant="secondLevelValue" component="span" data-testid="pw-answer-label-value">
              {labelByKey('yes')}
            </Typography>
          </Grid>
        )}
        {sessionDate && (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" fontWeight="bold" data-testid="pw-date-label">
                {labelByKey(`pw_date_${answerKey}`)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography color="primary" variant="secondLevelValue" component="span" data-testid="pw-date-label-value">
                {sessionDate}
              </Typography>
            </Grid>
          </>
        )}
        {changePageKey && (
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <PrimaryButton
              onClick={handleChangeClick}
              loading={router.loading || router.parsing}
              data-testid="change-pension-wise-button"
            >
              {labelByKey('change')}
            </PrimaryButton>
          </Grid>
        )}
      </DetailsContainer>
    </Grid>
  );

  async function handleChangeClick() {
    changePageKey && (await router.parseUrlAndPush(changePageKey));
  }
};
