import { TimelineItemContent } from '../../../components/timeline';
import { render, screen } from '../../common';

const DEFAULT_PROPS = {
  title: 'title',
  html: 'html',
  status: undefined,
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
  }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {} } }),
}));

describe('TimelineItem', () => {
  it('should render tracking timeline content item component', () => {
    render(<TimelineItemContent {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('timeline-content')).toBeTruthy();
    expect(screen.queryByText('title')).toBeTruthy();
    expect(screen.queryByText('html')).toBeTruthy();
  });

  it('should render tracking timeline content item component with status COMPLETED', () => {
    render(<TimelineItemContent {...DEFAULT_PROPS} status="Completed" />);

    expect(screen.queryByTestId(`status-badge-Completed`)).toBeTruthy();
  });

  it('should render tracking timeline content item component with status PENDING', () => {
    render(<TimelineItemContent {...DEFAULT_PROPS} status="Pending" />);

    expect(screen.queryByTestId(`status-badge-Pending`)).toBeTruthy();
  });

  it('should render tracking timeline content item component with status CANCELED', () => {
    render(<TimelineItemContent {...DEFAULT_PROPS} status="Cancelled" />);

    expect(screen.queryByTestId(`status-badge-Cancelled`)).toBeTruthy();
  });
});
