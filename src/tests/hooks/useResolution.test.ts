import mediaQuery from 'css-mediaquery';
import { useResolution } from '../../core/hooks/useResolution';
import { renderHook } from '../common';

const createMatchMedia = (width: number) => (query: string) =>
  ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {},
    removeListener: () => {},
  } as unknown as MediaQueryList);

describe('useResolution', () => {
  it('should return truthy isMobile if resolution is 300', async () => {
    window.innerWidth = 300;
    window.matchMedia = createMatchMedia(window.innerWidth);
    const hook = renderHook(() => useResolution());
    expect(hook.result.current.isMobile).toBe(true);
    expect(hook.result.current.isSmallMobile).toBe(true);
  });

  it('should return falsy isMobile if resolution is 1024', async () => {
    window.innerWidth = 1024;
    window.matchMedia = createMatchMedia(window.innerWidth);
    const hook = renderHook(() => useResolution());
    expect(hook.result.current.isMobile).toBe(false);
    expect(hook.result.current.isSmallMobile).toBe(false);
  });

  it('should return truthy isSmallMobile and isMobile if resolution is 500', async () => {
    window.innerWidth = 500;
    window.matchMedia = createMatchMedia(window.innerWidth);
    const hook = renderHook(() => useResolution());
    expect(hook.result.current.isMobile).toBe(true);
    expect(hook.result.current.isSmallMobile).toBe(true);
  });

  it('should return truthy isMobile but falsy isSmallMobile if resolution is 700', async () => {
    window.innerWidth = 700;
    window.matchMedia = createMatchMedia(window.innerWidth);
    const hook = renderHook(() => useResolution());
    expect(hook.result.current.isMobile).toBe(true);
    expect(hook.result.current.isSmallMobile).toBe(false);
  });
});
