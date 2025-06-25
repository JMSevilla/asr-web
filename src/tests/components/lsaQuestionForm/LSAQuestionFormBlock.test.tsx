import { ComponentProps } from 'react';
import { LSAQuestionFormBlock } from '../../../components';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { act, render, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: { paidLSACashAmount: 0, paidLSDBACashAmount: 0 },
    save: jest.fn(),
  }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

describe('LSAQuestionFormBlock', () => {
  const DEFAULT_PROPS: ComponentProps<typeof LSAQuestionFormBlock> = {
    id: 'LSA_LSDBA_allowance_form',
    journeyType: 'retirement',
    pageKey: 'pageKey',
  };

  it('should render the form with correct data-testid', () => {
    render(<LSAQuestionFormBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('LSA_LSDBA_allowance_form')).toBeInTheDocument();
  });

  it('should render NumberFields', () => {
    render(<LSAQuestionFormBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('paidLSACashAmount')).toBeInTheDocument();
    expect(screen.getByTestId('paidLSDBACashAmount')).toBeInTheDocument();
  });

  it('should save step data on submit', async () => {
    const save = jest.fn();
    (useJourneyStepData as jest.Mock).mockReturnValue({
      save: save,
      values: { paidLSACashAmount: 0, paidLSDBACashAmount: 0 },
      loading: false,
    });
    (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
      cb();
    });

    await act(async () => {
      render(<LSAQuestionFormBlock {...DEFAULT_PROPS} />);
    });
    expect(save).toHaveBeenCalledWith({ paidLSACashAmount: 0, paidLSDBACashAmount: 0 });
  });
});
