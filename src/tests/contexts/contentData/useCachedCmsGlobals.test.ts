import { compress } from 'compress-json';
import { useCachedCmsGlobals } from '../../../core/contexts/contentData/useCachedCmsGlobals';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useSessionStorage } from '../../../core/hooks/useSessionStorage';
import { renderHook, waitFor } from '../../common';

jest.mock('../../../core/hooks/useApi');
jest.mock('../../../core/hooks/useSessionStorage');
jest.mock('../../../core/hooks/useCachedAccessKey');
jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/contexts/TenantContext', () => ({ useTenantContext: () => ({ tenant: null }) }));

const RESPONSE_DATA = { globals: 'globals' };
const GLOBALS_STORAGE = {
  tenantUrl: 'tenant',
  contentAccessKey: 'contentAccessKey',
  data: compress(RESPONSE_DATA),
};

describe('useCachedCmsGlobals', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns initial globals as null and loading as false', () => {
    jest.mocked(useApiCallback).mockReturnValue({ loading: false } as any);
    jest.mocked(useSessionStorage).mockReturnValue([null, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCachedCmsGlobals('tenant'));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('returns globals from storage if available', () => {
    jest.mocked(useApiCallback).mockReturnValue({ loading: false } as any);
    jest.mocked(useSessionStorage).mockReturnValue([GLOBALS_STORAGE, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCachedCmsGlobals('tenant'));

    expect(result.current.data).toEqual(RESPONSE_DATA);
    expect(result.current.loading).toBe(false);
  });

  it('fetch returns globals from from storage', () => {
    jest.mocked(useApiCallback).mockReturnValue({ loading: false } as any);
    jest.mocked(useSessionStorage).mockReturnValue([GLOBALS_STORAGE, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCachedCmsGlobals('tenant'));

    expect(result.current.fetch(GLOBALS_STORAGE.contentAccessKey)).toEqual(RESPONSE_DATA);
  });

  it("fetch returns globals from API request if it's not in storage", async () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      execute: jest.fn().mockResolvedValueOnce(RESPONSE_DATA),
    } as any);
    jest.mocked(useSessionStorage).mockReturnValue([null, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCachedCmsGlobals('tenant'));

    const fetchPromise = await waitFor(() => result.current.fetch(GLOBALS_STORAGE.contentAccessKey));

    expect(fetchPromise).toEqual(RESPONSE_DATA);
  });
});
