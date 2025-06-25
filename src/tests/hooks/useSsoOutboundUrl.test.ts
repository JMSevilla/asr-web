import { useSsoOutboundUrl } from '../../core/contexts/auth/singleAuth/hooks/useSsoOutboundUrl';
import { useApiCallback } from '../../core/hooks/useApi';
import { renderHook } from '../common';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn(),
}));

describe('useSsoOutboundUrl hook', () => {
  const mockLookupCode = 'test-lookup-code';

  beforeEach(() => {
    jest.clearAllMocks();

    (useApiCallback as jest.Mock).mockImplementation((callback) => {
      const execute = jest.fn().mockImplementation((params) =>
        Promise.resolve('test-lookup-code')
      );

      return {
        execute,
        loading: false,
        error: null
      };
    });
  });

  it('should call API with correct parameters', async () => {
    const executeMock = jest.fn().mockResolvedValue('test-lookup-code');

    (useApiCallback as jest.Mock).mockImplementation(() => {
      return {
        execute: executeMock,
        loading: false,
        error: null
      };
    });

    const { result } = renderHook(() => useSsoOutboundUrl());

    await result.current.getSsoOutboundUrl({
      targetUrl: 'https://example.com/page',
      baseSsoUrl: 'https://sso.example.com/auth',
      recordNumber: 2,
      hasMultipleRecords: true
    });

    expect(executeMock).toHaveBeenCalledWith({
      recordNumber: 2,
      hasMultipleRecords: true
    });
  });

  it('should construct outbound URL with correct base URL and parameters', async () => {
    const { result } = renderHook(() => useSsoOutboundUrl());

    const url = await result.current.getSsoOutboundUrl({
      targetUrl: 'https://example.com/page?param=value',
      baseSsoUrl: 'https://sso.example.com/auth',
      recordNumber: 1,
      hasMultipleRecords: false
    });

    expect(url).toContain('https://sso.example.com/auth');
    expect(url).toContain(`lookupCode=${mockLookupCode}`);
    expect(url).toContain('relayState=');
  });

  it('should build relay state with the proper SSO path and query parameters', async () => {
    const { result } = renderHook(() => useSsoOutboundUrl());

    const url = await result.current.getSsoOutboundUrl({
      targetUrl: 'https://example.com/page?param=value&next=shouldbeignored',
      baseSsoUrl: 'https://sso.example.com/auth',
      recordNumber: 1,
      hasMultipleRecords: false
    });

    const relayStateMatch = url.match(/relayState=(.*?)(?:&|$)/);
    const relayState = relayStateMatch ? decodeURIComponent(relayStateMatch[1]) : '';
    const relayStateUrl = new URL(relayState);

    expect(relayStateUrl.pathname).toBe('/accounts/ssosamlgen/');
    expect(relayStateUrl.searchParams.get('next')).toBe('/page');
    expect(relayStateUrl.searchParams.get('param')).toBe('value');
    expect(relayStateUrl.searchParams.getAll('next').length).toBe(1);
    expect(relayStateUrl.searchParams.get('next')).not.toBe('shouldbeignored');
  });

  it('should preserve the origin in relay state URL', async () => {
    const { result } = renderHook(() => useSsoOutboundUrl());

    const url = await result.current.getSsoOutboundUrl({
      targetUrl: 'https://custom-domain.com/dashboard',
      baseSsoUrl: 'https://sso.example.com/auth',
      recordNumber: 1,
      hasMultipleRecords: false
    });

    const relayStateMatch = url.match(/relayState=(.*?)(?:&|$)/);
    const relayState = relayStateMatch ? decodeURIComponent(relayStateMatch[1]) : '';
    const relayStateUrl = new URL(relayState);

    expect(relayStateUrl.origin).toBe('https://custom-domain.com');
    expect(relayStateUrl.pathname).toBe('/accounts/ssosamlgen/');
  });

  it('should expose loading and error states', () => {
    (useApiCallback as jest.Mock).mockImplementation(() => ({
      execute: jest.fn(),
      loading: true,
      error: new Error('Test error')
    }));

    const { result } = renderHook(() => useSsoOutboundUrl());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toEqual(new Error('Test error'));
  });
});
