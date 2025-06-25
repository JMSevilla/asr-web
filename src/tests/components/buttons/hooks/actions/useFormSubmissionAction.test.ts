import { useFormSubmissionAction } from '../../../../../components/buttons/hooks/actions';
import { useFormSubmissionContext } from '../../../../../core/contexts/FormSubmissionContext';
import { act, renderHook } from '../../../../common';

jest.mock('../../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../../core/contexts/FormSubmissionContext', () => ({ useFormSubmissionContext: jest.fn() }));

describe('useFormSubmissionAction', () => {
  it('should return correct callable execute fn and falsy loading and node props', async () => {
    const submitFn = jest.fn();
    jest
      .mocked(useFormSubmissionContext)
      .mockReturnValueOnce({ submit: submitFn, loading: false, enabled: true } as any);
    const { result } = renderHook(() => useFormSubmissionAction());
    await act(async () => {
      await result.current.execute();
    });
    expect(submitFn).toBeCalledTimes(1);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.disabled).toBeFalsy();
    expect(result.current.node).toBeFalsy();
  });
});
