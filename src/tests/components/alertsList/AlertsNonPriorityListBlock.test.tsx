import '@testing-library/jest-dom/extend-expect';
import { formatDate } from '../../../business/dates';
import { ParsedHtml } from '../../../components/ParsedHtml';
import { AlertsNonPriorityListBlock } from '../../../components/blocks/alertsList/nonPriority/AlertsNonPriorityListBlock';
import { AlertsNonPriorityListLoader } from '../../../components/blocks/alertsList/nonPriority/AlertsNonPriorityListLoader';
import { useAlerts } from '../../../core/contexts/alerts/AlertsContext';
import { act, fireEvent, render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/contexts/alerts/AlertsContext');
jest.mock('../../../components/ParsedHtml', () => ({
  ParsedHtml: jest.fn(({ html }) => (
    <div data-testid="parsed-html" data-html={html}>
      {html}
    </div>
  )),
}));
jest.mock('../../../business/dates', () => ({
  formatDate: jest.fn(() => 'Jan 01, 2023'),
  getUTCDate: jest.fn(date => new Date(date)),
}));
jest.mock('../../../components/blocks/alertsList/nonPriority/AlertsNonPriorityListLoader', () => ({
  AlertsNonPriorityListLoader: jest.fn(() => <div data-testid="mock-loader">Loading...</div>),
}));

describe('AlertsNonPriorityListBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders non-priority alerts when available', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [
          {
            alertID: 1,
            title: 'Alert Title 1',
            introText: '<p>Intro 1</p>',
            messageText: '<p>Message 1</p>',
            effectiveDate: '2023-01-01',
          },
          {
            alertID: 2,
            title: 'Alert Title 2',
            introText: '<p>Intro 2</p>',
            messageText: '<p>Message 2</p>',
            effectiveDate: '2023-01-02',
          },
        ],
      },
      loading: false,
      error: false,
      isEmpty: false,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    await act(async () => {
      render(<AlertsNonPriorityListBlock id="test-block" parameters={[]} />);
    });

    expect(screen.getByTestId('alerts-non-priority-list')).toBeInTheDocument();
    expect(screen.getByText('Alert Title 1')).toBeInTheDocument();
    expect(screen.getByText('Alert Title 2')).toBeInTheDocument();
    expect(formatDate).toHaveBeenCalledWith(expect.any(Date), 'dd MMM, yyyy');
    expect(formatDate).toHaveBeenCalledTimes(2);
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
      render(<AlertsNonPriorityListBlock id="test-block" parameters={[]} />);
    });

    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    expect(AlertsNonPriorityListLoader).toHaveBeenCalledWith(
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
        <AlertsNonPriorityListBlock
          id="test-block"
          parameters={[{ key: 'error_list_message_key', value: 'error_alerts_message' }]}
        />,
        {},
        customGlobals as any,
      );
    });

    expect(screen.queryByTestId('alerts-non-priority-list')).not.toBeInTheDocument();
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
      render(<AlertsNonPriorityListBlock id="test-block" parameters={[]} />);
    });

    expect(screen.queryByTestId('alerts-non-priority-list')).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
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
        <AlertsNonPriorityListBlock
          id="test-block"
          parameters={[{ key: 'empty_list_message_key', value: 'empty_alerts_message' }]}
        />,
        {},
        customGlobals as any,
      );
    });

    // Since we're providing the message through GlobalsContext, the component
    // should render the message instead of the empty list
    expect(screen.queryByTestId('alerts-non-priority-list')).not.toBeInTheDocument();
    // The rendered message would be inside a component provided by messageByKey,
    // which in the real app would render a Message component
    expect(screen.getByText('[[empty_alerts_message]]')).toBeInTheDocument();
  });

  it('displays no alerts when none are available', async () => {
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
      render(<AlertsNonPriorityListBlock id="test-block" parameters={[]} />);
    });

    // Component should return null when non-priority list is empty
    expect(screen.queryByTestId('alerts-non-priority-list')).not.toBeInTheDocument();
  });

  it('toggles alert content when clicked', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [
          {
            alertID: 1,
            title: 'Alert Title',
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
      render(<AlertsNonPriorityListBlock id="test-block" parameters={[]} />);
    });

    // Initial state (closed)
    const alertHeader = screen.getByText('Alert Title').closest('.alert-header') as HTMLElement;
    expect(alertHeader).toBeInTheDocument();

    // Icon should be pointing down initially (-90deg rotation)
    const iconButton = screen.getByRole('button', { name: '' });
    expect(iconButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    await act(async () => {
      fireEvent.click(alertHeader);
    });

    // Check if expanded
    expect(iconButton).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    await act(async () => {
      fireEvent.click(alertHeader);
    });

    // Check if collapsed again
    expect(iconButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders non-clickable alert when no messageText', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [
          {
            alertID: 1,
            title: 'Alert Title',
            introText: '<p>Intro</p>',
            messageText: '',
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
      render(<AlertsNonPriorityListBlock id="test-block" parameters={[]} />);
    });

    // Alert header should not have clickable styling
    const alertHeader = screen.getByText('Alert Title').closest('.alert-header') as HTMLElement;
    expect(alertHeader).toBeInTheDocument();
    expect(alertHeader.style.cursor).not.toBe('pointer');

    // No icon button should be present
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('correctly renders introText and messageText when alert is expanded', async () => {
    const mockAlerts = {
      list: {
        priority: [],
        nonPriority: [
          {
            alertID: 1,
            title: 'Alert Title',
            introText: '<p>Intro text</p>',
            messageText: '<p>Message text</p>',
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
      render(<AlertsNonPriorityListBlock id="test-block" parameters={[]} />);
    });

    // Initial state should show ParsedHtml with introText for desktop
    expect(ParsedHtml).toHaveBeenCalledWith(
      expect.objectContaining({
        html: '<p>Intro text</p>',
        sx: expect.objectContaining({ display: { xs: 'none', md: 'inline' } }),
      }),
      expect.anything(),
    );

    // Click to expand
    const alertHeader = screen.getByText('Alert Title').closest('.alert-header') as HTMLElement;
    await act(async () => {
      fireEvent.click(alertHeader);
    });

    // After expansion, should render ParsedHtml with messageText for desktop
    expect(ParsedHtml).toHaveBeenCalledWith(
      expect.objectContaining({
        html: '<p>Message text</p>',
      }),
      expect.anything(),
    );

    // And with combined text for mobile
    expect(ParsedHtml).toHaveBeenCalledWith(
      expect.objectContaining({
        html: '<p>Intro text</p><p>Message text</p>',
        fontSize: 'body2.fontSize',
      }),
      expect.anything(),
    );
  });

  it('renders alerts when isEmpty is false even if non-priority list is empty', async () => {
    const mockAlerts = {
      list: {
        priority: [{ alertID: 1, messageText: 'Priority Alert', effectiveDate: '2023-01-01', type: 'Info' }],
        nonPriority: [],
      },
      loading: false,
      error: false,
      isEmpty: false,
    };

    (useAlerts as jest.Mock).mockReturnValue(mockAlerts);

    await act(async () => {
      render(<AlertsNonPriorityListBlock id="test-block" parameters={[]} />);
    });

    // Component should return null when non-priority list is empty, regardless of isEmpty value
    expect(screen.queryByTestId('alerts-non-priority-list')).not.toBeInTheDocument();
  });

  it('does not display empty message when isEmpty is false', async () => {
    const mockAlerts = {
      list: {
        priority: [{ alertID: 1, messageText: 'Priority Alert', effectiveDate: '2023-01-01', type: 'Info' }],
        nonPriority: [],
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
        <AlertsNonPriorityListBlock
          id="test-block"
          parameters={[{ key: 'empty_list_message_key', value: 'empty_alerts_message' }]}
        />,
        {},
        customGlobals as any,
      );
    });

    // Component should return null when non-priority list is empty
    expect(screen.queryByTestId('alerts-non-priority-list')).not.toBeInTheDocument();
    expect(screen.queryByText('[[empty_alerts_message]]')).not.toBeInTheDocument();
  });
});
