import { useFastForward } from '../../../core/contexts/persistentAppState/hooks/useFastForward';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: {
    get value() {
      return {};
    },
  },
}));

describe('useFastForward', () => {
  it('should initialize fast forward with correct values', async () => {
    const hook = renderHook(() => useFastForward());
    act(() =>
      hook.result.current.init({
        journeyType: 'transfer',
        nextPageKey: 'nextPageKey',
        summaryPageKey: 'summaryPageKey',
      }),
    );
    expect(hook.result.current.state).toStrictEqual({
      transfer: { edit: true, nextPageKey: 'nextPageKey', summaryPageKey: 'summaryPageKey', contactPageKey: undefined },
    });
  });

  it('should initialize fast forward with correct values', async () => {
    const hook = renderHook(() => useFastForward());
    act(() =>
      hook.result.current.init({
        journeyType: 'transfer',
        nextPageKey: 'nextPageKey',
        summaryPageKey: 'summaryPageKey',
      }),
    );
    expect(hook.result.current.state).toStrictEqual({
      transfer: { edit: true, nextPageKey: 'nextPageKey', summaryPageKey: 'summaryPageKey', contactPageKey: undefined },
    });
  });

  it('should return correct shouldGoToSummary value', async () => {
    const hook = renderHook(() => useFastForward());
    act(() =>
      hook.result.current.init({
        journeyType: 'transfer',
        nextPageKey: 'nextPageKey',
        summaryPageKey: 'summaryPageKey',
      }),
    );
    expect(hook.result.current.shouldGoToSummary('transfer', 'nextPageKey2')).toBeFalsy();
    expect(hook.result.current.shouldGoToSummary('transfer', 'nextPageKey')).toBeTruthy();
  });

  it('should return correct shouldGoToContact value', async () => {
    const hook = renderHook(() => useFastForward());
    expect(hook.result.current.shouldGoToContact('transfer', 'nextPageKey')).toBeFalsy();
    act(() =>
      hook.result.current.init({
        journeyType: 'transfer',
        nextPageKey: 'nextPageKey',
        summaryPageKey: 'summaryPageKey',
        contactPageKey: 'contactPageKey',
      }),
    );
    expect(hook.result.current.shouldGoToContact('transfer', 'nextPageKey')).toBeTruthy();
  });

  it('should set edit state to false', async () => {
    const hook = renderHook(() => useFastForward());
    act(() => {
      hook.result.current.init({
        journeyType: 'transfer',
        nextPageKey: 'nextPageKey',
        summaryPageKey: 'summaryPageKey',
      });
      hook.result.current.reset('transfer');
    });
    expect(hook.result.current.state['transfer'].edit).toBeFalsy();
  });

  it('should reset all state ', async () => {
    const hook = renderHook(() => useFastForward());
    act(() => {
      hook.result.current.init({
        journeyType: 'transfer',
        nextPageKey: 'nextPageKey',
        summaryPageKey: 'summaryPageKey',
      });
      hook.result.current.init({
        journeyType: 'transfer2',
        nextPageKey: 'nextPageKey',
        summaryPageKey: 'summaryPageKey',
      });

      hook.result.current.resetAll();
    });
    expect(hook.result.current.state).toStrictEqual({});
  });
});
