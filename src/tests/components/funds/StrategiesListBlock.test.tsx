import { ComponentProps } from 'react';
import { StrategiesListBlock } from '../../../components/blocks/funds/StrategiesListBlock';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi } from '../../../core/hooks/useApi';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { act, render, screen } from '../../common'; // Adjust the import paths as needed

const DEFAULT_PROPS: ComponentProps<typeof StrategiesListBlock> = {
  id: 'test',
  journeyType: 'retirement',
  pageKey: 'pageKey',
  parameters: [{ key: 'success_next_page', value: 'expectedNextPageKey' }],
};

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: { code: 'code', name: 'name' },
    save: jest.fn(),
  }),
}));

jest.mock('../../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../../core/hooks/useJourneyNavigation', () => ({
  useJourneyNavigation: jest.fn().mockReturnValue({ goNext: jest.fn(), loading: false }),
}));

jest.mock('../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));

jest.mock('../../../core/contexts/NotificationsContext', () => ({
  useNotificationsContext: jest.fn().mockReturnValue({ showNotifications: jest.fn(), hideNotifications: jest.fn() }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: [
      { code: 'code', name: 'name' },
      { code: 'code2', name: 'name2' },
    ],
    loading: false,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false, error: false }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    parseUrlAndPush: jest.fn(),
  }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ fastForward: { shouldGoToSummary: jest.fn().mockReturnValue(false) } }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn().mockReturnValue({}),
}));

describe('StrategiesListBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', async () => {
    await act(async () => {
      render(<StrategiesListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('strategies-list')).toBeInTheDocument();
  });

  it('renders correct number of strategies', async () => {
    await act(async () => {
      render(<StrategiesListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getAllByRole('radio').length).toBe(2);
  });

  it('renders loader when loading', async () => {
    (useApi as jest.Mock).mockReturnValue({ loading: true });
    await act(async () => {
      render(<StrategiesListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('strategies-list-loader')).toBeInTheDocument();
  });

  it('calls correct methods on submit', async () => {
    (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
      cb();
    });
    (useApi as jest.Mock).mockReturnValue({ result: [{ code: 'code', name: 'name' }], loading: false });
    const execute = jest.fn();
    (useSubmitJourneyStep as jest.Mock).mockReturnValue({ execute });
    const save = jest.fn();
    (useJourneyStepData as jest.Mock).mockReturnValue({ save });
    const goNext = jest.fn();
    (useJourneyNavigation as jest.Mock).mockReturnValue({ goNext, loading: false });
    await act(async () => {
      render(<StrategiesListBlock {...DEFAULT_PROPS} />);
    });
    await act(async () => {
      screen.getByRole('radio').click();
    });
    expect(execute).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
    expect(goNext).toHaveBeenCalled();
  });

  it('should render error', async () => {
    (useApi as jest.Mock).mockReturnValue({ error: true });
    const showNotifications = jest.fn();
    (useNotificationsContext as jest.Mock).mockReturnValue({ showNotifications, hideNotifications: jest.fn() });
    await act(async () => {
      render(<StrategiesListBlock {...DEFAULT_PROPS} />, undefined, {
        messages: [{ elements: { messageKey: { value: 'test_error' }, type: {}, text: {} } } as any],
      });
    });
    expect(screen.getByTestId('strategies-list-error')).toBeInTheDocument();
    expect(showNotifications).toHaveBeenCalled();
  });
});
