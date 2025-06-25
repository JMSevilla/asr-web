import '@testing-library/jest-dom/extend-expect';
import { MessageType } from '../../components';
import { NotificationsConsumer } from '../../components/NotificationsConsumer';
import { NotificationsContextProvider, useNotificationsContext } from '../../core/contexts/NotificationsContext';
import { act, fireEvent, render, screen } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/router', () => ({
  useRouter: () => ({
    loading: false,
    parsing: false,
    push: jest.fn(),
    parseUrlAndPush: jest.fn(),
    staticRoutes: { hub: '/hub' },
    events: { on: jest.fn(), off: jest.fn() },
    parsedQuery: {},
  }),
}));

jest.mock('../../core/hooks/useScroll', () => ({
  useScroll: () => ({
    scrollTop: jest.fn(),
  }),
}));

jest.mock('../../core/contexts/PageLoaderContext', () => ({
  usePageLoaderContext: () => ({
    isLoading: false,
    isCalculationsLoaded: false,
  }),
}));

jest.mock('../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: () => ({
    quotesOptionsLoading: false,
    retirementCalculationLoading: false,
  }),
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {}, expiration: {}, fastForward: {} } }),
}));

const TestConsumer = () => {
  const { showNotifications, hideNotifications, notification } = useNotificationsContext();
  return (
    <div>
      <button
        onClick={() =>
          showNotifications([{ type: MessageType.Info, message: 'test-message', buttons: [{ linkKey: '/' }] }])
        }
      >
        Show Notifications
      </button>
      <button onClick={() => hideNotifications()}>Hide Notifications</button>
      <NotificationsConsumer page={undefined as any} />
    </div>
  );
};

describe('NotificationsContextProvider', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <NotificationsContextProvider>
          <>Test Child</>
        </NotificationsContextProvider>,
      );
    });
  });

  it('provides context values', async () => {
    await act(async () => {
      render(
        <NotificationsContextProvider>
          <TestConsumer />
        </NotificationsContextProvider>,
      );
    });

    expect(screen.getByText('Show Notifications')).toBeInTheDocument();
  });

  it('shows and hides notifications', async () => {
    await act(async () => {
      render(
        <NotificationsContextProvider>
          <TestConsumer />
        </NotificationsContextProvider>,
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Show Notifications'));
    });
    expect(screen.getByText('test-message')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Hide Notifications'));
    });
    expect(screen.queryByText('test-message')).not.toBeInTheDocument();
  });
});
