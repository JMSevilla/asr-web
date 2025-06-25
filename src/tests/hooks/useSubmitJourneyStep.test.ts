import { useSubmitJourneyStep } from '../../core/hooks/useSubmitJourneyStep';
import { renderHook } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

describe('useSubmitJourneyStep', () => {
  it('should return submitJourneyStep fn when journeyType is retirement', async () => {
    const { result } = renderHook(() => useSubmitJourneyStep('retirement'));

    expect(result.current.execute).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });
  it('should return transferJourneySubmitStep fn when journeyType is transfer2', async () => {
    const { result } = renderHook(() => useSubmitJourneyStep('transfer2'));

    expect(result.current.execute).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });
});
