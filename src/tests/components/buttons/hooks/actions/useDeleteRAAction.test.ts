import { useDeleteRAAction } from '../../../../../components/buttons/hooks/actions';
import { renderHook } from '../../../../common';

jest.mock('../../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, parsing: false }),
}));
jest.mock('../../../../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({ loading: false }),
}));
jest.mock('../../../../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn().mockReturnValue({ tenant: null }),
}));
jest.mock('../../../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ clearCmsTokens: jest.fn() }),
}));
jest.mock('../../../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ loading: false, refresh: jest.fn() }),
}));

describe('useDeleteRAAction', () => {
  it('should return callable execute with truthy node and falsy loading props', () => {
    const { result } = renderHook(() => useDeleteRAAction());
    expect(result.current.execute).toBeTruthy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.node).toBeTruthy();
  });
});
