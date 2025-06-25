// Mock ResizeObserver
class ResizeObserverMock {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe = jest.fn((target: Element) => {
    // Create entries array with the target element and trigger callback
    const entry = {
      target,
      contentRect: { width: target.clientWidth, height: target.clientHeight },
    } as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  });

  unobserve = jest.fn();
  disconnect = jest.fn();
}

// Override the global ResizeObserver
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
