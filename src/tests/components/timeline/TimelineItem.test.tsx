import { TimelineItem } from '../../../components/timeline';
import { render, screen } from '../../common';

const DEFAULT_PROPS = {
  first: true,
  last: true,
  title: 'title',
  html: 'html',
  dataTestid: 'timeline-item',
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
  it('should render tracking timeline item component', () => {
    render(<TimelineItem {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('timeline-item')).toBeTruthy();
  });

  it('should render completed icon if badge status COMPLETED', () => {
    render(<TimelineItem {...DEFAULT_PROPS} status="Completed" />);

    expect(screen.queryByTestId('completed-icon')).toBeTruthy();
  });
});
