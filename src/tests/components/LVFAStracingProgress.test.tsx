import { HISTORY_KEYS } from '../../components/blocks/LVFAStracingProgress/constants';
import { TracingTimeline } from '../../components/blocks/LVFAStracingProgress/TracingTimeline';
import { render, screen } from '../common';

const DEFAULT_PROPS = {
  data: HISTORY_KEYS,
  historyItems: [],
};

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/hooks/useApi', () => ({
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

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

describe('TracingTimeline', () => {
  it('should render tracking timeline component', () => {
    render(<TracingTimeline {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('tracking-timeline')).toBeTruthy();
  });

  it('should render all timeline items', () => {
    render(<TracingTimeline {...DEFAULT_PROPS} />);

    HISTORY_KEYS.forEach(item => {
      expect(screen.queryByTestId(item._id)).toBeTruthy();
    });
  });
});
