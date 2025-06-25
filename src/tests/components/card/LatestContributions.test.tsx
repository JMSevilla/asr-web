import { LatestContributionsBlock } from '../../../components';
import { LatestContributionsItem } from '../../../components/blocks/card/LatestContributionItem';
import { useApi } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: {
      data: {
        totalValue: 0,
        currency: '',
        paymentDate: '',
        contributions: [
          {
            label: '',
            value: 0,
          },
          {
            label: '',
            value: 0,
          },
        ],
      },
    },
  }),
  useApiCallback: jest.fn().mockReturnValue({}),
}));
jest.mock('../../../components/blocks/chart/ChartLoader', () => ({
  ChartLoader: jest.fn().mockReturnValue(<div data-testid="panel-loader" />),
}));
jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, parsing: false }),
}));

const parameters = [
  {
    key: 'total-amount-text',
    value: 'Total amount paid on',
  },
];

describe('LatestContributionsBlock', () => {
  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({ loading: false });
  });
  it('renders loading', () => {
    (useApi as jest.Mock).mockReturnValue({ loading: true });
    render(<LatestContributionsBlock id="" parameters={parameters} />);

    expect(screen.getByTestId('panel-loader')).toBeInTheDocument();
  });

  it('renders LatestContributionsBlock', () => {
    render(<LatestContributionsBlock id="" parameters={parameters} />);

    expect(screen.getByTestId('latest-contributions-testid')).toBeInTheDocument();
    expect(screen.getByText('Total amount paid on')).toBeInTheDocument();
  });
  it('renders LatestContributionsItem', () => {
    render(<LatestContributionsItem label="item label" contributionsLength={2} />);

    expect(screen.getByTestId('latest-contribution-item')).toBeInTheDocument();
    expect(screen.getByText('item label')).toBeInTheDocument();
  });
});
