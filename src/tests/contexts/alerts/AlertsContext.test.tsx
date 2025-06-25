import '@testing-library/jest-dom/extend-expect';
import { UseAsyncReturn } from 'react-async-hook';
import { CmsPage } from '../../../api/content/types/page';
import { MessageType } from '../../../components';
import { AlertsProvider, useAlerts } from '../../../core/contexts/alerts/AlertsContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { act, render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useApi');
jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

const defaultResult = {
  priority: [{ alertID: 1, messageText: 'Priority Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
  nonPriority: [
    { alertID: 2, messageText: 'Non-priority Alert', effectiveDate: '2023-01-02', title: 'Test', introText: '' },
  ],
};

type PartialAsyncReturn = Partial<UseAsyncReturn<unknown>>;

const mockedUseApiCallback = useApiCallback as jest.Mock;

const TestConsumer = () => {
  const { list, loading, error, isEmpty } = useAlerts();
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error occurred</div>}
      {!loading && !error && (
        <>
          <div data-testid="priority-count">{list.priority.length}</div>
          <div data-testid="nonpriority-count">{list.nonPriority.length}</div>
          <div data-testid="is-empty">{isEmpty.toString()}</div>
        </>
      )}
    </div>
  );
};

describe('AlertsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const mockExecute = jest.fn();

    mockedUseApiCallback.mockReturnValue({
      status: 'success',
      execute: mockExecute,
      loading: false,
      result: defaultResult,
    } as PartialAsyncReturn);

    await act(async () => {
      render(
        <AlertsProvider page={null}>
          <TestConsumer />
        </AlertsProvider>,
      );
    });

    expect(screen.getByTestId('priority-count')).toHaveTextContent('1');
    expect(screen.getByTestId('nonpriority-count')).toHaveTextContent('1');
  });

  it('shows loading state when loading or not initiated', async () => {
    mockedUseApiCallback.mockReturnValue({
      status: 'not-requested',
      execute: jest.fn(),
      loading: true,
      result: null,
    } as PartialAsyncReturn);

    await act(async () => {
      render(
        <AlertsProvider page={null}>
          <TestConsumer />
        </AlertsProvider>,
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state when API call fails', async () => {
    mockedUseApiCallback.mockReturnValue({
      status: 'error',
      execute: jest.fn(),
      loading: false,
      error: new Error('API error'),
      result: null,
    } as PartialAsyncReturn);

    await act(async () => {
      render(
        <AlertsProvider page={null}>
          <TestConsumer />
        </AlertsProvider>,
      );
    });

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('does not call API when page is null', async () => {
    const mockExecute = jest.fn();

    mockedUseApiCallback.mockReturnValue({
      status: 'not-requested',
      execute: mockExecute,
      loading: false,
      result: defaultResult,
    } as PartialAsyncReturn);

    await act(async () => {
      render(
        <AlertsProvider page={null}>
          <TestConsumer />
        </AlertsProvider>,
      );
    });

    expect(mockExecute).not.toHaveBeenCalled();
  });

  it('calls API when page contains alerts components', async () => {
    const mockExecute = jest.fn();

    mockedUseApiCallback.mockReturnValue({
      status: 'not-requested',
      execute: mockExecute,
      loading: false,
      result: defaultResult,
    } as PartialAsyncReturn);

    const mockPage = {
      content: { values: [{ blockType: 'alerts_priority_list' }] },
    } as unknown as CmsPage;

    await act(async () => {
      render(
        <AlertsProvider page={mockPage}>
          <TestConsumer />
        </AlertsProvider>,
      );
    });

    expect(mockExecute).toHaveBeenCalled();
  });

  describe('isEmpty logic', () => {
    it('returns false when no list is available', async () => {
      const mockExecute = jest.fn();

      mockedUseApiCallback.mockReturnValue({
        status: 'success',
        execute: mockExecute,
        loading: false,
        result: null,
      } as PartialAsyncReturn);

      await act(async () => {
        render(
          <AlertsProvider page={null}>
            <TestConsumer />
          </AlertsProvider>,
        );
      });

      expect(screen.getByTestId('is-empty')).toHaveTextContent('false');
    });

    it('returns true when both priority and non-priority blocks are present but both lists are empty', async () => {
      const mockExecute = jest.fn();

      // First render with not-requested to trigger useEffect
      mockedUseApiCallback.mockReturnValue({
        status: 'not-requested',
        execute: mockExecute,
        loading: false,
        result: { priority: [], nonPriority: [] },
      } as PartialAsyncReturn);

      const mockPage = {
        content: JSON.stringify({
          values: [{ blockType: 'alerts_priority_list' }, { blockType: 'alerts_nonpriority_list' }],
        }),
      } as unknown as CmsPage;

      const { rerender } = render(
        <AlertsProvider page={mockPage}>
          <TestConsumer />
        </AlertsProvider>,
      );

      // Then update to success status
      mockedUseApiCallback.mockReturnValue({
        status: 'success',
        execute: mockExecute,
        loading: false,
        result: { priority: [], nonPriority: [] },
      } as PartialAsyncReturn);

      await act(async () => {
        rerender(
          <AlertsProvider page={mockPage}>
            <TestConsumer />
          </AlertsProvider>,
        );
      });

      expect(screen.getByTestId('is-empty')).toHaveTextContent('true');
    });

    it('returns false when both priority and non-priority blocks are present and priority list has items', async () => {
      const mockExecute = jest.fn();

      // First render with not-requested to trigger useEffect
      mockedUseApiCallback.mockReturnValue({
        status: 'not-requested',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
          nonPriority: [],
        },
      } as PartialAsyncReturn);

      const mockPage = {
        content: JSON.stringify({
          values: [{ blockType: 'alerts_priority_list' }, { blockType: 'alerts_nonpriority_list' }],
        }),
      } as unknown as CmsPage;

      const { rerender } = render(
        <AlertsProvider page={mockPage}>
          <TestConsumer />
        </AlertsProvider>,
      );

      // Then update to success status
      mockedUseApiCallback.mockReturnValue({
        status: 'success',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
          nonPriority: [],
        },
      } as PartialAsyncReturn);

      await act(async () => {
        rerender(
          <AlertsProvider page={mockPage}>
            <TestConsumer />
          </AlertsProvider>,
        );
      });

      expect(screen.getByTestId('is-empty')).toHaveTextContent('false');
    });

    it('returns true when only priority block is present and priority list is empty', async () => {
      const mockExecute = jest.fn();

      // First render with not-requested to trigger useEffect
      mockedUseApiCallback.mockReturnValue({
        status: 'not-requested',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [],
          nonPriority: [
            { alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', title: 'Test', introText: '' },
          ],
        },
      } as PartialAsyncReturn);

      const mockPage = {
        content: JSON.stringify({ values: [{ blockType: 'alerts_priority_list' }] }),
      } as unknown as CmsPage;

      const { rerender } = render(
        <AlertsProvider page={mockPage}>
          <TestConsumer />
        </AlertsProvider>,
      );

      // Then update to success status
      mockedUseApiCallback.mockReturnValue({
        status: 'success',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [],
          nonPriority: [
            { alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', title: 'Test', introText: '' },
          ],
        },
      } as PartialAsyncReturn);

      await act(async () => {
        rerender(
          <AlertsProvider page={mockPage}>
            <TestConsumer />
          </AlertsProvider>,
        );
      });

      expect(screen.getByTestId('is-empty')).toHaveTextContent('true');
    });

    it('returns false when only priority block is present and priority list has items', async () => {
      const mockExecute = jest.fn();

      // First render with not-requested to trigger useEffect
      mockedUseApiCallback.mockReturnValue({
        status: 'not-requested',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
          nonPriority: [],
        },
      } as PartialAsyncReturn);

      const mockPage = {
        content: JSON.stringify({ values: [{ blockType: 'alerts_priority_list' }] }),
      } as unknown as CmsPage;

      const { rerender } = render(
        <AlertsProvider page={mockPage}>
          <TestConsumer />
        </AlertsProvider>,
      );

      // Then update to success status
      mockedUseApiCallback.mockReturnValue({
        status: 'success',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
          nonPriority: [],
        },
      } as PartialAsyncReturn);

      await act(async () => {
        rerender(
          <AlertsProvider page={mockPage}>
            <TestConsumer />
          </AlertsProvider>,
        );
      });

      expect(screen.getByTestId('is-empty')).toHaveTextContent('false');
    });

    it('returns true when only non-priority block is present and non-priority list is empty', async () => {
      const mockExecute = jest.fn();

      // First render with not-requested to trigger useEffect
      mockedUseApiCallback.mockReturnValue({
        status: 'not-requested',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
          nonPriority: [],
        },
      } as PartialAsyncReturn);

      const mockPage = {
        content: JSON.stringify({ values: [{ blockType: 'alerts_nonpriority_list' }] }),
      } as unknown as CmsPage;

      const { rerender } = render(
        <AlertsProvider page={mockPage}>
          <TestConsumer />
        </AlertsProvider>,
      );

      // Then update to success status
      mockedUseApiCallback.mockReturnValue({
        status: 'success',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [{ alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', type: MessageType.Info }],
          nonPriority: [],
        },
      } as PartialAsyncReturn);

      await act(async () => {
        rerender(
          <AlertsProvider page={mockPage}>
            <TestConsumer />
          </AlertsProvider>,
        );
      });

      expect(screen.getByTestId('is-empty')).toHaveTextContent('true');
    });

    it('returns false when only non-priority block is present and non-priority list has items', async () => {
      const mockExecute = jest.fn();

      // First render with not-requested to trigger useEffect
      mockedUseApiCallback.mockReturnValue({
        status: 'not-requested',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [],
          nonPriority: [
            { alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', title: 'Test', introText: '' },
          ],
        },
      } as PartialAsyncReturn);

      const mockPage = {
        content: JSON.stringify({ values: [{ blockType: 'alerts_nonpriority_list' }] }),
      } as unknown as CmsPage;

      const { rerender } = render(
        <AlertsProvider page={mockPage}>
          <TestConsumer />
        </AlertsProvider>,
      );

      // Then update to success status
      mockedUseApiCallback.mockReturnValue({
        status: 'success',
        execute: mockExecute,
        loading: false,
        result: {
          priority: [],
          nonPriority: [
            { alertID: 1, messageText: 'Alert', effectiveDate: '2023-01-01', title: 'Test', introText: '' },
          ],
        },
      } as PartialAsyncReturn);

      await act(async () => {
        rerender(
          <AlertsProvider page={mockPage}>
            <TestConsumer />
          </AlertsProvider>,
        );
      });

      expect(screen.getByTestId('is-empty')).toHaveTextContent('false');
    });

    it('returns false when no alert blocks are present in page', async () => {
      const mockExecute = jest.fn();

      mockedUseApiCallback.mockReturnValue({
        status: 'success',
        execute: mockExecute,
        loading: false,
        result: { priority: [], nonPriority: [] },
      } as PartialAsyncReturn);

      const mockPage = {
        content: JSON.stringify({ values: [{ blockType: 'some_other_block' }] }),
      } as unknown as CmsPage;

      await act(async () => {
        render(
          <AlertsProvider page={mockPage}>
            <TestConsumer />
          </AlertsProvider>,
        );
      });

      expect(screen.getByTestId('is-empty')).toHaveTextContent('false');
    });
  });
});
