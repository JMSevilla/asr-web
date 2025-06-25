import { useSessionStorage } from '../../core/hooks/useSessionStorage';
import { renderHook } from '../common';

describe('useSessionStorage', () => {
  it('should return correct initial value', async () => {
    const hook = renderHook(() => useSessionStorage('test', 1));
    expect(hook.result.current[0]).toBe(1);
  });

  it('should return updated value', async () => {
    const hook = renderHook(() => useSessionStorage('test', 1));
    hook.result.current[1](2);
    hook.rerender();
    expect(hook.result.current[0]).toBe(2);
  });

  it('should return initial value after clear value call', async () => {
    const hook = renderHook(() => useSessionStorage('test', 1));
    hook.result.current[1](2);
    hook.result.current[2]();
    hook.rerender();
    expect(hook.result.current[0]).toBe(1);
  });
});
