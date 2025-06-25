import { act } from '@testing-library/react';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { useTenantContext } from '../../core/contexts/TenantContext';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useContentDataContext } from '../../core/contexts/contentData/ContentDataContext';
import { useApiCallback } from '../../core/hooks/useApi';
import * as genesysModule from '../../core/hooks/useGenesys';
import { useGenesys } from '../../core/hooks/useGenesys';
import { renderHook, waitFor } from '../common';

jest.mock('../../config', () => ({
  config: {
    value: {
      GENESYS_DEPLOYMENT_ID: 'YmFzZTY0LWRlcGxveW1lbnQtaWQtZmFrZQ==', // dummy base64
      GENESYS_JS_URL: 'https://example.com/genesys.js',
      ENVIRONMENT: 'uat',
    },
  },
}));

jest.mock('../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: null }),
}));
jest.mock('../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null }),
}));
jest.mock('../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn().mockReturnValue({ tenant: null }),
}));
jest.mock('../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: jest.fn().mockReturnValue({ isAuthenticated: false }),
}));
jest.mock('../../core/genesys', () => ({
  setupGenesysGlobals: jest.fn(),
  insertScriptElement: jest.fn().mockResolvedValue(undefined),
  isScriptLoaded: jest.fn().mockReturnValue(false),
  subscribeToGenesysEvents: jest.fn().mockResolvedValue(undefined),
  isWebChatActive: jest.fn().mockReturnValue(false),
  subscribeToEvent: jest.fn(),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn(),
}));

