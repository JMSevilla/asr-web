import React from 'react';
import { useBeforeUnload } from '../../core/hooks/useBeforeUnload';
import { useRouter } from '../../core/router';
import { act, renderHook } from '../common';

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() } }),
}));

describe('useBeforeUnload', () => {
  it('should call handler when is enabled route change', () => {
    const eventsOnFn = jest.fn();
    jest.mocked(useRouter).mockReturnValueOnce({ events: { on: eventsOnFn, off: jest.fn(), emit: jest.fn() } } as any);
    renderHook(() => useBeforeUnload(true, jest.fn()));
    expect(eventsOnFn).toBeCalled();
  });

  it('should not call handler when is disabled route change', () => {
    const eventsOnFn = jest.fn();
    jest.mocked(useRouter).mockReturnValueOnce({ events: { on: eventsOnFn, off: jest.fn(), emit: jest.fn() } } as any);
    renderHook(() => useBeforeUnload(false, jest.fn()));
    expect(eventsOnFn).not.toBeCalled();
  });

  it('should call router.push when route onContinueRoute called', async () => {
    const pushFn = jest.fn();
    jest
      .mocked(useRouter)
      .mockReturnValueOnce({ push: pushFn, events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() } } as any);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true as any));
    jest.spyOn(React, 'useRef').mockImplementationOnce(() => React.useRef('route'));
    const { result } = renderHook(() => useBeforeUnload(true));
    await act(async () => await result.current.continueRoute());
    expect(pushFn).toBeCalled();
  });
});
