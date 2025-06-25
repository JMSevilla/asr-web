import { JourneyTypeSelection } from '../../../api/content/types/page';
import { ButtonClipBlock } from '../../../components/blocks/ButtonClipBlock';
import { JourneyQuestions } from '../../../components/blocks/journey/questions/JourneyQuestions';
import { act, render, screen, userEvent } from '../../common';

const BUTTON: React.ComponentProps<typeof ButtonClipBlock>['buttons'][number] = {
  key: 'string',
  linkKey: 'string',
  anchor: '',
  link: 'string',
  type: 'Primary',
  text: 'string',
  icon: undefined,
  iconName: undefined,
  rightSideIcon: undefined,
  reuseUrlParameters: undefined,
  openInTheNewTab: undefined,
  widthPercentage: undefined,
  customActionKey: undefined,
  notification: undefined,
  disabledReason: undefined,
  fileUrl: '',
  dialogElement: undefined,
  analyticsKey: undefined,
  journeyType: undefined,
  fastForwardComparisonPageKey: undefined,
  fastForwardRedirectPageKey: undefined,
  postRequestUrl: undefined,
  largeIcon: undefined,
  disabled: undefined,
};

const DEFAULT_PROPS = {
  id: 'journey-questions',
  answers: [],
  questionKey: 'question_key',
  questionText: 'question_text',
  pageKey: 'journey_question',
  parameters: [],
  journeyType: 'retirement' as JourneyTypeSelection,
  showInDropdown: false,
  avoidBranching: false,
  buttons: [],
  value: '',
  loading: false,
  initialValue: '',
  isCloseButtonHidden: false,
  isDropdown: false,
  onChange: jest.fn(),
  onContinueClick: jest.fn(),
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
  }),
}));

describe('JourneyQuestionsBlock.test', () => {
  it('should render journey question component', () => {
    render(<JourneyQuestions {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('journey-questions')).toBeTruthy();
    expect(screen.getByText('question_text')).toBeTruthy();
    expect(screen.getByText('[[continue]]')).toBeTruthy();
    expect(screen.getByText('[[save_and_exit]]')).toBeTruthy();
  });

  it('should render answers', () => {
    render(
      <JourneyQuestions
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
      <JourneyQuestions
        {...DEFAULT_PROPS}
        isDropdown={true}
        answers={[
          { answer: 'answer1', answerKey: 'answerKey1', nextPageKey: 'nextPageKey1' },
          { answer: 'answer2', answerKey: 'answerKey2', nextPageKey: 'nextPageKey2' },
          { answer: 'answer3', answerKey: 'answerKey3', nextPageKey: 'nextPageKey3' },
        ]}
      />,
    );

    expect(screen.getByTestId('journey-options-dropdown')).toBeTruthy();
  });

  it('should be able to select option from dropdown', async () => {
    const onChangeCb = jest.fn();
    render(
      <JourneyQuestions
        {...DEFAULT_PROPS}
        isDropdown={true}
        onChange={onChangeCb}
        answers={[
          { answer: 'answer1', answerKey: 'answerKey1', nextPageKey: 'nextPageKey1' },
          { answer: 'answer2', answerKey: 'answerKey2', nextPageKey: 'nextPageKey2' },
          { answer: 'answer3', answerKey: 'answerKey3', nextPageKey: 'nextPageKey3' },
        ]}
      />,
    );

    const selectOption = screen.queryByTestId('journey-options-dropdown');
    selectOption && (await act(async () => await userEvent.click(selectOption)));
    const option = screen.getByRole<HTMLOptionElement>('option', { name: 'answer3' });
    option && (await act(async () => await userEvent.click(option)));
    expect(onChangeCb).toBeCalledTimes(1);
  });

  it('should render buttons', async () => {
    render(<JourneyQuestions {...DEFAULT_PROPS} isDropdown={true} buttons={[BUTTON, BUTTON, BUTTON]} />);

    expect(screen.getAllByTestId('content-button-block').length).toBe(3);
  });

  it('should disable the close button when value is not equal to initialValue', () => {
    const { getByTestId } = render(
      <JourneyQuestions {...DEFAULT_PROPS} value="newValue" initialValue="initialValue" />,
    );

    const closeButton = getByTestId('close_app_save_and_exit');
    expect(closeButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render question text when provided', () => {
    const { getByText } = render(<JourneyQuestions {...DEFAULT_PROPS} questionText="Test question" />);
    expect(getByText('Test question')).toBeInTheDocument();
  });

  it('should render radio buttons when isDropdown is false', () => {
    const { getByTestId } = render(
      <JourneyQuestions
        {...DEFAULT_PROPS}
        isDropdown={false}
        answers={[
          { answer: 'answer1', answerKey: 'answerKey1', nextPageKey: 'nextPageKey1' },
          { answer: 'answer2', answerKey: 'answerKey2', nextPageKey: 'nextPageKey2' },
        ]}
      />,
    );
    const radioButton1 = getByTestId('journey-answer-1');
    const radioButton2 = getByTestId('journey-answer-2');
    expect(radioButton1).toBeInTheDocument();
    expect(radioButton2).toBeInTheDocument();
  });

  it('should disable radio button when loading and value is not equal to answerKey', () => {
    const { getByTestId } = render(
      <JourneyQuestions
        {...DEFAULT_PROPS}
        loading={true}
        value="differentAnswerKey"
        answers={[{ answer: 'answer1', answerKey: 'answerKey1', nextPageKey: 'nextPageKey1' }]}
      />,
    );
    const radioButton = getByTestId('journey-answer-1');
    expect(radioButton).toHaveClass('Mui-disabled');
  });

  it('should render radio button label with description panels', () => {
    const { getByText, getByTestId } = render(
      <JourneyQuestions
        {...DEFAULT_PROPS}
        answers={[
          {
            answer: 'answer1',
            answerKey: 'answerKey1',
            nextPageKey: 'nextPageKey1',
            descriptionPanels: [
              {
                elements: {
                  header: { value: 'header' },
                  panelKey: { value: 'panelKey' },
                  columns: { values: [] },
                },
              },
            ],
          },
          { answer: 'answer2', answerKey: 'answerKey2', nextPageKey: 'nextPageKey2' },
        ]}
      />,
    );
    expect(getByText('header')).toBeInTheDocument();
    expect(getByTestId('radio-answer-1').children).toHaveLength(1);
    expect(getByTestId('radio-answer-2').children).toHaveLength(0);
  });
});