describe('useGenesys', () => {
  beforeEach(() => {
    (window as any).Genesys = jest.fn();
    jest.clearAllMocks();
  });

  it('should initialize and load Genesys script', async () => {
    jest.mocked(useTenantContext).mockReturnValue({
      tenant: {
        businessGroup: { elementType: 'test', values: ['testbgroup'] },
      },
    } as any);
    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: 'contentAccessKey',
      },
    } as any);
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);
    const getDeploymentIdMock = jest.spyOn(genesysModule, 'getDeploymentId');
    getDeploymentIdMock.mockImplementation(() => 'mockedDeploymentId');
    const { result } = renderHook(() => useGenesys());
    await waitFor(() => {
      expect(result.current.shouldHideDefaultChat).toBe(false);
    });
  });

  it('should not initialize and load Genesys script', async () => {
    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: null,
      },
    } as any);
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: false } as any);
    const { result } = renderHook(() => useGenesys());
    await waitFor(() => {
      expect(result.current.shouldHideDefaultChat).toBe(false);
    });
  });

  it('should start Genesys without intent when startTalk is called', async () => {
    jest.mocked(useTenantContext).mockReturnValue({
      tenant: {
        businessGroup: { elementType: 'test', values: ['testbgroup'] },
      },
    } as any);

    jest.mocked(useContentDataContext).mockReturnValue({
      membership: {
        referenceNumber: '12345678',
      },
    } as any);

    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: JSON.stringify({ isWebChatEnabled: true }),
      },
    } as any);

    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);

    const genesysCore = require('../../core/genesys');
    (genesysCore.isScriptLoaded as jest.Mock).mockReturnValue(true);
    (genesysCore.subscribeToEvent as jest.Mock).mockImplementation((_, cb) => cb());

    jest.spyOn(genesysModule, 'getDeploymentId').mockReturnValue('mockedDeploymentId');

    const { result } = renderHook(() => useGenesys());

    await act(async () => {
      await result.current.startTalk();
    });

    expect((window as any).Genesys).toHaveBeenCalledWith(
      'command',
      'Database.set',
      expect.objectContaining({
        messaging: expect.objectContaining({
          customAttributes: expect.objectContaining({
            bgroup: 'testbgroup',
            referenceNumber: '12345678',
            platform: 'assure',
          }),
        }),
      }),
    );

    expect((window as any).Genesys).not.toHaveBeenCalledWith(
      'command',
      'Database.set',
      expect.objectContaining({
        messaging: expect.objectContaining({ intent: expect.anything() }),
      }),
    );
  });

  it('should set Genesys intent when intent context is valid', async () => {
    const futureTtl = `${Math.floor(Date.now() / 1000 + 60)}`;
    const executeMock = jest.fn().mockResolvedValue({
      data: { intent: 'testIntent', ttl: futureTtl },
    });
    (useApiCallback as jest.Mock).mockReturnValue({ execute: executeMock });

    jest.mocked(useTenantContext).mockReturnValue({
      tenant: {
        businessGroup: { elementType: 'test', values: ['testbgroup'] },
      },
    } as any);

    jest.mocked(useContentDataContext).mockReturnValue({
      membership: {
        referenceNumber: '12345678',
      },
    } as any);

    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: JSON.stringify({ isWebChatEnabled: true }),
      },
    } as any);

    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);

    const genesysCore = require('../../core/genesys');
    (genesysCore.isScriptLoaded as jest.Mock).mockReturnValue(true);

    (genesysCore.subscribeToEvent as jest.Mock).mockImplementation((_, cb) => cb());

    jest.spyOn(genesysModule, 'getDeploymentId').mockReturnValue('mockedDeploymentId');

    const { result } = renderHook(() => useGenesys());

    let intentFound: boolean = false;
    await act(async () => {
      intentFound = await result.current.checkIntentAndStartGenesys();
    });

    expect(intentFound).toBe(true);
    expect((window as any).Genesys).toHaveBeenCalledWith(
      'command',
      'Database.set',
      expect.objectContaining({
        messaging: expect.objectContaining({ intent: 'testIntent' }),
      }),
    );
  });

  it('should NOT set Genesys intent when TTL is expired', async () => {
    const pastTtl = `${Math.floor(Date.now() / 1000 - 60)}`;
    const executeMock = jest.fn().mockResolvedValue({
      data: { intent: 'expiredIntent', ttl: pastTtl },
    });
    (useApiCallback as jest.Mock).mockReturnValue({ execute: executeMock });

    jest.mocked(useTenantContext).mockReturnValue({
      tenant: {
        businessGroup: { elementType: 'test', values: ['testbgroup'] },
      },
    } as any);

    jest.mocked(useContentDataContext).mockReturnValue({
      membership: {
        referenceNumber: '12345678',
      },
    } as any);

    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: JSON.stringify({ isWebChatEnabled: true }),
      },
    } as any);

    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);

    const genesysCore = require('../../core/genesys');
    (genesysCore.isScriptLoaded as jest.Mock).mockReturnValue(true);
    (genesysCore.subscribeToEvent as jest.Mock).mockImplementation((_, cb) => cb());

    jest.spyOn(genesysModule, 'getDeploymentId').mockReturnValue('mockedDeploymentId');

    const { result } = renderHook(() => useGenesys());

    let intentFoundExpired: boolean = true;
    await act(async () => {
      intentFoundExpired = await result.current.checkIntentAndStartGenesys();
    });

    expect(intentFoundExpired).toBe(false);
    expect((window as any).Genesys).not.toHaveBeenCalled();
  });

  it('should return false when checkIntentAndStartGenesys is called with no intent', async () => {
    const executeMock = jest.fn().mockResolvedValue({ data: null });
    (useApiCallback as jest.Mock).mockReturnValue({ execute: executeMock });

    jest.mocked(useTenantContext).mockReturnValue({
      tenant: {
        businessGroup: { elementType: 'test', values: ['testbgroup'] },
      },
    } as any);

    jest.mocked(useContentDataContext).mockReturnValue({
      membership: {
        referenceNumber: '12345678',
      },
    } as any);

    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: JSON.stringify({ isWebChatEnabled: true }),
      },
    } as any);

    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);

    jest.spyOn(genesysModule, 'getDeploymentId').mockReturnValue('mockedDeploymentId');

    const { result } = renderHook(() => useGenesys());

    let intentFoundNoIntent: boolean = true;
    await act(async () => {
      intentFoundNoIntent = await result.current.checkIntentAndStartGenesys();
    });

    expect(intentFoundNoIntent).toBe(false);
    expect((window as any).Genesys).not.toHaveBeenCalled();
  });
});
