import { TimelineBlock } from '../../components/blocks/timeline/TimelineBlock';
import { useApi } from '../../core/hooks/useApi';
import { render, screen } from '../common';

jest.mock('eva-icons', () => ({ replace: jest.fn() }));
jest.mock('../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ loading: false, result: { data: null } }),
}));
jest.mock('../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({ update: jest.fn() }),
}));
jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: { values: {} }, expiration: {} } }),
}));
jest.mock('../../components/ParsedHtml', () => ({
  ParsedHtml: ({ html }: { html: string; fontSize: string }) => <span>{html}</span>,
}));
jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: {},
    error: undefined,
    status: 'success',
  }),
}));

const DEFAULT_PROPS: React.ComponentProps<typeof TimelineBlock> = {
  id: 'id',
  key: 'key',
  sourceUrl: 'source',
  items: [
    { description: 'description of [data-currency:values.cost]', header: 'header', status: 'Completed' },
    { description: 'description', header: 'header of [data-date:values.date]', status: 'Current' },
    { description: 'description of [data:values.text]', header: 'header', status: 'Future' },
  ],
};

describe('TimelineBlock', () => {
  it('renders component', () => {
    render(<TimelineBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('timeline-block')).toBeTruthy();
  });

  it('renders loader', () => {
    jest.mocked(useApi).mockReturnValue({ loading: true, result: { data: null } } as any);
    render(<TimelineBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('timeline-loader-block')).toBeTruthy();
  });

  it('displays badges based on statuses', () => {
    jest.mocked(useApi).mockReturnValue({ loading: false, result: { data: {} } } as any);
    render(<TimelineBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('panel-status-0')).toBeTruthy();
    expect(screen.queryByTestId('panel-status-1')).toBeTruthy();
    expect(screen.queryByTestId('panel-status-2')).toBeFalsy();
  });
});
