import axios from 'axios';
import { useCreateQuoteAction } from '../../../../../components/buttons/hooks/actions';
import { useApiCallback } from '../../../../../core/hooks/useApi';
import { act, renderHook } from '../../../../common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../../core/router', () => ({ useRouter: jest.fn().mockReturnValue({ loading: false }) }));
jest.mock('../../../../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn().mockReturnValue({ tenant: null }),
}));
jest.mock('../../../../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({ loading: false }),
}));
jest.mock('../../../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ clearCmsTokens: jest.fn() }),
}));
jest.mock('../../../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ loading: false, refresh: jest.fn() }),
}));

describe('useCreateQuoteAction', () => {
  it('should return correct callable execute fn and falsy loading props', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    const executeFn = jest.fn();
    jest.mocked(useApiCallback).mockReturnValueOnce({ execute: executeFn, loading: false, enabled: true } as any);

    const { result } = renderHook(() =>
      useCreateQuoteAction('transfer')({ linkKey: 'linkKey', pageKey: 'pageKey', journeyType: 'transfer2' }),
    );
    await act(async () => {
      await result.current.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
    expect(result.current.loading).toBeFalsy();
  });
});
