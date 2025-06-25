import { BadgeBlock } from '../../../components';
import { useApi } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));
jest.mock('../../../components/ParsedHtml', () => ({
  ParsedHtml: ({ html }: { html: string; fontSize: string }) => <span>{html}</span>,
}));
jest.mock('../../../core/hooks/useDataReplacerApi');
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: {} }, loading: false, error: undefined }),
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn() }),
}));
jest.mock('../../../core/hooks/useDataReplacerApi', () => ({
  useDataReplacerApi: jest.fn().mockReturnValue({
    error: undefined,
    loading: false,
    replaceDataInText: (text: string) => `Replaced: ${text}`,
    elementProps: jest.fn(),
  }),
}));
const DEFAULT_PROPS = {
  id: 'badge',
  text: 'Sample Badge',
  backgroundColor: 'blue',
  color: 'white',
  accessibilityText: 'Sample Badge for screen readers',
  urls: 'url1;url2',
  className: 'badge-class',
  'data-testid': 'badge-1',
};

describe('BadgeBlock', () => {
  it('renders BadgeBlock component', async () => {
    render(<BadgeBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('badge-1')).toBeInTheDocument();
    expect(screen.queryByText('Sample Badge for screen readers')).toBeInTheDocument();
  });

  it('displays skeleton loader when data is loading', async () => {
    jest.mocked(useApi).mockReturnValueOnce({ loading: true } as any);

    render(<BadgeBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('skeleton-loader')).toBeTruthy();
  });

  it('calls the API and renders Badge with data after loading', async () => {
    render(<BadgeBlock {...DEFAULT_PROPS} />);

    expect(screen.queryByText('Replaced: Sample Badge')).toBeTruthy();
    expect(screen.getByTestId('badge-1').parentNode).toHaveStyle('background-color: blue');
  });

  it('handles empty urls correctly', async () => {
    const props = { ...DEFAULT_PROPS, urls: '' };

    render(<BadgeBlock {...props} />);

    expect(screen.queryByText('Replaced: Sample Badge')).toBeTruthy();
  });
});
