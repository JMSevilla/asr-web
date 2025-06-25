import { useLumpSumInstallmentState } from '../../../components/blocks/lumpSumInstallment/reducer';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

describe('useLumpSumInstallmentState', () => {
  it('should return correct initial state', () => {
    const { result } = renderHook(() => useLumpSumInstallmentState());
    expect(result.current.state.firstPaymentAmount).toBe(0);
    expect(result.current.state.secondPaymentAmount).toBe(0);
    expect(result.current.state.totalLumpSum).toBe(0);
    expect(result.current.state.dateOfBirth).toBeNull();
  });

  it('should load initial data', () => {
    const { result } = renderHook(() => useLumpSumInstallmentState());
    const retirementDate = new Date('2023-10-15');
    const secondPaymentDate = new Date('2023-10-15');
    act(() => {
      result.current.loadInitialData({
        firstPaymentAmount: 500,
        totalLumpSum: 1200,
        retirementDate,
        secondPaymentDate,
      });
    });
    expect(result.current.state.firstPaymentAmount).toBe(500);
    expect(result.current.state.secondPaymentAmount).toBe(700);
    expect(result.current.state.totalLumpSum).toBe(1200);
    expect(result.current.state.retirementDate).toBe(retirementDate);
    expect(result.current.state.secondPaymentDate).toBe(secondPaymentDate);
  });
  it('should update date of birth', () => {
    const { result } = renderHook(() => useLumpSumInstallmentState());
    const dateOfBirth = new Date('2023-10-15');
    act(() => {
      result.current.setDateOfBirth(dateOfBirth);
    });
    expect(result.current.state.dateOfBirth).toStrictEqual(dateOfBirth);
  });
  it('should update lump sum', () => {
    const { result } = renderHook(() => useLumpSumInstallmentState());
    const retirementDate = new Date('2023-10-14');
    const secondPaymentDate = new Date('2023-10-15');
    act(() => {
      result.current.loadInitialData({
        firstPaymentAmount: 500,
        totalLumpSum: 1200,
        retirementDate,
        secondPaymentDate,
      });
      result.current.submitLumpSum({
        firstPaymentAmount: 200,
        secondPaymentDate,
        secondPaymentAmount: 1000,
      });
    });
    expect(result.current.state.firstPaymentAmount).toBe(200);
    expect(result.current.state.secondPaymentAmount).toBe(1000);
    expect(result.current.state.totalLumpSum).toBe(1200);
    expect(result.current.state.secondPaymentDate).toBe(secondPaymentDate);
  });
});
