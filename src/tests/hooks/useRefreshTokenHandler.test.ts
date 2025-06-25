import { renderHook } from '../common';
import { useAccessToken, useRefreshToken } from "../../core/contexts/auth/hooks";
import { httpClient, useApiCallback } from "../../core/hooks/useApi";
import { useRefreshTokenHandler } from '../../core/hooks/useRefreshTokenHandler';
import { AxiosError } from 'axios';
import Http from '../../core/http-client';

jest.mock('../../core/hooks/useApi', () => ({
  httpClient: { setupMiddlewareOptions: jest.fn() },
  useApiCallback: jest.fn(),
}));

jest.mock('../../core/contexts/auth/hooks', () => ({
  useAccessToken: jest.fn(),
  useRefreshToken: jest.fn(),
}));

describe('useRefreshTokenHandler', () => {
  const mockLogout = jest.fn();
  const mockSetAccessToken = jest.fn();
  const mockSetRefreshToken = jest.fn();
  const mockExecute = jest.fn();
  const fakeCallback = { execute: mockExecute };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAccessToken as jest.Mock).mockReturnValue(['old-access', mockSetAccessToken]);
    (useRefreshToken as jest.Mock).mockReturnValue(['old-refresh', mockSetRefreshToken]);
    (useApiCallback as jest.Mock).mockReturnValue(fakeCallback);
  });

  it('registers error handler on mount', () => {
    renderHook(() => useRefreshTokenHandler(mockLogout));
    expect(httpClient.setupMiddlewareOptions).toHaveBeenCalledWith(
      expect.objectContaining({ onErrorHandler: expect.any(Function) })
    );
  });

  it('propagates non-401 errors', async () => {
    renderHook(() => useRefreshTokenHandler(mockLogout));
    const handler = (httpClient.setupMiddlewareOptions as jest.Mock).mock.calls[0][0].onErrorHandler;
    const error404 = { response: { status: 404 } } as AxiosError;
    await expect(handler(error404, {} as Http)).rejects.toBe(error404);
    const error500 = { response: { status: 500 } } as AxiosError;
    await expect(handler(error500, {} as Http)).rejects.toBe(error500);
  });

  it('logs out on invalid token', async () => {
    renderHook(() => useRefreshTokenHandler(mockLogout));
    const handler = (httpClient.setupMiddlewareOptions as jest.Mock).mock.calls[0][0].onErrorHandler;
    const error = {
      response: { status: 401, data: { errors: [{ code: 'ERROR_INVALID_ACCESS_TOKEN' }] } }
    } as unknown as AxiosError;
    await handler(error, {} as Http);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('refreshes token on expiration and retries request', async () => {
    const fakeClient = jest.fn().mockResolvedValue('done');
    const fakeOnRequest = jest.fn();
    const httpMock = { options: { onRequest: fakeOnRequest }, client: fakeClient } as unknown as Http;

    mockExecute.mockResolvedValue({ data: { accessToken: 'new-access', refreshToken: 'new-refresh' } });

    renderHook(() => useRefreshTokenHandler(mockLogout));
    const handler = (httpClient.setupMiddlewareOptions as jest.Mock).mock.calls[0][0].onErrorHandler;
    const error = {
      response: { status: 401, data: { errors: [{ code: 'ERROR_ACCESS_TOKEN_EXPIRED' }] } },
      config: { headers: {} }
    } as unknown as AxiosError;

    const result = await handler(error, httpMock);

    expect(mockExecute).toHaveBeenCalledWith({ accessToken: 'old-access', refreshToken: 'old-refresh' });
    expect(mockSetAccessToken).toHaveBeenCalledWith('new-access');
    expect(mockSetRefreshToken).toHaveBeenCalledWith('new-refresh');
    expect(fakeOnRequest).toHaveBeenCalledWith(error.config);
    expect(fakeClient).toHaveBeenCalledWith(error.config);
    expect(result).toBe('done');
  });

  it('rejects when refresh fails', async () => {
    mockExecute.mockRejectedValue(new Error('fail'));
    renderHook(() => useRefreshTokenHandler(mockLogout));
    const handler = (httpClient.setupMiddlewareOptions as jest.Mock).mock.calls[0][0].onErrorHandler;
    const error = {
      response: { status: 401, data: { errors: [{ code: 'ERROR_ACCESS_TOKEN_EXPIRED' }] } }
    } as unknown as AxiosError;

    await expect(handler(error, {} as Http)).rejects.toBe(error);
    expect(mockLogout).toHaveBeenCalled();
  });
});
