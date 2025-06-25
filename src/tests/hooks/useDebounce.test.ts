import { useDebounce } from '../../core/hooks/useDebounce';
import { renderHook, waitFor } from '../common';

type Args = ArgumentTypes<typeof useDebounce>;

describe('useDebounce', () => {
  it('should throttle function calls if debounce is present', async () => {
    const debounce = 100;
    const throttledFn = jest.fn();
    const hook = renderHook<void, Args>(props => useDebounce(...props), {
      initialProps: [throttledFn, debounce, [1]],
    });
    hook.rerender([throttledFn, debounce, [2]]);
    hook.rerender([throttledFn, debounce, [3]]);
    await waitFor(() => expect(throttledFn).toBeCalledTimes(1));
  });

  it('should not throttle function calls if debounce is missing', async () => {
    const debounce = undefined;
    const throttledFn = jest.fn();
    const hook = renderHook<void, Args>(props => useDebounce(...props), {
      initialProps: [throttledFn, debounce, [1]],
    });
    hook.rerender([throttledFn, debounce, [2]]);
    hook.rerender([throttledFn, debounce, [3]]);
    await waitFor(() => expect(throttledFn).toBeCalledTimes(3));
  });
});
