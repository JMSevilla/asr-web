import { usePostRequest } from '../../../../components/buttons/hooks/usePostRequest';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { act, renderHook } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false }),
}));
jest.mock('../../../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({ useApiCallback: jest.fn() }),
}));
jest.mock('../../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: { contentAccessKey: 'contentAccessKey' }, loading: false }),
}));

describe('usePostRequest', () => {
  it('should return correct callable execute fn and falsy loading props', async () => {
    const executeFn = jest.fn();
    jest.mocked(useApiCallback).mockReturnValueOnce({ execute: executeFn, loading: false } as any);
    const { result } = renderHook(() => usePostRequest({ url: 'test' }));
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
    expect(result.current?.loading).toBeFalsy();
  });
});
