import { ChartBlock } from '../../../components/blocks/chart/ChartBlock';
import { useApi } from '../../../core/hooks/useApi';
import { act, render, screen } from '../../common';
import mockedData from './chartDataMock.json';
import './setup';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useApi');
jest.mock('../../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({ update: jest.fn() }),
}));
jest.mock('react-fusioncharts', () => ({ __esModule: true, default: { fcRoot: jest.fn() } }));
jest.mock('fusioncharts', () => ({ __esModule: true, default: jest.fn(), options: { license: jest.fn() } }));
jest.mock('fusioncharts/fusioncharts.charts', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('fusioncharts/themes/fusioncharts.theme.fusion.js', () => ({ __esModule: true, default: jest.fn() }));

describe('ChartBlock', () => {
  console.error = jest.fn();

  it('should render loader if chart is loading', () => {
    jest.mocked(useApi).mockReturnValue({ loading: true, result: { data: null } } as any);
    act(() => {
      render(<ChartBlock id="chart" sourceUrl="source" />);
    });
    expect(screen.getByTestId('chart-loader')).toBeInTheDocument();
  });

  it('should render no data message if chart has no data', () => {
    jest.mocked(useApi).mockReturnValue({ loading: false, result: { data: null } } as any);
    act(() => {
      render(<ChartBlock id="chart" sourceUrl="source" />);
    });
    expect(screen.getByTestId('chart-no-data')).toBeInTheDocument();
  });

  it('should render chart if chart has data', () => {
    jest.mocked(useApi).mockReturnValue({ loading: false, result: { data: mockedData } } as any);
    act(() => {
      render(<ChartBlock id="chart" sourceUrl="source" />);
    });
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
