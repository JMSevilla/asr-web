import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { useContentScroller } from '../../../../components/header/accountMenu/hooks';

describe('useContentScroller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with bottomReached as false', () => {
    const { result } = renderHook(() => useContentScroller(true));
    expect(result.current.bottomReached).toBe(false);
    expect(result.current.ref).toBeDefined();
  });

  it('should not add event listener when not open', () => {
    const mockElement = document.createElement('div');
    const addEventListenerSpy = jest.spyOn(mockElement, 'addEventListener');

    jest.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

    renderHook(() => useContentScroller(false));
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('should add and remove event listener when open', () => {
    const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(Element.prototype, 'removeEventListener');

    const mockElement = document.createElement('div');
    jest.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

    const { unmount } = renderHook(() => useContentScroller(true));

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should set bottomReached to true when scrolled to bottom', () => {
    const mockElement = document.createElement('div');

    Object.defineProperties(mockElement, {
      scrollHeight: { value: 100 },
      clientHeight: { value: 100 }, // Equal to scrollHeight means we're at the bottom
      scrollTop: { value: 0 },
    });

    jest.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

    const { result } = renderHook(() => useContentScroller(true));

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.bottomReached).toBe(true);
  });

  it('should set bottomReached to false when not scrolled to bottom', () => {
    const mockElement = document.createElement('div');

    Object.defineProperties(mockElement, {
      scrollHeight: { value: 200 },
      clientHeight: { value: 100 },
      scrollTop: { value: 0 }, // Not scrolled down at all
    });

    jest.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

    const { result } = renderHook(() => useContentScroller(true));

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.bottomReached).toBe(false);
  });

  it('should set bottomReached to true when almost at the bottom (within 2px)', () => {
    const mockElement = document.createElement('div');

    Object.defineProperties(mockElement, {
      scrollHeight: { value: 100 },
      clientHeight: { value: 90 },
      scrollTop: { value: 9 }, // 9 + 90 = 99, which is within 2px of scrollHeight (100)
    });

    jest.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

    const { result } = renderHook(() => useContentScroller(true));

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.bottomReached).toBe(true);
  });
});
