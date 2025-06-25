import { useDownloadTAAction } from '../../../../../components/buttons/hooks/actions';
import { useApiCallback } from '../../../../../core/hooks/useApi';
import { act, renderHook } from '../../../../common';

jest.mock('../../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../../core/router', () => ({ useRouter: jest.fn().mockReturnValue({ loading: false }) }));
jest.mock('../../../../../core/hooks/useApi', () => ({ useApiCallback: jest.fn() }));

describe('useDownloadTAAction', () => {
  it('should return correct callable execute fn and falsy loading and node props', async () => {
    const executeFn = jest.fn();
    jest.mocked(useApiCallback).mockReturnValueOnce({ execute: executeFn, loading: false } as any);
    const { result } = renderHook(() => useDownloadTAAction());
    await act(async () => {
      await result.current.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.node).toBeFalsy();
  });
});
