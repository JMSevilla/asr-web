import { useEffect, useState } from 'react';
import { JourneyTypeSelection, JourneyTypes, PanelListItem } from '../../../../api/content/types/page';
import {
  SubmitBereavementQuestionParams,
  SubmitGenericQuestionStepParams,
  SubmitQuestionStepParams,
  SubmitRetirementQuestionStepParams,
} from '../../../../api/mdp/types';
import { ParsedButtonProps } from '../../../../cms/parse-cms';
import { usePersistentAppState } from '../../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { logger } from '../../../../core/datadog-logs';
import { useApi, useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { JourneyQuestions } from './JourneyQuestions';
import { Answer, TO_CONTACTS_PATHS } from './types';

interface Props {
  id?: string;
  answers: Answer[];
  questionKey: string;
  questionText?: string;
  bottomPanel?: PanelListItem;
  pageKey: string;
  parameters?: { key: string; value: string }[];
  journeyType: JourneyTypeSelection;
  showInDropdown?: boolean;
  hideSaveAndExit?: boolean;
  avoidBranching: boolean;
  buttons: ParsedButtonProps[];
}

export const JourneyQuestionsBlock: React.FC<Props> = ({
  journeyType,
  parameters,
  avoidBranching,
  hideSaveAndExit,
  answers,
  ...props
}) => {
  const router = useRouter();
  const { bereavement, fastForward } = usePersistentAppState();
  const [answer, setAnswer] = useState<Answer>();
  const cachedAccessKey = useCachedAccessKey();
  const parseUrlCb = useApiCallback((api, key: string) => api.content.urlFromKey(key));
  const submitRetirementStepCb = useApiCallback((api, args: SubmitRetirementQuestionStepParams) =>
    api.mdp.submitJourneyQuestionStep(args),
  );
  const submitTransferStepCb = useApiCallback((api, args: SubmitQuestionStepParams) =>
    api.mdp.transferJourneySubmitQuestionStep(args),
  );
  const submitBereavementStepCb = useApiCallback((api, args: SubmitBereavementQuestionParams) =>
    api.mdp.bereavementJourneySubmitQuestionStep(args),
  );
  const submitGenericStepCb = useApiCallback((api, args: SubmitGenericQuestionStepParams) =>
    api.mdp.genericJourneySubmitQuestionStep(journeyType, args),
  );
  const stepData = useApi(
    async api => {
      if (!journeyType) return Promise.reject();

      switch (journeyType) {
        case JourneyTypes.RETIREMENT:
          const retirementResult = await api.mdp.questionsStepData(props.pageKey);
          setAnswer(answers.find(i => i.answerKey === retirementResult.data.answerKey));
          return retirementResult;
        case JourneyTypes.BEREAVEMENT:
          const bereavementResult = await api.mdp.bereavementJourneyQuestionForm(props.pageKey);
          setAnswer(answers.find(i => i.answerKey === bereavementResult.data.answerKey));
          return bereavementResult;
        case JourneyTypes.TRANSFER2:
          const transferResult = await api.mdp.transferJourneyQuestionForm(props.pageKey);
          setAnswer(answers.find(i => i.answerKey === transferResult.data.answerKey));
          return transferResult;
        default:
          const genericResult = await api.mdp.genericJourneyQuestionForm(journeyType, props.pageKey);
          setAnswer(answers.find(i => i.answerKey === genericResult.data.answerKey));
          return genericResult;
      }
    },
    [props.pageKey],
  );
  const isAnyJourney = !!journeyType;

  useEffect(() => setAnswer(undefined), [props.pageKey]);
  useEffect(() => {
    isAnyJourney && stepData?.error && setAnswer(undefined);
  }, [isAnyJourney, stepData?.error]);

  return (
    <JourneyQuestions
      {...props}
      answers={answers}
      value={answer?.answerKey || ''}
      onChange={onChange}
      onContinueClick={onContinueClick}
      loading={
        parseUrlCb.loading ||
        submitRetirementStepCb.loading ||
        submitBereavementStepCb.loading ||
        submitTransferStepCb.loading ||
        submitGenericStepCb.loading ||
        (isAnyJourney && stepData.loading) ||
        (isAnyJourney && journeyType !== JourneyTypes.BEREAVEMENT && cachedAccessKey.loading) ||
        router.loading ||
        router.parsing
      }
      initialValue={(isAnyJourney && stepData.result?.data.answerKey) || ''}
      isCloseButtonHidden={hideSaveAndExit || !isAnyJourney}
      isDropdown={props.showInDropdown}
    />
  );

  function onChange(answer: Answer) {
    setAnswer(answer);
  }

  async function onContinueClick() {
    const nextPageKey = answer?.nextPageKey;
    const answerValue = answer?.answer ?? '';

    if (!nextPageKey) {
      logger.error(`Missing nextPageKey value in CMS.`);
      return;
    }

    const result = await parseUrlCb.execute(nextPageKey);
    const pageUrl = result?.data?.url;

    if (!pageUrl) {
      logger.error(`Missing or Incorrect pageUrl value in CMS.`);
      return;
    }

    switch (journeyType) {
      case JourneyTypes.BEREAVEMENT:
        await handleBereavementContinue(nextPageKey, answerValue, pageUrl);
        break;
      case JourneyTypes.TRANSFER2:
        await handleTransferContinue(nextPageKey, pageUrl);
        break;
      case JourneyTypes.RETIREMENT:
        await handleRetirementContinue(nextPageKey, pageUrl);
        break;
      default:
        await handleDefaultContinue(nextPageKey, pageUrl, journeyType);
        break;
    }
  }

  async function handleBereavementContinue(nextPageKey: string, answerValue: string, pageUrl: string) {
    await submitBereavementStepCb.execute({
      answerKey: answer?.answerKey || '',
      nextPageKey,
      currentPageKey: props.pageKey,
      questionKey: props.questionKey,
      answerValue,
      avoidBranching,
    });

    if (
      fastForward.shouldGoToSummary(JourneyTypes.BEREAVEMENT, nextPageKey) &&
      fastForward.shouldGoToContact(JourneyTypes.BEREAVEMENT, nextPageKey)
    ) {
      const pushToContactsSelectionPage =
        ((TO_CONTACTS_PATHS[0] === props.pageKey && bereavement.form.values.contactSelection === 'NEXT_OF_KIN') ||
          (TO_CONTACTS_PATHS[1] === props.pageKey && bereavement.form.values.contactSelection === 'EXECUTOR')) &&
        answer?.answerKey === 'No';
      const pushTo = pushToContactsSelectionPage
        ? fastForward.state?.[JourneyTypes.BEREAVEMENT].contactPageKey!
        : fastForward.state?.[JourneyTypes.BEREAVEMENT].summaryPageKey!;

      fastForward.reset(JourneyTypes.BEREAVEMENT);
      await router.parseUrlAndPush(pushTo);
      return;
    }
    await router.push(pageUrl);
  }

  async function handleTransferContinue(nextPageKey: string, pageUrl: string) {
    await submitTransferStepCb.execute({
      answerKey: answer?.answerKey || '',
      nextPageKey,
      currentPageKey: props.pageKey,
      questionKey: props.questionKey,
    });

    await cachedAccessKey.refresh();

    await handleFastForward(journeyType, nextPageKey, pageUrl);
  }

  async function handleRetirementContinue(nextPageKey: string, pageUrl: string) {
    await submitRetirementStepCb.execute({
      answerKey: answer?.answerKey || '',
      answerValue: answer?.answer || '',
      nextPageKey,
      currentPageKey: props.pageKey,
      questionKey: props.questionKey,
    });

    await cachedAccessKey.refresh();

    await router.push(pageUrl);
  }

  async function handleGenericContinue(nextPageKey: string) {
    await submitGenericStepCb.execute({
      answerKey: answer?.answerKey || '',
      answerValue: answer?.answer || '',
      nextPageKey,
      currentPageKey: props.pageKey,
      questionKey: props.questionKey,
    });

    await cachedAccessKey.refresh();
  }

  async function handleDefaultContinue(nextPageKey: string, pageUrl: string, journeyType: JourneyTypeSelection) {
    if (journeyType) {
      await handleGenericContinue(nextPageKey);
      await handleFastForward(journeyType, nextPageKey, pageUrl);
      return;
    }

    await router.push(pageUrl);
  }

  async function handleFastForward(journeyType: JourneyTypeSelection, nextPageKey: string, pageUrl: string) {
    if (fastForward.shouldGoToSummary(journeyType, nextPageKey)) {
      await router.parseUrlAndPush(fastForward.state[journeyType].summaryPageKey!);
      return;
    }

    await router.push(pageUrl);
  }
};
