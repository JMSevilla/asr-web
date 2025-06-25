import { LumpSumInstallmentBlock } from '../../../components';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { act, render, screen } from '../../common';
import { useLumpSumInstallment } from '../../../components/blocks/lumpSumInstallment/hooks';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: null, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
}));

jest.mock('../../../core/hooks/useCachedApi.ts', () => ({
  useCachedApi: jest.fn().mockReturnValue({ result: null, loading: false }),
}));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: { percentage: '50' },
  }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

jest.mock('../../../components/blocks/lumpSumInstallment/hooks', () => ({
  useLumpSumInstallment: jest.fn().mockReturnValue({
    state: {
      firstPaymentAmount: 100,
      secondPaymentAmount: 200,
      totalLumpSum: 300,
      secondPaymentDate: new Date('2023-10-17'),
      retirementDate: new Date('2023-10-17'),
      dateOfBirth: new Date('2020-1-1'),
    },
    submitLumpSum: jest.fn(),
    loading: false,
  }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

describe('LumpSumInstallmentBlock', () => {
  it('should render lump sum installment block', () => {
    render(<LumpSumInstallmentBlock id="lump_sum_installment_block_test" journeyType="transfer2" pageKey="pageKey" />);

    expect(screen.getByTestId('lump_sum_installment_block_test')).toBeTruthy();
  });

  it('should render data correctly', () => {
    render(<LumpSumInstallmentBlock id="lump_sum_installment_block_test" journeyType="transfer2" pageKey="pageKey" />);

    expect(screen.getByTestId('lump_sum_installment_block_test_1-0').textContent).toBe('[[currency:GBP]]100.00 [[lump_sum_installment_middle_text]]');
    expect(screen.getByTestId('lump_sum_installment_block_test_1-1').textContent).toBe('17 Oct 2023');
    expect(screen.getByTestId('lump_sum_installment_block_test_2-0').textContent).toBe('[[currency:GBP]]200.00 [[lump_sum_installment_middle_text]]');
    expect(screen.getByTestId('lump_sum_installment_block_test_2-1').textContent).toBe('17 Oct 2023');
  });

  it('should render lump sum installment block', () => {
    render(<LumpSumInstallmentBlock id="lump_sum_installment_block_test" journeyType="transfer2" pageKey="pageKey" />);

    expect(screen.getByTestId('lump_sum_installment_block_test')).toBeTruthy();
  });

  it('should render lump sum installment form', () => {
    render(<LumpSumInstallmentBlock id="lump_sum_installment_block_test" journeyType="transfer2" pageKey="pageKey" />);

    expect(screen.getByTestId('lump_sum_installment_block_test_form')).toBeTruthy();
  });

  it('should update generic data on submit', async () => {
    const saveGenericDataCb = jest.fn();
    const submitLumpSumCb = jest.fn();
    (useJourneyStepData as jest.Mock).mockReturnValue({ save: saveGenericDataCb, loading: false });
    (useLumpSumInstallment as jest.Mock).mockReturnValue({
      submitLumpSum: submitLumpSumCb, state: {
        firstPaymentAmount: 100,
        secondPaymentAmount: 200,
        totalLumpSum: 300,
        secondPaymentDate: new Date('2023-10-17'),
        retirementDate: new Date('2023-10-17'),
        dateOfBirth: new Date('2020-1-1'),
      }, loading: false
    });
    (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
      cb();
    });
    await act(async () => {
      render(<LumpSumInstallmentBlock id="lump_sum_installment_block_test" journeyType="transfer2" pageKey="pageKey" />);
    });
    expect(saveGenericDataCb).toHaveBeenCalled();
    expect(submitLumpSumCb).toHaveBeenCalled();
  });
});
