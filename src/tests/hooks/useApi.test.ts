import { LoginParams } from '../../api/authentication/types';
import { useApi, useApiCallback } from '../../core/hooks/useApi';
import { act, renderHook } from '../common';

const loginParams: LoginParams = { userName: 'userName', password: 'password', realm: 'realm' };

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

describe('useApi', () => {
  describe('useApi', () => {
    it('should return the result of the api call', async () => {
      const api = { authentication: { login: jest.fn().mockResolvedValue('result') } };
      const { result, rerender } = renderHook(() => useApi(() => api.authentication.login(loginParams), [loginParams]));
      await act(async () => {
        await result.current.execute();
        rerender();
      });
      expect(result.current.result).toBe('result');
    });

    it('should return the error of the api call', async () => {
      const api = {
        authentication: { login: jest.fn().mockRejectedValue({ response: { data: { errors: [{ code: 'error' }] } } }) },
      };
      const { result, rerender } = renderHook(() => useApi(() => api.authentication.login(loginParams), [loginParams]));
      await act(async () => {
        try {
          await result.current.execute();
        } catch {}
        rerender();
      });
      expect(result.current.error).toStrictEqual(['error']);
    });
  });

  describe('useApiCallback', () => {
    it('should return the result of the api call', async () => {
      const api = { authentication: { login: jest.fn().mockResolvedValue('result') } };
      const { result, rerender } = renderHook(() => useApiCallback(() => api.authentication.login(loginParams)));
      await act(async () => {
        result.current.execute(api);
        rerender();
      });
      expect(result.current.result).toBe('result');
    });

    it('should return the error of the api call', async () => {
      const api = {
        authentication: { login: jest.fn().mockRejectedValue({ response: { data: { errors: [{ code: 'error' }] } } }) },
      };
      const { result, rerender } = renderHook(() => useApiCallback(() => api.authentication.login(loginParams)));
      await act(async () => {
        result.current.execute(api);
        rerender();
      });
      expect(result.current.error).toStrictEqual(['error']);
    });
  });
});
