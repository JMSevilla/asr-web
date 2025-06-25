import '@testing-library/jest-dom/extend-expect';
import { MessageType } from '../../../components';
import { AlertsPriorityListBlock } from '../../../components/blocks/alertsList/priority/AlertsPriorityListBlock';
import { AlertsPriorityListLoader } from '../../../components/blocks/alertsList/priority/AlertsPriorityListLoader';
import { Message } from '../../../components/blocks/messages';
import { useAlerts } from '../../../core/contexts/alerts/AlertsContext';
import { act, render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/contexts/alerts/AlertsContext');
jest.mock('../../../components/blocks/messages/Message', () => ({
  Message: jest.fn(({ html, type }) => (
    <div data-testid="mock-message" data-type={type} data-html={html}>
      Mock Message
    </div>
  )),
}));
jest.mock('../../../components/blocks/alertsList/priority/AlertsPriorityListLoader', () => ({
  AlertsPriorityListLoader: jest.fn(() => <div data-testid="mock-loader">Loading...</div>),
}));

describe('AlertsPriorityListBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders alerts when available', async () => {
    const mockAlerts = {
      list: {
        priority: [
          { alertID: 1, messageText: 'Alert 1', effectiveDate: '2023-01-01', type: MessageType.Info },
          { alertID: 2, messageText: 'Alert 2', effectiveDate: '2023-01-02', type: MessageType.Warning },
        ],
        nonPriority: [],
      },
      loading: false,
      error: false,
      isEmpty: false,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    await act(async () => {
      render(<AlertsPriorityListBlock id="test-block" parameters={[]} />);
    });

    expect(screen.getAllByTestId('mock-message')).toHaveLength(2);
    expect(Message).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MessageType.Info,
        html: 'Alert 1',
        section: true,
      }),
      expect.anything(),
    );
    expect(Message).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MessageType.Warning,
        html: 'Alert 2',
        section: true,
      }),
      expect.anything(),
    );
  });

  it('renders loader when loading', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [],
      },
      loading: true,
      error: false,
      isEmpty: false,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    await act(async () => {
      render(<AlertsPriorityListBlock id="test-block" parameters={[]} />);
    });

    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    expect(AlertsPriorityListLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-block',
      }),
      expect.anything(),
    );
  });

  it('displays an error message when there is an error and error_list_message_key is provided', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [],
      },
      loading: false,
      error: true,
      isEmpty: true,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    const customGlobals = {
      messages: [
        {
          key: 'error_alerts_message',
          type: 'Error',
          html: '<p>Error loading alerts</p>',
        },
      ],
    };

    await act(async () => {
      render(
        <AlertsPriorityListBlock
          id="test-block"
          parameters={[{ key: 'error_list_message_key', value: 'error_alerts_message' }]}
        />,
        {},
        customGlobals as any,
      );
    });

    expect(screen.queryByTestId('alerts-priority-list')).not.toBeInTheDocument();
    expect(screen.getByText('[[error_alerts_message]]')).toBeInTheDocument();
  });

  it('renders nothing when there is an error but no error_list_message_key is provided', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [],
      },
      loading: false,
      error: true,
      isEmpty: true,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    await act(async () => {
      render(<AlertsPriorityListBlock id="test-block" parameters={[]} />);
    });

    expect(screen.queryByTestId('alerts-priority-list')).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('renders empty stack when no alerts are available', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [],
      },
      loading: false,
      error: false,
      isEmpty: true,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    await act(async () => {
      render(<AlertsPriorityListBlock id="test-block" parameters={[]} />);
    });

    expect(screen.queryByTestId('alerts-priority-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-message')).not.toBeInTheDocument();
  });

  it('displays an empty message when no alerts are available and empty_list_message_key is provided', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [],
      },
      loading: false,
      error: false,
      isEmpty: true,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    const customGlobals = {
      messages: [
        {
          key: 'empty_alerts_message',
          type: 'Info',
          html: '<p>No alerts are available</p>',
        },
      ],
    };

    await act(async () => {
      render(
        <AlertsPriorityListBlock
          id="test-block"
          parameters={[{ key: 'empty_list_message_key', value: 'empty_alerts_message' }]}
        />,
        {},
        customGlobals as any,
      );
    });

    expect(screen.queryByTestId('alerts-priority-list')).not.toBeInTheDocument();
    expect(screen.getByText('[[empty_alerts_message]]')).toBeInTheDocument();
  });

  it('renders alerts when isEmpty is false even if priority list is empty', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [
          {
            alertID: 1,
            title: 'Non-priority Alert',
            introText: '<p>Intro</p>',
            messageText: '<p>Message</p>',
            effectiveDate: '2023-01-01',
          },
        ],
      },
      loading: false,
      error: false,
      isEmpty: false,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    await act(async () => {
      render(<AlertsPriorityListBlock id="test-block" parameters={[]} />);
    });

    expect(screen.queryByTestId('alerts-priority-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-message')).not.toBeInTheDocument();
  });

  it('does not display empty message when isEmpty is false', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [
          {
            alertID: 1,
            title: 'Non-priority Alert',
            introText: '<p>Intro</p>',
            messageText: '<p>Message</p>',
            effectiveDate: '2023-01-01',
          },
        ],
      },
      loading: false,
      error: false,
      isEmpty: false,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    const customGlobals = {
      messages: [
        {
          key: 'empty_alerts_message',
          type: 'Info',
          html: '<p>No alerts are available</p>',
        },
      ],
    };

    await act(async () => {
      render(
        <AlertsPriorityListBlock
          id="test-block"
          parameters={[{ key: 'empty_list_message_key', value: 'empty_alerts_message' }]}
        />,
        {},
        customGlobals as any,
      );
    });

    expect(screen.queryByTestId('alerts-priority-list')).not.toBeInTheDocument();
    expect(screen.queryByText('[[empty_alerts_message]]')).not.toBeInTheDocument();
  });
});
