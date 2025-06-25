import { subDays } from 'date-fns';
import { ComponentProps } from 'react';
import { formatDate } from '../../business/dates';
import { FinancialAdviseFormBlock } from '../../components/blocks/financialAdviseForm/FinancialAdviseFormBlock';
import { useSubmitJourneyStep } from '../../core/hooks/useSubmitJourneyStep';
import { act, fireEvent, render, screen, userEvent } from '../common'; // Adjust the import paths as needed

const DEFAULT_PROPS: ComponentProps<typeof FinancialAdviseFormBlock> = {
  id: 'id',
  journeyType: 'retirement',
  formKey: 'formKey',
  pageKey: 'pageKey',
  parameters: [
    { key: 'success_next_page', value: 'expectedNextPageKey' },
    { key: 'save_and_exit_button', value: 'save_and_exit_button' },
  ],
  isCloseButtonHidden: false,
};

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: { percentage: '50' },
  }),
}));

jest.mock('../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: { data: { pensionWiseDate: new Date() } },
    loading: false,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false, error: false }),
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    parseUrlAndPush: jest.fn(),
  }),
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ fastForward: { shouldGoToSummary: jest.fn().mockReturnValue(false) } }),
}));

jest.mock('../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue(jest.fn()),
}));

describe('FinancialAdviseFormBlock', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  it('renders the component correctly', () => {
    render(<FinancialAdviseFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('financial-advise-form')).toBeInTheDocument();
  });

  it('has enabled continue button', async () => {
    render(<FinancialAdviseFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('continue')).toBeEnabled();
  });

  it('should submit on continue button click', async () => {
    const date = formatDate(subDays(new Date(), 3), 'dd-MM-yyyy');
    const mockExecute = jest.fn();
    jest.mocked(useSubmitJourneyStep).mockReturnValue({ execute: mockExecute } as any);

    render(<FinancialAdviseFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('continue')).toBeEnabled();
    const input = screen.getByTestId('financial-advise-form').querySelector('input');

    expect(screen.getByTestId('continue')).toBeEnabled();

    await act(async () => {
      input && fireEvent.click(input);
      input && fireEvent.change(input, { target: { value: date } });
      input && (await userEvent.tab());
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('continue'));
    });

    expect(mockExecute).toBeCalled();
    expect(mockExecute).toHaveBeenCalledWith({ currentPageKey: 'pageKey', nextPageKey: 'expectedNextPageKey' });
  });

  it('should render correct buttons', () => {
    render(<FinancialAdviseFormBlock {...DEFAULT_PROPS} />, undefined, {
      buttons: [
        { elements: { buttonKey: { value: 'content-button-block' } }, type: 'button' },
        { elements: { buttonKey: { value: 'close_app_save_and_exit' } }, type: 'button' },
      ],
    });
    expect(screen.getByTestId('content-button-block')).toBeInTheDocument();
    expect(screen.queryByTestId('close_app_save_and_exit')).not.toBeInTheDocument();
  });
});
