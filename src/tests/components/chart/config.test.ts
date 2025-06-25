import { average } from '../../../business/numbers';
import { useChartConfig } from '../../../components/blocks/chart/config';
import { act, renderHook } from '../../common';
import mockedData from './chartDataMock.json';
import './setup';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

describe('useChartConfig', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return correct height', async () => {
    const { result } = renderHook(() => useChartConfig({}));

    expect(result.current.height).toBe(150);

    act(() => {
      const div = document.createElement('div');
      Object.defineProperty(div, 'clientWidth', { value: 100 });
      Object.defineProperty(div, 'clientHeight', { value: 200 });
      result.current.ref(div);
    });

    act(() => {
      jest.runAllTimers();
    });

    act(() => {
      const div = document.createElement('div');
      Object.defineProperty(div, 'clientWidth', { value: 300 });
      Object.defineProperty(div, 'clientHeight', { value: 200 });
      result.current.ref(div);
      jest.runAllTimers();
    });

    expect(result.current.height).toBe(150);
  });

  it('should return correct height when heightToWidthRatio is provided', async () => {
    const { result } = renderHook(() => useChartConfig({ heightToWidthRatio: 0.25 }));

    expect(result.current.height).toBe(150);

    act(() => {
      const div = document.createElement('div');
      Object.defineProperty(div, 'clientWidth', { value: 1000 });
      Object.defineProperty(div, 'clientHeight', { value: 500 });
      result.current.ref(div);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.height).toBe(250);
  });

  it('should return correct height when fullHeight is true', async () => {
    const { result } = renderHook(() => useChartConfig({ fullHeight: true }));

    expect(result.current.height).toBe(150);

    act(() => {
      const div = document.createElement('div');
      Object.defineProperty(div, 'clientWidth', { value: 100 });
      Object.defineProperty(div, 'clientHeight', { value: 200 });
      result.current.ref(div);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.height).toBe(200);
  });

  it('should return correct area config', () => {
    const { result } = renderHook(() => useChartConfig({ type: 'Area', ...mockedData }));
    expect(result.current.config.type).toBe('stackedarea2d');
    expect(result.current.config.dataSource.dataset).toHaveLength(mockedData.datasets.length);
    expect(result.current.config.dataSource.categories).toHaveLength(1);
    expect(result.current.config.dataSource.categories?.[0].category).toHaveLength(mockedData.datasets[0].data.length);
  });

  it('should return correct column config', () => {
    const { result } = renderHook(() => useChartConfig({ type: 'Column', ...mockedData }));
    expect(result.current.config.type).toBe('column2d');
    expect(result.current.config.dataSource.data).toHaveLength(mockedData.data.length);
  });

  it('should return correct doughnut config', () => {
    const { result } = renderHook(() => useChartConfig({ type: 'Doughnut', ...mockedData }));
    expect(result.current.config.type).toBe('doughnut2d');
    expect(result.current.config.dataSource.data).toHaveLength(mockedData.data.length);
  });

  it('should display up to 21 characters, excluding ellipsis', () => {
    global.innerWidth = 500;
    const { result } = renderHook(() => useChartConfig({ type: 'Doughnut', ...mockedData }));
    const firstIndexResult = result.current.config.dataSource.data?.[0].label;
    const sliced = firstIndexResult ? firstIndexResult.slice(0, -3) : '';
    const totalValue = mockedData.data.reduce((sum, item) => sum + Number(item.value), 0);
    const percentLegendLength = mockedData.data.map(item => ({
      label: item.label,
      percentage: Math.round((Number(item.value) / totalValue) * 100).toString().length + 2,
    }));
    const limited = sliced.length + Number(percentLegendLength[0].percentage);
    expect(limited).toBe(21);
  });

  it('should display label with ellipsis if exceeds 21 characters and screen is big', () => {
    global.innerWidth = 500;
    const { result } = renderHook(() => useChartConfig({ type: 'Doughnut', ...mockedData }));
    expect(result.current.config.dataSource.data?.[0].label).toBe('Equity Investment...');
  });

  it('calculates avg value correctly', () => {
    const { result } = renderHook(() => useChartConfig({ type: 'Doughnut', ...mockedData }));
    expect(result.current.config.dataSource.trendlines).toHaveLength(1);
    expect(result.current.config.dataSource.trendlines?.[0].line?.[0].startvalue).toBe(
      average(mockedData.data?.map(a => Number(a.value))),
    );

    const { result: result2 } = renderHook(() => useChartConfig({ type: 'Area', ...mockedData }));
    expect(result2.current.config.dataSource.trendlines).toHaveLength(1);
    expect(result2.current.config.dataSource.trendlines?.[0].line?.[0].startvalue).toBe(
      average(mockedData.datasets?.flatMap(a => a.data.map(b => Number(b.value)))),
    );
  });
});
