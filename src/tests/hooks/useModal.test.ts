import { useModal } from '../../core/hooks/useModal';
import { act, renderHook } from '../common';

describe('useModal', () => {
  it('should return correct values after open call', async () => {
    const hook = renderHook(() => useModal<string>());
    act(() => hook.result.current.open('test'));
    expect(hook.result.current.props.isOpen).toBe(true);
    expect(hook.result.current.props.context).toBe('test');
  });

  it('should return correct values after close call', async () => {
    const hook = renderHook(() => useModal<string>());
    act(() => {
      hook.result.current.open('test');
      hook.result.current.close();
    });
    expect(hook.result.current.props.isOpen).toBe(false);
    expect(hook.result.current.props.context).toBe(undefined);
  });
});
