import * as Components from '../../../components';
import { CheckOnGrowthBlock } from '../../../components/blocks/card/CheckOnGrowth';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

let mockedDataSource = {
  dataSource: {
    isLoading: false,
    isError: false,
    isSuccess: true,
    isEmpty: false,
    dataSource: {
      result: {
        data: {
          changeInValue: 0,
          personalRateOfReturn: 0,
        },
      },
    },
  },
};

jest.mock('../../../components', () => {
  const originalModule = jest.requireActual('../../../components');
  return {
    ...originalModule,
    EvaIcon: ({ name, ...props }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
    ChartLoader: jest.fn().mockImplementation(() => <div data-testid="block-loader" />),
    usePanelCardContext: jest.fn(() => mockedDataSource),
  };
});

const mockedUsePanelCardContext = Components.usePanelCardContext as jest.Mock;

const parameters = [
  { key: 'amount-change-text', value: 'Change due to investment performance' },
  { key: 'rate-of-return-text', value: 'Personal rate of return' },
  { key: 'rate-of-return-tooltip-key', value: 'tooltip-personal-rate-of-return-explained' },
  { key: 'positive-icon-key', value: 'trending-up-outline' },
  { key: 'positive-icon-alt-text', value: 'Increase in returns' },
  { key: 'negative-icon-key', value: 'trending-down-outline' },
  { key: 'negative-icon-alt-text', value: 'Decrease in returns' },
];

describe('CheckOnGrowthBlock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders loading state', () => {
    mockedDataSource.dataSource.isLoading = true;
    render(<CheckOnGrowthBlock id="block-id" parameters={parameters} />);
    expect(screen.getByTestId('chart-loader')).toBeInTheDocument();
  });
  it('renders with zero values', () => {
    mockedDataSource.dataSource.isLoading = false;
    mockedDataSource.dataSource.dataSource.result.data.changeInValue = 0;
    mockedDataSource.dataSource.dataSource.result.data.personalRateOfReturn = 0;
    mockedUsePanelCardContext.mockReturnValueOnce({
      dataSource: {
        isLoading: false,
        isError: false,
        isSuccess: true,
        isEmpty: false,
        dataSource: {
          result: {
            data: {
              changeInValue: 0,
              personalRateOfReturn: 0,
            },
          },
        },
      },
    });
    render(<CheckOnGrowthBlock id="block-id" parameters={parameters} />);
    expect(screen.getByTestId('check-growth')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('Personal rate of return')).toBeInTheDocument();
  });
  it('renders with positive values', () => {
    mockedDataSource.dataSource.dataSource.result.data.changeInValue = 9133.67;
    mockedDataSource.dataSource.dataSource.result.data.personalRateOfReturn = 5.0168;
    render(<CheckOnGrowthBlock id="block-id" parameters={parameters} />);
    expect(screen.getByTestId('check-growth')).toBeInTheDocument();
    expect(screen.getByText('+[[currency:GBP]]9,133.67')).toBeInTheDocument();
    expect(screen.getByText('5.02%')).toBeInTheDocument();
  });
  it('renders with negative values', () => {
    mockedDataSource.dataSource.dataSource.result.data.changeInValue = -2500.5;
    mockedDataSource.dataSource.dataSource.result.data.personalRateOfReturn = -3.4;
    render(<CheckOnGrowthBlock id="block-id" parameters={parameters} />);
    expect(screen.getByTestId('check-growth')).toBeInTheDocument();
    expect(screen.getByText('-[[currency:GBP]]2,500.50')).toBeInTheDocument();
    expect(screen.getByText('3.4%')).toBeInTheDocument();
  });
});
