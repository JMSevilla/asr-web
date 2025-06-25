import { usePersistentAppState } from '../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useJourneyNavigation } from '../../core/hooks/useJourneyNavigation';
import { useRouter } from '../../core/router';
import { renderHook } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn(),
}));

jest.mock('../../core/router', () => ({ useRouter: jest.fn() }));

describe('useJourneyNavigation', () => {
  it('should call "reset" when edit property is set', async () => {
    const reset = jest.fn();
    const router = {
      parseUrlAndPush: jest.fn(),
    };
    jest.mocked(useRouter).mockReturnValue(router as any);
    jest.mocked(usePersistentAppState).mockReturnValue({
      fastForward: {
        shouldGoToSummary: jest.fn().mockReturnValue(true),
        reset,
        state: { bereavement: { summaryPageKey: 'summaryPageKey' } },
      },
    } as any);

    const { result } = renderHook(() => useJourneyNavigation('bereavement', 'nextPageKey'));
    await result.current.goNext();

    expect(reset).toHaveBeenCalled();
  });

  it('should not call "reset" when edit property is not set', async () => {
    const reset = jest.fn();
    const router = {
      parseUrlAndPush: jest.fn(),
    };
    jest.mocked(useRouter).mockReturnValue(router as any);
    jest.mocked(usePersistentAppState).mockReturnValue({
      fastForward: { shouldGoToSummary: jest.fn().mockReturnValue(false), reset },
    } as any);

    const { result } = renderHook(() => useJourneyNavigation('bereavement', 'nextPageKey'));
    await result.current.goNext();

    expect(reset).not.toHaveBeenCalled();
  });

  it('should return loading if router is loading or parsing', async () => {
    const router = {
      parseUrlAndPush: jest.fn(),
      loading: true,
      parsing: true,
    };
    jest.mocked(useRouter).mockReturnValue(router as any);
    jest.mocked(usePersistentAppState).mockReturnValue({
      fastForward: { shouldGoToSummary: jest.fn().mockReturnValue(false), reset: jest.fn() },
    } as any);

    const { result } = renderHook(() => useJourneyNavigation('bereavement', 'nextPageKey'));
    expect(result.current.loading).toBeTruthy();
  });
});
