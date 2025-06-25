import { ComponentProps } from 'react';
import { AvailableFundsListBlock } from '../../../components/blocks/funds/AvailableFundsListBlock';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi } from '../../../core/hooks/useApi';
import { act, render, screen } from '../../common'; // Adjust the import paths as needed

const DEFAULT_PROPS: ComponentProps<typeof AvailableFundsListBlock> = {
  id: 'test',
  pageKey: 'pageKey',
};

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: {
      'Group A': [{ fundCode: 'A', fundGroup: 'Group A', fundName: 'Fund A', factsheetUrl: 'https://www.fund-a.com' }],
      'Group B': [{ fundCode: 'B', fundGroup: 'Group B', fundName: 'Fund B', factsheetUrl: 'https://www.fund-b.com' }],
      'Group D': [{ fundCode: 'D', fundGroup: 'Group D', fundName: 'Fund D', factsheetUrl: 'https://www.fund-d.com' }],
    },
    loading: false,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false, error: false }),
}));

jest.mock('../../../core/contexts/FormSubmissionContext', () => ({
  useFormSubmissionContext: jest.fn().mockReturnValue({ hasCallback: jest.fn() }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

jest.mock('../../../core/contexts/NotificationsContext', () => ({
  useNotificationsContext: jest.fn().mockReturnValue({ showNotifications: jest.fn(), hideNotifications: jest.fn() }),
}));

jest.mock('../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));

describe('AvailableFundsListBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', async () => {
    await act(async () => {
      render(<AvailableFundsListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('available-funds-list')).toBeInTheDocument();
  });

  it('renders correct groups and funds', async () => {
    await act(async () => {
      render(<AvailableFundsListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('group-Group A')).toBeInTheDocument();
    expect(screen.getByTestId('group-Group B')).toBeInTheDocument();
    expect(screen.getByTestId('group-Group D')).toBeInTheDocument();
    expect(screen.getByTestId('group-Group A-list-item-A')).toBeInTheDocument();
    expect(screen.getByTestId('group-Group B-list-item-B')).toBeInTheDocument();
    expect(screen.getByTestId('group-Group D-list-item-D')).toBeInTheDocument();
  });

  it('renders loader when loading', async () => {
    (useApi as jest.Mock).mockReturnValue({ loading: true });
    await act(async () => {
      render(<AvailableFundsListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('available-funds-list-loader')).toBeInTheDocument();
  });

  it('renders error when error', async () => {
    (useApi as jest.Mock).mockReturnValue({ error: true });
    const showNotifications = jest.fn();
    (useNotificationsContext as jest.Mock).mockReturnValue({ showNotifications, hideNotifications: jest.fn() });
    await act(async () => {
      render(<AvailableFundsListBlock {...DEFAULT_PROPS} />, undefined, {
        messages: [{ elements: { messageKey: { value: 'test_error' }, type: {}, text: {} } } as any],
      });
    });
    expect(screen.getByTestId('available-funds-error')).toBeInTheDocument();
    expect(showNotifications).toHaveBeenCalled();
  });
});
