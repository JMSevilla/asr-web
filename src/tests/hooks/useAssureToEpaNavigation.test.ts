import { useTenantContext } from '../../core/contexts/TenantContext';
import { useAssureToEpaNavigation } from '../../core/contexts/auth/singleAuth/hooks/useAssureToEpaNavigation';
import { useSingleAuthStorage } from '../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { useSsoOutboundUrl } from '../../core/contexts/auth/singleAuth/hooks/useSsoOutboundUrl';
import { renderHook } from '../common';


jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn(),
}));

jest.mock('../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn(),
}));

jest.mock('../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage', () => ({
  useSingleAuthStorage: jest.fn(),
}));

jest.mock('../../core/contexts/auth/singleAuth/hooks/useSsoOutboundUrl', () => ({
  useSsoOutboundUrl: jest.fn(),
}));

describe('useAssureToEpaNavigation hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: { outboundSsoUrl: { value: 'https://sso.example.com/auth' } }
    });

    (useSingleAuthStorage as jest.Mock).mockReturnValue([{
      primaryBgroup: 'WIF',
      primaryRefno: '1234567',
      memberRecord: { recordNumber: 3 },
      hasMultipleRecords: true,
      isAdmin: false
    }]);

    (useSsoOutboundUrl as jest.Mock).mockReturnValue({
      getSsoOutboundUrl: jest.fn().mockResolvedValue('https://sso.example.com/auth?params'),
      loading: false,
      error: null
    });
  });

  it('should return the original path when member record is missing', async () => {
    (useSingleAuthStorage as jest.Mock).mockReturnValue([{
      primaryBgroup: null,
      primaryRefno: null,
      memberRecord: null,
      hasMultipleRecords: false
    }]);

    const { result } = renderHook(() => useAssureToEpaNavigation());

    const path = 'https://epa.example.com/path';
    const processedPath = await result.current.prepareEpaPath(path);

    expect(processedPath).toBe(path);
  });

  it('should return the original path when tenant SSO URL is missing', async () => {
    (useTenantContext as jest.Mock).mockReturnValue({
      tenant: { outboundSsoUrl: null }
    });

    const { result } = renderHook(() => useAssureToEpaNavigation());

    const path = 'https://epa.example.com/path';
    const processedPath = await result.current.prepareEpaPath(path);

    expect(processedPath).toBe(path);
  });

  it('should use getSsoOutboundUrl correctly with member record', async () => {
    const getSsoOutboundUrlMock = jest.fn().mockResolvedValue('https://sso.example.com/processed-url');

    (useSsoOutboundUrl as jest.Mock).mockReturnValue({
      getSsoOutboundUrl: getSsoOutboundUrlMock,
      loading: false,
      error: null
    });

    const { result } = renderHook(() => useAssureToEpaNavigation());

    const path = 'https://epa.example.com/path';
    const processedPath = await result.current.prepareEpaPath(path);

    expect(processedPath).toBe('https://sso.example.com/processed-url');
    expect(getSsoOutboundUrlMock).toHaveBeenCalledWith({
      targetUrl: path,
      baseSsoUrl: 'https://sso.example.com/auth',
      recordNumber: 3,
      hasMultipleRecords: true
    });
  });

  it('should use default record number when memberRecord is missing', async () => {
    const getSsoOutboundUrlMock = jest.fn().mockResolvedValue('https://sso.example.com/processed-url');

    (useSsoOutboundUrl as jest.Mock).mockReturnValue({
      getSsoOutboundUrl: getSsoOutboundUrlMock,
      loading: false,
      error: null
    });

    (useSingleAuthStorage as jest.Mock).mockReturnValue([{
      primaryBgroup: 'WIF',
      primaryRefno: '1234567',
      memberRecord: null,
      hasMultipleRecords: false
    }]);

    const { result } = renderHook(() => useAssureToEpaNavigation());

    const path = 'https://epa.example.com/path';
    await result.current.prepareEpaPath(path);

    expect(getSsoOutboundUrlMock).toHaveBeenCalledWith({
      targetUrl: path,
      baseSsoUrl: 'https://sso.example.com/auth',
      recordNumber: 1,
      hasMultipleRecords: false
    });
  });

  it('should handle errors from getSsoOutboundUrl', async () => {
    const getSsoOutboundUrlMock = jest.fn().mockRejectedValue(new Error('SSO error'));

    (useSsoOutboundUrl as jest.Mock).mockReturnValue({
      getSsoOutboundUrl: getSsoOutboundUrlMock,
      loading: false,
      error: new Error('SSO error')
    });

    const { result } = renderHook(() => useAssureToEpaNavigation());

    const path = 'https://epa.example.com/path';
    const processedPath = await result.current.prepareEpaPath(path);

    expect(processedPath).toBe(path);
  });

  it('should expose loading and error states from useSsoOutboundUrl', () => {
    (useSsoOutboundUrl as jest.Mock).mockReturnValue({
      getSsoOutboundUrl: jest.fn(),
      loading: true,
      error: new Error('Test error')
    });

    const { result } = renderHook(() => useAssureToEpaNavigation());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toEqual(new Error('Test error'));
  });

  it('should immediately return a logout‐redirect when user is admin', async () => {
    const getSsoOutboundUrlMock = jest.fn();
    (useSsoOutboundUrl as jest.Mock).mockReturnValue({
      getSsoOutboundUrl: getSsoOutboundUrlMock,
      loading: false,
      error: null
    });

    (useSingleAuthStorage as jest.Mock).mockReturnValue([{
      primaryBgroup: 'WIF',
      primaryRefno: '9999999',
      memberRecord: null,
      hasMultipleRecords: false,
      isAdmin: true
    }]);

    const { result } = renderHook(() => useAssureToEpaNavigation());
    const path = 'https://wtw.epa.com/page-id/PYE_HOMEPAGE';
    const processed = await result.current.prepareEpaPath(path);

    expect(processed)
      .toBe(`/sa/logout?postLogoutRedirectUri=${encodeURIComponent(path)}`);
    expect(getSsoOutboundUrlMock).not.toHaveBeenCalled();
  });
});