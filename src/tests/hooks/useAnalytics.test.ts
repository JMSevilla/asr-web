import { AccessKey } from '../../api/mdp/types';
import { useParameterizedAnalytics } from '../../core/hooks/useAnalytics';
import { useApiCallback } from '../../core/hooks/useApi';
import { useSessionStorage } from '../../core/hooks/useSessionStorage';
import { getItem } from '../../core/session-storage';
import { renderHook } from '../common';

jest.mock('../../core/hooks/useApi', () => ({ useApiCallback: jest.fn() }));
jest.mock('../../core/session-storage', () => ({ getItem: jest.fn() }));
jest.mock('../../core/hooks/useSessionStorage', () => ({ useSessionStorage: jest.fn() }));


describe('useParameterizedAnalytics', () => {
  it('should load analytics if token and content access key are present', async () => {
    const executeFn = jest.fn();
    jest.mocked(useApiCallback).mockReturnValueOnce({ execute: executeFn } as any);
    jest.mocked(getItem).mockReturnValueOnce('token');
    jest.mocked(useSessionStorage).mockReturnValueOnce([{ contentAccessKey: 'key123' } as AccessKey, jest.fn(), jest.fn()]);

    renderHook(() => useParameterizedAnalytics('RBS'));
    expect(executeFn).toBeCalled();
  });

  it('should reset callback and reload page if there is no access token and result exists', async () => {
    const resetFn = jest.fn();
    const reloadFn = jest.fn();
    Object.defineProperty(window, 'location', { value: { reload: reloadFn } });

    jest.mocked(useApiCallback).mockReturnValueOnce({
      result: { data: 'analyticsData' },
      reset: resetFn
    } as any);
    jest.mocked(getItem).mockReturnValueOnce('');
    jest.mocked(useSessionStorage).mockReturnValueOnce([{ contentAccessKey: 'key123' } as AccessKey, jest.fn(), jest.fn()]);

    renderHook(() => useParameterizedAnalytics('RBS'));
    expect(resetFn).toBeCalled();
    expect(reloadFn).toBeCalled();
  });
});