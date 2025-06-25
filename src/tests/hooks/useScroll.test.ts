import { useScroll } from '../../core/hooks/useScroll';
import { renderHook } from '../common';

jest.mock('../../core/router', () => ({ useRouter: jest.fn().mockReturnValue({ asPath: null }) }));

describe('useScroll', () => {
  it('should scroll to X', async () => {
    const X = 100;
    const scrollToFn = jest.fn();
    Object.defineProperty(window, 'scrollTo', { value: scrollToFn });
    const hook = renderHook(() => useScroll());
    hook.result.current.scrollTo('', X);
    expect(scrollToFn).toBeCalledWith({ top: X, behavior: 'smooth' });
  });

  it('should scroll to top', async () => {
    const scrollToFn = jest.fn();
    Object.defineProperty(window, 'scrollTo', { value: scrollToFn });
    const hook = renderHook(() => useScroll());
    hook.result.current.scrollTop();
    expect(scrollToFn).toBeCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should enable scroll', async () => {
    const hook = renderHook(() => useScroll());
    hook.result.current.enableScroll();
    expect(document.body.style.overflowY).toBe('scroll');
  });

  it('should disable scroll', async () => {
    const hook = renderHook(() => useScroll());
    hook.result.current.disableScroll();
    expect(document.body.style.overflowY).toBe('hidden');
  });
});
