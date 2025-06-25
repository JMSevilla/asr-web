import { ComponentProps } from 'react';
import { JourneyTypeSelection, JourneyTypes } from '../../../api/content/types/page';
import { JourneyQuestionsBlock } from '../../../components/blocks/journey/questions/JourneyQuestionsBlock';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { act, render, screen, waitFor } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof JourneyQuestionsBlock> = {
  id: 'journey-questions',
  answers: [
    { answer: 'answer1', answerKey: 'answerKey1', nextPageKey: 'nextPageKey1' },
    { answer: 'answer2', answerKey: 'answerKey2', nextPageKey: 'nextPageKey2' },
    { answer: 'answer3', answerKey: 'answerKey3', nextPageKey: 'nextPageKey3' },
  ],
  questionKey: 'question_key',
  questionText: 'question_text',
  pageKey: 'journey_question',
  parameters: [],
  journeyType: 'retirement' as JourneyTypeSelection,
  showInDropdown: false,
  avoidBranching: false,
  buttons: [],
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn(), parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: {} }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({
    bereavement: {
      form: {
        values: {
          reporter: {},
          nextOfKin: {},
          executor: {},
        },
      },
    },
    fastForward: {
      state: {},
      shouldGoToSummary: jest.fn().mockReturnValue(false),
    },
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn() }),
  useApi: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({
    data: null,
    loading: false,
    fetch: jest.fn(),
    noCheckFetch: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('JourneyQuestionsBlock.test', () => {
  it('should render journey question block component', () => {
    render(<JourneyQuestionsBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('journey-questions')).toBeTruthy();
    expect(screen.getByText('question_text')).toBeTruthy();
    expect(screen.getByText('[[continue]]')).toBeTruthy();
    expect(screen.getByText('[[save_and_exit]]')).toBeTruthy();
  });

  it('should render answers', () => {
    render(
      <JourneyQuestionsBlock
        {...DEFAULT_PROPS}
        answers={[
          { answer: 'answer1', answerKey: 'answerKey1', nextPageKey: 'nextPageKey1' },
          { answer: 'answer2', answerKey: 'answerKey2', nextPageKey: 'nextPageKey2' },
          { answer: 'answer3', answerKey: 'answerKey3', nextPageKey: 'nextPageKey3' },
        ]}
      />,
    );

    expect(screen.getByTestId('journey-answer-3')).toBeTruthy();
    expect(screen.getByText('answer3')).toBeTruthy();
  });

  it('should show answers in dropdown', () => {
    render(
      <JourneyQuestionsBlock
        {...DEFAULT_PROPS}
        showInDropdown={true}
        answers={[
          { answer: 'answer1', answerKey: 'answerKey1', nextPageKey: 'nextPageKey1' },
          { answer: 'answer2', answerKey: 'answerKey2', nextPageKey: 'nextPageKey2' },
          { answer: 'answer3', answerKey: 'answerKey3', nextPageKey: 'nextPageKey3' },
        ]}
      />,
    );

    expect(screen.getByTestId('journey-options-dropdown')).toBeTruthy();
  });

  it('should call callback execute on continue when journeyType is retirement and answer is selected', async () => {
    const executeFn = jest.fn().mockReturnValue({ data: { url: 'url' } });
    jest.mocked(useApiCallback).mockReturnValue({ execute: executeFn } as any);
    const refreshFn = jest.fn();
    jest.mocked(useCachedAccessKey).mockReturnValue({ refresh: refreshFn, loading: false } as any);
    render(<JourneyQuestionsBlock {...DEFAULT_PROPS} journeyType={JourneyTypes.RETIREMENT} />);

    act(() => {
      screen.getByTestId('journey-answer-3').click();
    });
    act(() => {
      screen.getByTestId('continue').click();
    });

    await waitFor(() => {
      expect(executeFn).toHaveBeenLastCalledWith({
        answerKey: DEFAULT_PROPS.answers[2].answerKey,
        answerValue: DEFAULT_PROPS.answers[2].answer,
        nextPageKey: DEFAULT_PROPS.answers[2].nextPageKey,
        currentPageKey: DEFAULT_PROPS.pageKey,
        questionKey: DEFAULT_PROPS.questionKey,
      });
      expect(refreshFn).toHaveBeenCalled();
    });
  });

  it('should call callback execute on continue when journeyType is transfer2 and answer is selected', async () => {
    const executeFn = jest.fn().mockReturnValue({ data: { url: 'url' } });
    jest.mocked(useApiCallback).mockReturnValue({ execute: executeFn } as any);
    const refreshFn = jest.fn();
    jest.mocked(useCachedAccessKey).mockReturnValue({ refresh: refreshFn, loading: false } as any);
    render(<JourneyQuestionsBlock {...DEFAULT_PROPS} journeyType={JourneyTypes.TRANSFER2} />);

    act(() => {
      screen.getByTestId('journey-answer-3').click();
    });
    act(() => {
      screen.getByTestId('continue').click();
    });

    await waitFor(() => {
      expect(executeFn).toHaveBeenLastCalledWith({
        answerKey: DEFAULT_PROPS.answers[2].answerKey,
        nextPageKey: DEFAULT_PROPS.answers[2].nextPageKey,
        currentPageKey: DEFAULT_PROPS.pageKey,
        questionKey: DEFAULT_PROPS.questionKey,
      });
      expect(refreshFn).toHaveBeenCalled();
    });
  });

  it('should call callback execute on continue when journeyType is generic and answer is selected', async () => {
    const executeFn = jest.fn().mockReturnValue({ data: { url: 'url' } });
    jest.mocked(useApiCallback).mockReturnValue({ execute: executeFn } as any);
    const refreshFn = jest.fn();
    jest.mocked(useCachedAccessKey).mockReturnValue({ refresh: refreshFn, loading: false } as any);
    render(<JourneyQuestionsBlock {...DEFAULT_PROPS} journeyType={'generic_journey' as JourneyTypeSelection} />);

    act(() => {
      screen.getByTestId('journey-answer-3').click();
    });
    act(() => {
      screen.getByTestId('continue').click();
    });

    await waitFor(() => {
      expect(executeFn).toHaveBeenLastCalledWith({
        answerKey: DEFAULT_PROPS.answers[2].answerKey,
        answerValue: DEFAULT_PROPS.answers[2].answer,
        nextPageKey: DEFAULT_PROPS.answers[2].nextPageKey,
        currentPageKey: DEFAULT_PROPS.pageKey,
        questionKey: DEFAULT_PROPS.questionKey,
      });
      expect(refreshFn).toHaveBeenCalled();
    });
  });
});
