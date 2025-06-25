import { TransferApplicationDetailsBlock } from '../../components';
import { useContentDataContext } from '../../core/contexts/contentData/ContentDataContext';
import { useApi } from '../../core/hooks/useApi';
import { render, screen } from '../common';

const DEFAULT_PROPS = {
  id: 'transfer-app-details',
};

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ transfer: {} }),
}));

jest.mock('../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: { hasAdditionalContributions: true } }),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ loading: false }),
  useApiCallback: jest.fn().mockReturnValue({ loading: false }),
}));

describe('TransferApplicationDetailsBlock', () => {
  it('should render transfer application details', () => {
    jest.mocked(useApi).mockReturnValueOnce({
      loading: false,
      result: {
        data: {},
      },
    } as any);
    render(<TransferApplicationDetailsBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('transfer-app-details')).toBeTruthy();
  });

  it('should render transfer application details with incomplete status', () => {
    jest.mocked(useApi).mockReturnValueOnce({
      loading: false,
      result: {
        data: {
          submitByDate: '2023-05-13T10:08:57.217519+00:00',
          totalGuaranteedTransferValue: 146393.81,
          totalNonGuaranteedTransferValue: 12.21,
          transferApplicationStatus: 'SubmitStarted',
        },
      },
    } as any);
    render(<TransferApplicationDetailsBlock {...DEFAULT_PROPS} />);

    expect(screen.getByText('[[transfer-app-details_incomplete]]')).toBeTruthy();
    expect(screen.getByText('[[transfer-app-details_submited_by]] 13 May 2023')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]12.21')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]146,393.81')).toBeTruthy();
  });

  it('should render transfer application details with completed status', () => {
    jest.mocked(useApi).mockReturnValueOnce({
      loading: false,
      result: {
        data: {
          submissionDate: '2023-05-16T10:08:57.217519+00:00',
          totalGuaranteedTransferValue: 146393.81,
          totalNonGuaranteedTransferValue: 12.21,
          transferApplicationStatus: 'SubmittedTA',
        },
      },
    } as any);
    jest.mocked(useContentDataContext).mockReturnValueOnce({ membership: { hasAdditionalContributions: true } } as any);

    render(<TransferApplicationDetailsBlock {...DEFAULT_PROPS} />);

    expect(screen.getByText('[[transfer-app-details_submited]]')).toBeTruthy();
    expect(screen.getByText('[[transfer-app-details_submited_on]] 16 May 2023')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]12.21')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]146,393.81')).toBeTruthy();
    expect(screen.getByTestId('transfer-quote-dc-value-status')).toBeInTheDocument();
  });
});
