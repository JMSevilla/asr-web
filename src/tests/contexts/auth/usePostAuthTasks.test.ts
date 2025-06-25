import { useTenantContext } from '../../../core/contexts/TenantContext';
import { useAccessToken } from '../../../core/contexts/auth/hooks';
import { authHeaders } from '../../../core/contexts/auth/singleAuth/constants';
import { usePostAuthTasks } from '../../../core/contexts/auth/singleAuth/hooks/usePostAuthTasks';
import { useSingleAuthStorage } from '../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { deleteWebchatHistory } from '../../../core/genesys';
import { httpClient, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { initializeAnalyticsUser } from '../../../core/mixpanel-tracker';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/genesys', () => ({
  deleteWebchatHistory: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  httpClient: {
    updateHeaders: jest.fn(),
  },
  useApiCallback: jest.fn(),
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn(),
}));

jest.mock('../../../core/mixpanel-tracker', () => ({
  initializeAnalyticsUser: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn(),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/hooks', () => ({
  useAccessToken: jest.fn(),
}));

jest.mock('../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage', () => ({
  useSingleAuthStorage: jest.fn(),
}));

describe('usePostAuthTasks', () => {
  const mockSetSAData = jest.fn();
  const mockRetirementInit = jest.fn();
  const mockExecuteFunctions = {
    loginCb: jest.fn(),
    registerCb: jest.fn(),
    linkedRecordsCb: jest.fn(),
    initializeJourneysCb: jest.fn(),
    analyticsParamsCb: jest.fn(),
  };
  const mockCachedAccessKey = {
    fetch: jest.fn().mockResolvedValue({
      contentAccessKey: 'test-content-key',
      schemeType: 'DB',
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useSingleAuthStorage as jest.Mock).mockReturnValue([
      { isNewAccount: 'false', authGuid: 'test-guid', isAmin: false },
      mockSetSAData,
    ]);

    (useAccessToken as jest.Mock).mockReturnValue('test-token');

    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: {
        tenantUrl: { value: 'test-tenant-url' },
        businessGroup: { values: ['WIF'] },
      },
    });

    (useRetirementContext as jest.Mock).mockReturnValue({
      init: mockRetirementInit,
    });

    (useApiCallback as jest.Mock).mockImplementation(() => {
      return {
        execute: mockExecuteFunctions.loginCb.mockResolvedValue({
          status: 200,
          data: {
            businessGroup: 'WIF',
            referenceNumber: '0000001',
            hasMultipleRecords: false,
          },
        }),
      };
    });

    (useCachedAccessKey as jest.Mock).mockReturnValue(mockCachedAccessKey);

    (useApiCallback as jest.Mock).mockImplementation(callback => {
      if (callback.toString().includes('singleAuthLogin')) {
        return {
          execute: mockExecuteFunctions.loginCb.mockResolvedValue({
            status: 200,
            data: {
              businessGroup: 'WIF',
              referenceNumber: '0000001',
              hasMultipleRecords: false,
            },
          }),
        };
      } else if (callback.toString().includes('singleAuthRegister')) {
        return {
          execute: mockExecuteFunctions.registerCb.mockResolvedValue({
            status: 204,
          }),
        };
      } else if (callback.toString().includes('linkedRecords')) {
        return {
          execute: mockExecuteFunctions.linkedRecordsCb,
        };
      } else if (callback.toString().includes('initializeJourneys')) {
        return {
          execute: mockExecuteFunctions.initializeJourneysCb.mockResolvedValue({
            status: 200,
          }),
        };
      } else if (callback.toString().includes('analyticsParams')) {
        return {
          execute: mockExecuteFunctions.analyticsParamsCb,
        };
      }
      return { execute: jest.fn() };
    });

    (initializeAnalyticsUser as jest.Mock).mockResolvedValue(undefined);
  });

  test('should execute login flow for existing user successfully', async () => {
    const { result } = renderHook(() => usePostAuthTasks());

    await act(async () => {
      await result.current.execute();
    });

    expect(httpClient.updateHeaders).toHaveBeenCalledWith({
      [authHeaders.bgroup]: 'WIF',
      [authHeaders.refno]: '0000001',
    });

    expect(mockExecuteFunctions.loginCb).toHaveBeenCalled();
    expect(mockExecuteFunctions.registerCb).not.toHaveBeenCalled();

    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));

    expect(mockExecuteFunctions.initializeJourneysCb.mock.calls.length).toBe(1);
    expect(mockRetirementInit).toHaveBeenCalled();
    expect(deleteWebchatHistory).toHaveBeenCalled();
    expect(initializeAnalyticsUser).toHaveBeenCalledWith(
      expect.anything(),
      'sa post sign-in success',
      'test-content-key',
      'WIF0000001',
      'test-guid',
    );
  });

  test('should execute registration flow for new user successfully', async () => {
    (useSingleAuthStorage as jest.Mock).mockReturnValue([
      { isNewAccount: 'true', authGuid: 'test-guid' },
      mockSetSAData,
    ]);

    const { result } = renderHook(() => usePostAuthTasks());

    await act(async () => {
      await result.current.execute();
    });

    expect(mockExecuteFunctions.registerCb).toHaveBeenCalled();
    expect(mockExecuteFunctions.loginCb).toHaveBeenCalled();
    expect(mockCachedAccessKey.fetch).toHaveBeenCalledWith('full');

    expect(initializeAnalyticsUser).toHaveBeenCalledWith(
      expect.anything(),
      'sa post registration success',
      'test-content-key',
      'WIF0000001',
      'test-guid',
    );
  });

  test('should handle multiple records correctly', async () => {
    mockExecuteFunctions.linkedRecordsCb = jest.fn().mockResolvedValue({
      status: 200,
      data: {
        members: [
          {
            businessGroup: 'WIF',
            referenceNumber: '0000001',
          },
          {
            businessGroup: 'WIF',
            referenceNumber: '0000002',
          },
        ],
      },
    });

    (useApiCallback as jest.Mock).mockImplementation(callback => {
      if (callback.toString().includes('singleAuthLogin')) {
        return {
          execute: jest.fn().mockResolvedValue({
            status: 200,
            data: {
              businessGroup: 'WIF',
              referenceNumber: '0000001',
              hasMultipleRecords: true,
            },
          }),
        };
      } else if (callback.toString().includes('linkedRecords')) {
        return {
          execute: mockExecuteFunctions.linkedRecordsCb,
        };
      }
      (useCachedAccessKey as jest.Mock).mockReturnValue(mockCachedAccessKey.fetch);
      // For other APIs, return a simple successful mock
      return {
        execute: jest.fn().mockResolvedValue({
          status: 200,
          data: {},
        }),
      };
    });

    const { result } = renderHook(() => usePostAuthTasks());

    await act(async () => {
      await result.current.execute();
    });

    expect(mockExecuteFunctions.linkedRecordsCb).toHaveBeenCalled();
    expect(mockCachedAccessKey.fetch).toHaveBeenCalledWith('basic-mode');
    expect(mockSetSAData).toHaveBeenCalledWith(expect.any(Function));
  });

  test('should handle errors correctly', async () => {
    (useApiCallback as jest.Mock).mockImplementation(callback => {
      if (callback.toString().includes('singleAuthLogin')) {
        return {
          execute: jest.fn().mockResolvedValue({
            status: 401,
            data: null,
          }),
        };
      }

      return { execute: jest.fn() };
    });

    const { result } = renderHook(() => usePostAuthTasks());

    await act(async () => {
      await expect(result.current.execute()).rejects.toThrow('Login API failed');
    });

    expect(result.current.isRunning).toBe(false);
  });

  test('should throw error when access token is missing', async () => {
    (useAccessToken as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => usePostAuthTasks());

    await act(async () => {
      await expect(result.current.execute()).rejects.toThrow('Access token not found');
    });
  });

  describe('getEffectiveRefno logic', () => {
    const mockApiRefno = '0000001';

    beforeEach(() => {
      (useApiCallback as jest.Mock).mockImplementation(callback => {
        if (callback.toString().includes('singleAuthLogin')) {
          return {
            execute: jest.fn().mockResolvedValue({
              status: 200,
              data: {
                businessGroup: 'WIF',
                referenceNumber: mockApiRefno,
                hasMultipleRecords: false,
              },
            }),
          };
        }
        return { execute: jest.fn() };
      });
    });

    test('should use apiRefno when nextUrl is not provided', async () => {
      (useSingleAuthStorage as jest.Mock).mockReturnValue([
        {
          isNewAccount: 'false',
          authGuid: 'test-guid',
          nextUrl: null,
          primaryRefno: '9999999',
        },
        mockSetSAData,
      ]);

      const { result } = renderHook(() => usePostAuthTasks());

      await act(async () => {
        await result.current.execute();
      });

      expect(httpClient.updateHeaders).toHaveBeenCalledWith({
        [authHeaders.bgroup]: 'WIF',
        [authHeaders.refno]: mockApiRefno,
      });
    });

    test('should use registration code refno when available with nextUrl and isAdmin', async () => {
      (useSingleAuthStorage as jest.Mock).mockReturnValue([
        {
          isNewAccount: 'false',
          authGuid: 'test-guid',
          nextUrl: '/dashboard',
          registrationCode: 'WIF7777777',
          primaryRefno: '9999999',
          isAdmin: true,
        },
        mockSetSAData,
      ]);

      const { result } = renderHook(() => usePostAuthTasks());

      await act(async () => {
        await result.current.execute();
      });

      expect(httpClient.updateHeaders).toHaveBeenCalledWith({
        [authHeaders.bgroup]: 'WIF',
        [authHeaders.refno]: '7777777',
      });
    });

    test('should use primaryRefno when nextUrl exists but no registration code', async () => {
      (useSingleAuthStorage as jest.Mock).mockReturnValue([
        {
          isNewAccount: 'false',
          authGuid: 'test-guid',
          nextUrl: '/dashboard',
          registrationCode: null,
          primaryRefno: '9999999',
        },
        mockSetSAData,
      ]);

      const { result } = renderHook(() => usePostAuthTasks());

      await act(async () => {
        await result.current.execute();
      });

      expect(httpClient.updateHeaders).toHaveBeenCalledWith({
        [authHeaders.bgroup]: 'WIF',
        [authHeaders.refno]: '9999999',
      });
    });

    test('should use apiRefno as fallback when nextUrl exists but no registrationCode or primaryRefno', async () => {
      (useSingleAuthStorage as jest.Mock).mockReturnValue([
        {
          isNewAccount: 'false',
          authGuid: 'test-guid',
          nextUrl: '/dashboard',
          registrationCode: null,
          primaryRefno: null,
        },
        mockSetSAData,
      ]);

      const { result } = renderHook(() => usePostAuthTasks());

      await act(async () => {
        await result.current.execute();
      });

      expect(httpClient.updateHeaders).toHaveBeenCalledWith({
        [authHeaders.bgroup]: 'WIF',
        [authHeaders.refno]: mockApiRefno,
      });
    });

    test('should update SA data with effective refno', async () => {
      (useSingleAuthStorage as jest.Mock).mockReturnValue([
        {
          isNewAccount: 'false',
          authGuid: 'test-guid',
          nextUrl: '/dashboard',
          registrationCode: 'WIF7777777',
          primaryRefno: null,
        },
        mockSetSAData,
      ]);

      const { result } = renderHook(() => usePostAuthTasks());

      await act(async () => {
        await result.current.execute();
      });

      expect(mockSetSAData).toHaveBeenCalled();
      const updaterFunction = mockSetSAData.mock.calls[0][0];
      const updatedState = updaterFunction({
        nextUrl: '/dashboard',
        registrationCode: 'WIF7777777',
        primaryRefno: null,
        linkedRefno: '8888888',
      });

      expect(updatedState).toEqual(
        expect.objectContaining({
          primaryBgroup: 'WIF',
          primaryRefno: '0000001',
          linkedBgroup: 'WIF',
          linkedRefno: '8888888',
        }),
      );
    });
  });
});
