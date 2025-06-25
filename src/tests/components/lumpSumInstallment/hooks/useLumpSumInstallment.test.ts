import { act } from 'react-dom/test-utils';
import { useLumpSumInstallment } from '../../../../components/blocks/lumpSumInstallment/hooks';
import { useLumpSumInstallmentState } from '../../../../components/blocks/lumpSumInstallment/reducer';
import { renderHook } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../../components/blocks/lumpSumInstallment/reducer', () => ({
  useLumpSumInstallmentState: jest.fn().mockReturnValue({
    state: {
      firstPaymentAmount: 0,
      secondPaymentAmount: 0,
      totalLumpSum: 0,
      secondPaymentDate: new Date(),
      retirementDate: new Date(),
      dateOfBirth: null,
    },
    loadInitialData: jest.fn(),
    setDateOfBirth: jest.fn(),
    submitLumpSum: jest.fn(),
    reset: jest.fn(),
  }),
}));

jest.mock('../../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    data: [
      {
        data: {
          dateOfBirth: '2023-10-12T12:06:39.508Z',
        },
      },
    ],
  }),
  loading: false,
}));

const journeyType = 'transfer2';

describe('useLumpSumInstallment', () => {
  it('should update payment data', () => {
    const submitLumpSumFn = jest.fn();
    jest.mocked(useLumpSumInstallmentState).mockReturnValue({
      state: {
        firstPaymentAmount: 0,
        secondPaymentAmount: 0,
        totalLumpSum: 0,
        secondPaymentDate: new Date(),
        retirementDate: new Date(),
        dateOfBirth: null,
      },
      loadInitialData: jest.fn(),
      setDateOfBirth: jest.fn(),
      submitLumpSum: submitLumpSumFn,
      reset: jest.fn(),
    });
    const { result } = renderHook(() => useLumpSumInstallment(journeyType, 'lump_sum'));
    act(() => {
      result.current.submitLumpSum({
        firstPaymentAmount: 10,
        secondPaymentDate: new Date('2023-10-12T12:06:39.508Z'),
        secondPaymentAmount: 20,
      });
    });
    expect(submitLumpSumFn).toBeCalled();
    expect(submitLumpSumFn).toBeCalledWith({
      firstPaymentAmount: 10,
      secondPaymentDate: new Date('2023-10-12T12:06:39.508Z'),
      secondPaymentAmount: 20,
    });
  });
});
