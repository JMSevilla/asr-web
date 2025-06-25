import { subDays } from 'date-fns';
import { ComponentProps } from 'react';
import { formatDate } from '../../business/dates';
import { PensionWiseFormBlock } from '../../components/blocks/pensionWiseForm/PensionWiseFormBlock';
import { useJourneyStepData } from '../../core/hooks/useJourneyStepData';
import { useSubmitJourneyStep } from '../../core/hooks/useSubmitJourneyStep';
import { act, fireEvent, render, screen, userEvent } from '../common'; // Adjust the import paths as needed

const DEFAULT_PROPS: ComponentProps<typeof PensionWiseFormBlock> = {
  id: 'id',
  journeyType: 'retirement',
  formKey: 'formKey',
  pageKey: 'pageKey',
  parameters: [{ key: 'success_next_page', value: 'expectedNextPageKey' }],
  isCloseButtonHidden: false,
};

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: {
      pensionWiseDate: '2023-12-12',
    },
    save: jest.fn(),
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

describe('PensionWiseFormBlock', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  it('renders the component correctly', () => {
    render(<PensionWiseFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('pension-wise-form')).toBeInTheDocument();
  });

  it('has enabled continue button', async () => {
    render(<PensionWiseFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('continue')).toBeEnabled();
  });

  it('should submit on continue button click', async () => {
    const dateNow = new Date();
    const date = formatDate(subDays(dateNow, 3), 'dd-MM-yyyy');
    const expectedDate = new Date(subDays(dateNow, 3).toISOString()?.split('T')?.[0]);
    const mockExecute = jest.fn();
    const mockSave = jest.fn();
    jest.mocked(useSubmitJourneyStep).mockReturnValue({ execute: mockExecute } as any);
    jest.mocked(useJourneyStepData).mockReturnValue({ save: mockSave } as any);

    render(
      <PensionWiseFormBlock
        {...DEFAULT_PROPS}
        parameters={[
          { key: 'version', value: '2' },
          { key: 'success_next_page', value: 'expectedNextPageKey' },
        ]}
      />,
    );
    expect(screen.getByTestId('continue')).toBeEnabled();
    const input = screen.getByTestId('pension-wise-form').querySelector('input');

    expect(screen.getByTestId('continue')).toBeEnabled();

    await act(async () => {
      input && fireEvent.click(input);
      input && fireEvent.change(input, { target: { value: date } });
      input && (await userEvent.tab());
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('continue'));
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledWith({ currentPageKey: 'pageKey', nextPageKey: 'expectedNextPageKey' });
    expect(mockSave).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledWith({ pensionWiseDate: expectedDate });
  });
});
