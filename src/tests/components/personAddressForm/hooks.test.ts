import { usePersonAddressLookup } from '../../../components/blocks/personAddressForm/hooks';
import { useApiCallback } from '../../../core/hooks/useApi';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useApi', () => ({ useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn() }) }));

describe('hooks', () => {
  describe('usePersonAddressLookup', () => {
    it('should call useApiCallback execute on loadDetails', async () => {
      const execute = jest.fn();
      jest.mocked(useApiCallback).mockReturnValue({ execute } as any);
      const { result } = renderHook(() => usePersonAddressLookup('bereavement'));

      await act(async () => {
        await result.current.loadDetails();
      });

      expect(execute).toBeCalledTimes(1);
    });
  });
});
