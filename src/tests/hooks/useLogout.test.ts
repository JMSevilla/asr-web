import { usePageLoaderContext } from '../../core/contexts/PageLoaderContext';
import { useTenantContext } from '../../core/contexts/TenantContext';
import { useLogout } from '../../core/hooks/useLogout';
import { useRouter } from '../../core/router';
import { act, renderHook } from '../common';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: {
    value: {
      EPA_DOMAIN_NAME: 'https://api_url',
    },
  },
}));

jest.mock('../../core/contexts/PageLoaderContext', () => ({
  usePageLoaderContext: jest.fn().mockReturnValue({ setIsLoading: jest.fn() }),
}));

jest.mock('../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn().mockReturnValue({ tenant: { logoutUrl: null, primaryColor: { value: '#000' } } }),
}));

jest.mock('../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: jest.fn().mockReturnValue({ logout: jest.fn() }),
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    replace: jest.fn(),
    staticRoutes: {
      epa_expired_session_url: 'epa_expired_session_url',
      epa_logout_url: 'epa_logout_url',
    },
    getLogoutUrl: jest.fn().mockReturnValue('https://url'),
  }),
}));

describe('useLogout', () => {
  it('should call setIsLoading function twice', async () => {
    const setLoadingFn = jest.fn();
    jest
      .mocked(useRouter)
      .mockReturnValueOnce({ replace: jest.fn(), getLogoutUrl: jest.fn().mockReturnValue('') } as any);
    jest.mocked(usePageLoaderContext).mockReturnValueOnce({ setIsLoading: setLoadingFn } as any);
    const { result } = renderHook(() => useLogout());
    await act(async () => await result.current.logout());
    expect(setLoadingFn).toBeCalledTimes(2);
  });

  it('should call window.location.replace when logoutUrl exist', async () => {
    const locationReplaceFn = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { replace: locationReplaceFn },
    });
    jest.mocked(useTenantContext).mockReturnValueOnce({ tenant: { logoutUrl: { value: 'url' } } } as any);
    const { result } = renderHook(() => useLogout());
    await act(async () => await result.current.logout());
    expect(locationReplaceFn).toBeCalledTimes(1);
  });

  it('should call router.replace when logoutUrl is present', async () => {
    const replaceFn = jest.fn();
    jest
      .mocked(useRouter)
      .mockReturnValueOnce({ replace: replaceFn, getLogoutUrl: jest.fn().mockReturnValue('') } as any);
    const { result } = renderHook(() => useLogout());
    await act(async () => await result.current.logout());
    expect(replaceFn).toBeCalledTimes(1);
  });
});
