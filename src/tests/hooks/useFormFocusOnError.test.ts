import { useFormFocusOnError } from '../../core/hooks/useFormFocusOnError';
import { renderHook } from '../common';

describe('useFormFocusOnError', () => {
  it('should set focus on the first field that has error', async () => {
    const focusFn = jest.fn();
    renderHook(() => useFormFocusOnError({ test1: 'error', test2: 'error' }, focusFn));
    expect(focusFn).toBeCalledWith('test1');
  });

  it('should not set focus when there are no errors', async () => {
    const focusFn = jest.fn();
    renderHook(() => useFormFocusOnError({}, focusFn));
    expect(focusFn).not.toBeCalled();
  });
});
