import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import { useCardTableRowLimit } from '../../../../components/table/data-table/hooks/useCardTableRowLimit';

jest.mock('../../../../components/blocks/card/utils', () => ({
  replaceCharacter: jest.fn(arr => arr),
}));

describe('useCardTableRowLimit', () => {
  const mockData = [
    { id: 1, age: '25' },
    { id: 2, age: '30' },
    { id: 3, age: '35' },
    { id: 4, age: '40' },
    { id: 5, age: '45' },
  ];

  const setupDomMocks = () => {
    const mockCardContent = document.createElement('div');
    Object.defineProperty(mockCardContent, 'clientHeight', { value: 300 });
    mockCardContent.classList.add('card-content');

    const mockTableContainer = document.createElement('div');

    const mockThead = document.createElement('thead');
    Object.defineProperty(mockThead, 'offsetHeight', { value: 40 });

    const mockTbody = document.createElement('tbody');

    const mockTr = document.createElement('tr');
    Object.defineProperty(mockTr, 'offsetHeight', { value: 50 });

    mockTbody.appendChild(mockTr);
    mockTableContainer.appendChild(mockThead);
    mockTableContainer.appendChild(mockTbody);
    mockCardContent.appendChild(mockTableContainer);
    document.body.appendChild(mockCardContent);

    mockTableContainer.querySelector = jest.fn().mockImplementation(selector => {
      if (selector === 'tbody') return mockTbody;
      if (selector === 'thead') return mockThead;
      return null;
    });
    mockTbody.querySelectorAll = jest.fn().mockReturnValue([mockTr]);
    mockTableContainer.closest = jest.fn().mockReturnValue(mockCardContent);

    return {
      mockTableContainer,
      mockCardContent,
      cleanup: () => {
        document.body.removeChild(mockCardContent);
      },
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return original data when isCard is false', () => {
    const { result } = renderHook(() => useCardTableRowLimit({ isCard: false, data: mockData }));

    expect(result.current.limitedData).toEqual(mockData);
  });

  it('should return original data when container is not set', () => {
    const { result } = renderHook(() => useCardTableRowLimit({ isCard: true, data: mockData }));

    expect(result.current.limitedData).toEqual(mockData);
  });

  it('should limit data based on container measurements when isCard is true', () => {
    const { mockTableContainer, cleanup } = setupDomMocks();

    const { result } = renderHook(() => useCardTableRowLimit({ isCard: true, data: mockData }));

    act(() => {
      result.current.containerRef(mockTableContainer);
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.limitedData.length).toBeLessThanOrEqual(3);

    cleanup();
  });

  it('should handle empty data gracefully', () => {
    const { result } = renderHook(() => useCardTableRowLimit({ isCard: true, data: [] }));

    expect(result.current.limitedData).toEqual([]);
  });

  it('should clean up resources when unmounting', () => {
    const { mockTableContainer, cleanup } = setupDomMocks();

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const mockDisconnect = jest.fn();
    const mockObserve = jest.fn();

    class MockMutationObserver {
      callback: MutationCallback;

      constructor(callback: MutationCallback) {
        this.callback = callback;
      }

      disconnect = mockDisconnect;
      observe = mockObserve;
      takeRecords = jest.fn(() => []);
    }

    const originalMutationObserver = global.MutationObserver;
    global.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;

    const { result, unmount } = renderHook(() => useCardTableRowLimit({ isCard: true, data: mockData }));

    act(() => {
      result.current.containerRef(mockTableContainer);
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockObserve).toHaveBeenCalled();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockDisconnect).toHaveBeenCalled();

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    global.MutationObserver = originalMutationObserver;
    cleanup();
  });

  it('should not recalculate when loading is true', () => {
    const { mockTableContainer, cleanup } = setupDomMocks();

    type LoadingProps = { loading: boolean };

    const { result, rerender } = renderHook(
      ({ loading }: LoadingProps) => useCardTableRowLimit({ isCard: true, data: mockData, loading }),
      { initialProps: { loading: false } as LoadingProps },
    );

    act(() => {
      result.current.containerRef(mockTableContainer);
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const initialLimitedData = result.current.limitedData;

    const replaceCharacter = require('../../../../components/blocks/card/utils').replaceCharacter;
    replaceCharacter.mockClear();

    rerender({ loading: true });

    act(() => {
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(200);
    });

    expect(replaceCharacter).not.toHaveBeenCalled();

    cleanup();
  });

  it('should recalculate when data changes', () => {
    const { mockTableContainer, cleanup } = setupDomMocks();

    type DataProps<T> = { data: T[] };

    const { result, rerender } = renderHook(
      ({ data }: DataProps<(typeof mockData)[0]>) => useCardTableRowLimit({ isCard: true, data }),
      { initialProps: { data: mockData } as DataProps<(typeof mockData)[0]> },
    );

    act(() => {
      result.current.containerRef(mockTableContainer);
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const newData = [...mockData, { id: 6, age: '50' }];
    rerender({ data: newData });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.limitedData.length).toBeLessThanOrEqual(3);

    cleanup();
  });
});
