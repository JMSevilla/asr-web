import { CmsTokens } from '../../../api/types';
import { useCachedCmsTokens } from '../../../core/contexts/contentData/useCachedCmsTokens';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useSessionStorage } from '../../../core/hooks/useSessionStorage';
import { renderHook, waitFor } from '../../common';

jest.mock('../../../core/hooks/useApi');
jest.mock('../../../core/hooks/useSessionStorage');
jest.mock('../../../core/hooks/useCachedAccessKey');
jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/contexts/TenantContext', () => ({ useTenantContext: () => ({ tenant: null }) }));

const TOKENS_STORAGE: Partial<CmsTokens> = {
  earliestRetirementAge: 55,
  latestRetirementAge: 75,
  name: 'token',
};

describe('useCachedCmsTokens', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns initial tokens as null and loading as false', () => {
    jest.mocked(useApiCallback).mockReturnValue({ loading: false } as any);
    jest.mocked(useSessionStorage).mockReturnValue([null, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCachedCmsTokens());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('returns tokens from storage if available', () => {
    jest.mocked(useApiCallback).mockReturnValue({ loading: false } as any);
    jest.mocked(useSessionStorage).mockReturnValue([TOKENS_STORAGE, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCachedCmsTokens());

    expect(result.current.data).toEqual(TOKENS_STORAGE);
    expect(result.current.loading).toBe(false);
  });

  it('fetch returns tokens from from storage', async () => {
    jest.mocked(useApiCallback).mockReturnValue({ loading: false } as any);
    jest.mocked(useSessionStorage).mockReturnValue([TOKENS_STORAGE, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCachedCmsTokens());
    const tokens = await result.current.fetch();

    expect(tokens).toEqual(TOKENS_STORAGE);
  });

  it("fetch returns tokens from API request if it's not in storage", async () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      execute: jest.fn().mockResolvedValueOnce(TOKENS_STORAGE),
    } as any);
    jest.mocked(useSessionStorage).mockReturnValue([null, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCachedCmsTokens());

    const fetchPromise = await waitFor(() => result.current.fetch());

    expect(fetchPromise).toEqual(TOKENS_STORAGE);
  });
});
