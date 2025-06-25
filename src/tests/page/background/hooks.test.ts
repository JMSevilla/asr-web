import { act, renderHook } from '@testing-library/react';
import { BackgroundConfigItem } from '../../../api/content/types/page';
import { CmsTenant } from '../../../api/content/types/tenant';
import { usePageBackground } from '../../../components/page/background/hooks';

jest.mock('../../../cms/parse-cms', () => ({
  parseBackgroundColor: jest.fn().mockImplementation((tenant, color) => {
    if (color?.value === 'primary') return '#primary-color';
    if (color?.value === 'secondary') return '#secondary-color';
    return null;
  }),
}));

const setupDomMocks = () => {
  const mockElements: Record<string, HTMLElement> = {};

  document.getElementById = jest.fn().mockImplementation((id: string) => {
    return mockElements[id] || null;
  });

  const createMockElement = (id: string, top: number, height: number) => {
    const element = {
      id,
      getBoundingClientRect: () => ({ top }),
      offsetHeight: height,
    } as unknown as HTMLElement;

    mockElements[id] = element;
    return element;
  };

  const mockHeader = {
    offsetHeight: 80,
  } as unknown as HTMLElement;

  document.querySelector = jest.fn().mockImplementation((selector: string) => {
    if (selector === 'header') return mockHeader;
    return null;
  });

  Object.defineProperty(window, 'scrollY', { value: 10 });
  document.documentElement.scrollTop = 10;

  const observeMock = jest.fn();
  const disconnectMock = jest.fn();
  const unobserveMock = jest.fn();

  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: observeMock,
    disconnect: disconnectMock,
    unobserve: unobserveMock,
  }));

  window.addEventListener = jest.fn();
  window.removeEventListener = jest.fn();

  return {
    createMockElement,
    mockElements,
    observeMock,
    disconnectMock,
    unobserveMock,
  };
};

describe('usePageBackground hook', () => {
  const { createMockElement, observeMock, disconnectMock } = setupDomMocks();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should correctly parse separator IDs from string', () => {
    const config1 = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              colorSeparatorId: { value: 'id1;id2; id3 ; id4' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    createMockElement('id1', 100, 50);

    const { result: result1 } = renderHook(() => usePageBackground(config1, null));

    act(() => {
      jest.runAllTimers();
    });

    expect(result1.current?.topColorOffset).toBe(135); // 110 (top + scrollY) + 25 (height/2)

    const config2 = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              colorSeparatorId: { value: '' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const originalWarn = console.warn;
    console.warn = jest.fn();

    const { result: result2 } = renderHook(() => usePageBackground(config2, null));

    expect(result2.current?.topColorOffset).toBe('calc(50% + 40px)');

    const config3 = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              colorSeparatorId: undefined,
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const { result: result3 } = renderHook(() => usePageBackground(config3, null));

    expect(result3.current?.topColorOffset).toBe('calc(50% + 40px)');

    console.warn = originalWarn;
  });

  it('should return null when background is not provided', () => {
    const config = {} as BackgroundConfigItem;
    const tenant = null;

    const { result } = renderHook(() => usePageBackground(config, tenant));

    expect(result.current).toEqual({
      topColor: null,
      baseColor: null,
      topColorOffset: 'calc(50% + 40px)',
    });
  });

  it('should extract colors from background configuration', () => {
    const config = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              colorSeparatorId: { value: '' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const tenant = null;

    const { result } = renderHook(() => usePageBackground(config, tenant));

    expect(result.current).toEqual({
      topColor: '#ff0000',
      baseColor: '#00ff00',
      topColorOffset: 'calc(50% + 40px)', // This is the fallback value
    });
  });

  it('should use theme colors when direct colors are not provided', () => {
    const config = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              themeBackgroundColorTop: { value: 'primary' },
              themeBackgroundColorBase: { value: 'secondary' },
              colorSeparatorId: { value: '' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const tenant = {} as CmsTenant;

    const { result } = renderHook(() => usePageBackground(config, tenant));

    expect(result.current).toEqual({
      topColor: '#primary-color',
      baseColor: '#secondary-color',
      topColorOffset: 'calc(50% + 40px)', // This is the fallback value
    });
  });

  it('should calculate separator offset when separator ID is provided', () => {
    const separatorElement = createMockElement('test-separator', 100, 50);

    const config = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              colorSeparatorId: { value: 'test-separator' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const tenant = null;

    const { result } = renderHook(() => usePageBackground(config, tenant));

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toEqual({
      topColor: '#ff0000',
      baseColor: '#00ff00',
      topColorOffset: 135,
    });
  });

  it('should handle multiple separator IDs and use the first found', () => {
    createMockElement('first-separator', 100, 50);
    createMockElement('second-separator', 200, 60);

    const config = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              colorSeparatorId: { value: 'missing-separator;first-separator;second-separator' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const tenant = null;

    const { result } = renderHook(() => usePageBackground(config, tenant));

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toEqual({
      topColor: '#ff0000',
      baseColor: '#00ff00',
      topColorOffset: 135, // absoluteTop (110) + height/2 (25) = 135
    });
  });

  it('should use fallback when no separator elements are found', () => {
    const config = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              colorSeparatorId: { value: 'missing-separator' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const tenant = null;

    const originalWarn = console.warn;
    console.warn = jest.fn();

    const { result } = renderHook(() => usePageBackground(config, tenant));

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toEqual({
      topColor: '#ff0000',
      baseColor: '#00ff00',
      topColorOffset: 'calc(50% + 40px)', // 50% + headerHeight/2 (80/2)
    });

    console.warn = originalWarn;
  });

  it('should prioritize direct colors over theme colors when both are provided', () => {
    const config = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              themeBackgroundColorTop: { value: 'primary' },
              themeBackgroundColorBase: { value: 'secondary' },
              colorSeparatorId: { value: '' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const tenant = {} as CmsTenant;

    const { result } = renderHook(() => usePageBackground(config, tenant));

    expect(result.current).toEqual({
      topColor: '#ff0000',
      baseColor: '#00ff00',
      topColorOffset: 'calc(50% + 40px)', // This is the fallback value
    });
  });

  it('should set up and clean up observers correctly', () => {
    const separatorElement = createMockElement('test-separator', 100, 50);

    const config = {
      elements: {
        backgroundConfigItemElement: {
          values: [
            {
              backgroundColorTop: { value: '#ff0000' },
              backgroundColorBase: { value: '#00ff00' },
              colorSeparatorId: { value: 'test-separator' },
            },
          ],
        },
      },
    } as unknown as BackgroundConfigItem;

    const tenant = null;

    const { result, unmount } = renderHook(() => usePageBackground(config, tenant));

    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    expect(observeMock).toHaveBeenCalledTimes(2); // body and separator

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    expect(disconnectMock).toHaveBeenCalled();
  });
});
