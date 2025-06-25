import { useCloseDialogAction } from '../../../../../components/buttons/hooks/actions';
import { useDialogContext } from '../../../../../core/contexts/dialog/DialogContext';
import { act, renderHook } from '../../../../common';

jest.mock('../../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../../core/router', () => ({ useRouter: jest.fn().mockReturnValue({ loading: false }) }));
jest.mock('../../../../../core/contexts/dialog/DialogContext', () => ({
  useDialogContext: jest.fn().mockReturnValue({ isDialogOpen: true, openDialog: jest.fn(), closeDialog: jest.fn() }),
}));

describe('useCloseDialogAction', () => {
  it('should return correct callable execute fn and falsy loading ', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDialogContext).mockReturnValueOnce({
      closeDialog: executeFn,
    } as any);
    const { result } = renderHook(() => useCloseDialogAction());
    await act(async () => {
      await result.current.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
    expect(result.current.loading).toBeFalsy();
  });
});
