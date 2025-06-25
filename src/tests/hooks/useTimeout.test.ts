import { useTimeout } from '../../core/hooks/useTimeout';
import { renderHook } from '../common';

describe('useTimeout', () => {
  it('should call the callback after the specified delay', async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    const delay = 1000;
    const { result } = renderHook(() => useTimeout(callback, delay));
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('should clear the timeout when delay becomes null', async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    const delay = 1000;
    const { rerender } = renderHook(({ delay }) => useTimeout(callback, delay), {
      initialProps: { delay },
    });
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);
    // for testing timeout clear
    // @ts-ignore
    rerender({ delay: null });

    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
