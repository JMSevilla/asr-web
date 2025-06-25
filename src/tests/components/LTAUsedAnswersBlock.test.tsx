import { ComponentProps } from 'react';
import { LTAUsedAnswersBlock, findLTAUsedAnswersQnAKeys } from '../../components/blocks/LTAUsedAnswersBlock';
import { useApi } from '../../core/hooks/useApi';
import { render, screen } from '../common';

const DEFAULT_PROPS: ComponentProps<typeof LTAUsedAnswersBlock> = {
  id: 'id',
  formKey: 'formKey',
  journeyType: 'retirement',
  parameters: [{ key: 'questionKey', value: 'answerKey' }],
};

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: {
      answers: [
        { questionKey: 'questionKey', answerKey: 'answerKey' },
        { questionKey: 'questionKey1', answerKey: 'answerKey1' },
      ],
    },
    loading: false,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({ loading: false, error: false }),
}));

describe('LTAUsedAnswersBlock', () => {
  it('renders correct amount of items', () => {
    render(<LTAUsedAnswersBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('lta-used-answers-block')?.children.length).toBe(1);
  });

  it('renders not render component without items', () => {
    jest.mocked(useApi).mockReturnValue({
      result: null,
      loading: false,
      error: false,
    } as any);
    render(<LTAUsedAnswersBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('lta-used-answers-block')).toBeFalsy();
  });

  it('findLTAUsedAnswersQnAKeys correctly parses questions and answers', () => {
    const questions = {
      questionKey1: { answerKey: 'answerKey1' },
      questionKey2: { answerKey: 'answerKey2' },
      nestedQuestions: [{ questionKey3: { answerKey: 'answerKey3' } }, { questionKey4: { answerKey: 'answerKey4' } }],
    };
    const result = findLTAUsedAnswersQnAKeys(questions);
    expect(result).toEqual([
      { questionKey: 'questionKey1', answerKey: 'answerKey1' },
      { questionKey: 'questionKey2', answerKey: 'answerKey2' },
      { questionKey: 'questionKey3', answerKey: 'answerKey3' },
      { questionKey: 'questionKey4', answerKey: 'answerKey4' },
    ]);
  });
});
