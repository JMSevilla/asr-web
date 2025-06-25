import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { AxiosError } from 'axios';
import { useAccessToken } from '../../core/contexts/auth/hooks';
import { httpClient } from '../../core/hooks/useApi';
import { renderHook } from '../common';
import { useRefreshSingleAuthTokenHandler } from '../../core/hooks/useRefreshSingleAuthTokenHandler';

jest.mock('@azure/msal-react');
jest.mock('../../core/contexts/auth/hooks', () => ({
  useAccessToken: jest.fn()
}));
jest.mock('../../core/hooks/useApi', () => ({
  httpClient: { setupMiddlewareOptions: jest.fn() }
}));

describe('useRefreshSingleAuthTokenHandler', () => {
  const mockLogout = jest.fn();
  const mockSetAccessToken = jest.fn();
  const account = { homeAccountId: 'id' };
  const mockAcquireTokenSilent = jest.fn();
  const mockInstance = { acquireTokenSilent: mockAcquireTokenSilent } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useMsal as jest.Mock).mockReturnValue({ instance: mockInstance, inProgress: InteractionStatus.None, accounts: [account] });
    (useAccessToken as jest.Mock).mockReturnValue(['initial-token', mockSetAccessToken]);
  });

  it('registers error handler on mount', () => {
    renderHook(() => useRefreshSingleAuthTokenHandler(mockLogout));
    expect(httpClient.setupMiddlewareOptions).toHaveBeenCalledWith(expect.objectContaining({ onErrorHandler: expect.any(Function) }));
  });

  it('propagates non-401 errors', async () => {
    renderHook(() => useRefreshSingleAuthTokenHandler(mockLogout));
    const handler = (httpClient.setupMiddlewareOptions as jest.Mock).mock.calls[0][0].onErrorHandler;
    const error404 = { response: { status: 404 } } as AxiosError;
    await expect(handler(error404, {} as any)).rejects.toBe(error404);
    const error500 = { response: { status: 500 } } as AxiosError;
    await expect(handler(error500, {} as any)).rejects.toBe(error500);
  });

  it('logs out on invalid token', async () => {
    renderHook(() => useRefreshSingleAuthTokenHandler(mockLogout));
    const handler = (httpClient.setupMiddlewareOptions as jest.Mock).mock.calls[0][0].onErrorHandler;
    const error = {
      response: { status: 401, data: { errors: [{ code: 'ERROR_INVALID_ACCESS_TOKEN' }] } }
    } as unknown as AxiosError;
    await handler(error, {} as any);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('refreshes token on expiration and retries request', async () => {
    const fakeRequest = jest.fn().mockResolvedValue('success');
    const fakeOnRequest = jest.fn();
    const httpMock = { options: { onRequest: fakeOnRequest }, client: fakeRequest } as any;
    mockAcquireTokenSilent.mockResolvedValue({ idToken: 'new-token' });

    renderHook(() => useRefreshSingleAuthTokenHandler(mockLogout));
    const handler = (httpClient.setupMiddlewareOptions as jest.Mock).mock.calls[0][0].onErrorHandler;
    const error = {
      response: { status: 401, data: { errors: [{ code: 'ERROR_ACCESS_TOKEN_EXPIRED' }] } },
      config: { headers: {} }
    } as unknown as AxiosError;

    const result = await handler(error, httpMock);
    expect(mockAcquireTokenSilent).toHaveBeenCalledWith({ account, scopes: [], forceRefresh: true });
    expect(mockSetAccessToken).toHaveBeenCalledWith('new-token');
    expect(fakeOnRequest).toHaveBeenCalledWith(error.config);
    expect(fakeRequest).toHaveBeenCalledWith(error.config);
    await expect(result).toBe('success');
  });

  it('rejects when refresh fails', async () => {
    mockAcquireTokenSilent.mockRejectedValue(new Error('fail'));
    renderHook(() => useRefreshSingleAuthTokenHandler(mockLogout));
    const handler = (httpClient.setupMiddlewareOptions as jest.Mock).mock.calls[0][0].onErrorHandler;
    const error = {
      response: { status: 401, data: { errors: [{ code: 'ERROR_ACCESS_TOKEN_EXPIRED' }] } }
    } as unknown as AxiosError;

    await expect(handler(error, {} as any)).rejects.toBe(error);
    expect(mockLogout).toHaveBeenCalled();
  });
});
