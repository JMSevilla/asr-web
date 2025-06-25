import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { useVisibleItemsLimiter } from '../../../components/blocks/beneficiariesList/hooks';

describe('useVisibleItemsLimiter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty items correctly', () => {
    const { result } = renderHook(() => useVisibleItemsLimiter([], 200, 20));
    expect(result.current.visibleItems).toEqual([]);
    expect(result.current.visibleItemsCount).toBeNull();
    expect(result.current.tBodyRef).toBeDefined();
  });

  it('should return all items when container height is sufficient', () => {
    const mockItems = [<div key="1">Item 1</div>, <div key="2">Item 2</div>, <div key="3">Item 3</div>];

    const mockElement = document.createElement('div');
    Object.defineProperty(mockElement, 'offsetHeight', { value: 100 });

    jest.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

    const { result } = renderHook(() => useVisibleItemsLimiter(mockItems, 200, 20));

    act(() => {
      result.current.tBodyRef.current && result.current.tBodyRef.current.dispatchEvent(new Event('resize'));
    });

    expect(result.current.visibleItems.length).toBe(3);
    expect(result.current.visibleItemsCount).toBeNull();
  });

  it('should limit items when container height is exceeded', () => {
    const mockItems = Array.from({ length: 5 }).map((_, i) => <div key={i}>{`Item ${i}`}</div>);

    let offsetHeight = 0;
    const mockElement = document.createElement('div');

    Object.defineProperty(mockElement, 'offsetHeight', {
      get: () => {
        offsetHeight += 50;
        return offsetHeight;
      },
    });

    jest.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

    const { result } = renderHook(() => useVisibleItemsLimiter(mockItems, 150, 20));

    act(() => {});

    expect(result.current.visibleItems.length).toBeLessThan(mockItems.length);
  });

  it('should add resize event listener and clean up', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useVisibleItemsLimiter([], 200, 20));

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should reset visible items when resizing', () => {
    jest.useFakeTimers();

    const mockItems = [<div key="1">Item 1</div>];
    const { result } = renderHook(() => useVisibleItemsLimiter(mockItems, 200, 20));

    act(() => {
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(100); // The debounce timeout
    });

    expect(result.current.visibleItemsCount).toBeNull();

    jest.useRealTimers();
  });
});
