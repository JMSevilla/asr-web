import { useBeneficiariesFormDirtyState } from '../../../components/blocks/beneficiariesSummary/useBeneficiariesFormDirtyState';
import { renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

describe('useBeneficiariesFormDirtyState', () => {
  it('should return isDirty', () => {
    const formState = { isDirty: true } as any;
    const { result } = renderHook(() => useBeneficiariesFormDirtyState(formState));
    expect(result.current.isDirty).toBe(true);
  });
});
