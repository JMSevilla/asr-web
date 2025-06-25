import { Grid, Typography } from '@mui/material';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { findValueByKey } from '../../business/find-in-array';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useApi } from '../../core/hooks/useApi';
import { useDataReplacerApi } from '../../core/hooks/useDataReplacerApi';
import { AnimatedBoxSkeleton } from '../animations/AnimatedBoxSkeleton';

interface Props {
  id?: string;
  formKey: string;
  journeyType: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}

export const LTAUsedAnswersBlock: React.FC<Props> = ({ id, formKey, journeyType, parameters }) => {
  const { labelByKey } = useGlobalsContext();
  const shouldUseGenericData = +(findValueByKey('version', parameters) || 0) >= 2;
  const answersSource = useApi(
    async api => {
      if (shouldUseGenericData && journeyType) {
        const result = await api.mdp.genericJourneyAllData<Record<string, object>>(journeyType);
        const answers = findLTAUsedAnswersQnAKeys(result?.data);
        return { answers, source: result.data };
      }
      const result = await api.mdp.journeyQuestionAnswers(parameters.map(p => p.key.trim()));
      return { answers: result.data };
    },
    [shouldUseGenericData],
  );
  const replacer = useDataReplacerApi(answersSource.result?.source);

  if (!answersSource.result?.answers.length) {
    return null;
  }

  const questionsToDisplay = answersSource.result.answers.filter(
    answer => findValueByKey(answer.questionKey, parameters) === answer.answerKey,
  );

  return (
    <Grid id={id} container spacing={2} data-testid="lta-used-answers-block">
      {questionsToDisplay.map((question, idx) => (
        <Grid
          item
          xs={12}
          key={idx}
          {...replacer.elementProps(id, `${formKey}_${question.questionKey}_${question.answerKey}`)}
        >
          <Typography
            variant="body1"
            data-testid={`question-${question.questionKey}`}
            width="100%"
            display="flex"
            alignItems="center"
          >
            &#8226;&nbsp;
            {replacer.loading ? (
              <AnimatedBoxSkeleton height={24} component="span" sx={{ width: 200 }} />
            ) : (
              replacer.replaceDataInText(labelByKey(`${formKey}_${question.questionKey}_${question.answerKey}`))
            )}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export const findLTAUsedAnswersQnAKeys = (
  obj: any,
  currentKey = '',
): Array<{ questionKey: string; answerKey: string }> => {
  if (typeof obj === 'object' && obj !== null) {
    const result = Object.keys(obj).reduce<Array<{ questionKey: string; answerKey: string }>>((acc, key) => {
      const nestedResults = findLTAUsedAnswersQnAKeys(obj[key], key);

      if (typeof obj[key] === 'object' && obj[key] !== null && 'answerKey' in obj[key]) {
        return [...acc, { questionKey: key || currentKey, answerKey: obj[key]['answerKey'] }];
      }

      return [...acc, ...nestedResults];
    }, []);

    return result;
  }

  return [];
};
