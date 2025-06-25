import { useBereavementContactInitialData } from '../../../components/blocks/personContactsSelection/hooks';
import { useApi } from '../../../core/hooks/useApi';
import { renderHook } from '../../common';
type MockedAnswer = 'yes' | 'no' | 'dontKnow';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {} } }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: undefined, loading: false }),
}));

describe('useBereavementContactInitialData', () => {
  it('should return  correct props', () => {
    const hook = renderHook(() => useBereavementContactInitialData([]));
    expect(hook.result.current.loading).toBeFalsy();
    expect(hook.result.current.isNextOfKin).toBe(false);
    expect(hook.result.current.isExecutor).toBe(false);
  });

  it('should return correct isNextOfKin on different api responses', () => {
    mockApiQuestionsResult({ nextOfKinStatusAnswer: 'no' });
    const { result, rerender } = renderHook(() => useBereavementContactInitialData([]));
    expect(result.current.isNextOfKin).toBeFalsy();
    mockApiQuestionsResult({ nextOfKinStatusAnswer: 'yes' });
    rerender();
    expect(result.current.isNextOfKin).toBeTruthy();
  });

  it('should return correct executor on different api responses', () => {
    mockApiQuestionsResult({ executorStatusAnswer: 'no' });
    const { result, rerender } = renderHook(() => useBereavementContactInitialData([]));
    expect(result.current.isExecutor).toBeFalsy();
    mockApiQuestionsResult({ executorStatusAnswer: 'yes' });
    rerender();
    expect(result.current.isExecutor).toBeTruthy();
  });
});

const mockApiQuestionsResult = (
  props: Partial<{
    nextOfKinStatusAnswer: MockedAnswer;
    executorStatusAnswer: MockedAnswer;
  }>,
) =>
  jest.mocked(useApi).mockReturnValueOnce({
    loading: false,
    result: {
      nextOfKin: { data: { answerKey: props.nextOfKinStatusAnswer, answerValue: props.nextOfKinStatusAnswer } },
      executor: { data: { answerKey: props.executorStatusAnswer, answerValue: props.executorStatusAnswer } },
    },
  } as any);
