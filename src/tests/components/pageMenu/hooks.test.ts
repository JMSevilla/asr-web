import { useUpdateBlockInViewOnScroll } from '../../../components/blocks/pageMenu/hooks';
import { act, renderHook } from '../../common';

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ asPath: '' }),
}));

describe('useUpdateBlockInViewOnScroll', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() => useUpdateBlockInViewOnScroll([]));
    expect(result.current[0]).toBe(0);
    expect(result.current[1]).toBe(0);
    expect(typeof result.current[2]).toBe('function');
  });

  it('should update index on updateFn call', () => {
    const scrollToMock = jest.fn();
    Object.defineProperty(window, 'scrollTo', { value: scrollToMock });
    Object.defineProperty(HTMLDivElement.prototype, 'scrollTo', { value: scrollToMock, writable: true });
    const { result } = renderHook(() =>
      useUpdateBlockInViewOnScroll([
        { key: { value: 'test' }, value: { value: 'test' } },
        { key: { value: 'test2' }, value: { value: 'test2' } },
        { key: { value: 'test3' }, value: { value: 'test3' } },
      ]),
    );
    expect(result.current[1]).toBe(0);
    act(() => {
      result.current[2](2);
    });
    expect(result.current[0]).toBe(0);
    expect(result.current[1]).toBe(2);
    expect(scrollToMock).toHaveBeenCalledTimes(1);
  });
});
