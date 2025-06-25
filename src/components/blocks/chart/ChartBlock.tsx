import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { memo, useEffect } from 'react';
import { MessageType } from '../..';
import { ChartData } from '../../../api/mdp/types';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi } from '../../../core/hooks/useApi';
import { ChartLoader } from './ChartLoader';
import { ChartNoDataMessage } from './ChartNoData';
import { useChartConfig } from './config';

interface Props {
  id: string;
  hideLegend?: boolean;
  xAxisName?: string;
  yAxisName?: string;
  chartKey?: string;
  sourceUrl?: string;
  customColors?: string[];
  defaultColors?: string[];
  lightLoader?: boolean;
  type?: string;
  fullHeight?: boolean;
  heightToWidthRatio?: number;
  labelLengthLimit?: number;
  loading?: boolean;
  data?: ChartData;
}

const DynamicChart = dynamic(() => import('./DynamicChart').then(c => c.DynamicChart), { ssr: false });

const Component: React.FC<Props> = ({
  id,
  chartKey,
  hideLegend,
  xAxisName,
  yAxisName,
  customColors,
  sourceUrl,
  defaultColors,
  lightLoader = true,
  type,
  fullHeight,
  heightToWidthRatio,
  labelLengthLimit,
  loading,
  data,
}) => {
  const { labelByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const chartResponse = useApi(api => (sourceUrl ? api.mdp.chartData(sourceUrl) : Promise.reject()), [sourceUrl]);
  const chartId = [id, chartKey].join('_');
  const chartData = data || chartResponse?.result?.data || ({} as ChartData);
  const colorPalette = (customColors?.length ? customColors : defaultColors) || [];
  const chart = useChartConfig({
    ...chartData,
    type,
    xAxisName,
    yAxisName,
    hideLegend,
    fullHeight,
    colorPalette,
    heightToWidthRatio,
    labelLengthLimit,
    dataEmptyMessage: labelByKey('no_chart_data'),
  });

  useEffect(() => {
    if (!chartResponse?.error) return;
    showNotifications([{ type: MessageType.Problem, message: errorByKey(String(chartResponse?.error)) }]);
    return () => hideNotifications();
  }, [chartResponse?.error]);

  if (chartResponse?.loading || loading) {
    return (
      <ChartLoader id={chartId} fullHeight={fullHeight} light={lightLoader} message={labelByKey('chart_loading')} />
    );
  }

  if ((!chartData?.data?.length && !chartData?.datasets?.length) || !DynamicChart) {
    return <ChartNoDataMessage id={chartId} fullHeight={fullHeight} text={labelByKey('no_chart_data')} />;
  }

  return (
    <Box
      id={chartId}
      ref={chart.ref}
      width="100%"
      data-testid="chart"
      height={fullHeight ? '100%' : chart.height}
      sx={{ '& svg': { backgroundColor: 'transparent !important', outline: 'none', '& *': { outline: 'none' } } }}
    >
      <DynamicChart key={chart.height} id={id} type={type} chartConfig={chart.config} colorPalette={colorPalette} />
    </Box>
  );
};

export const ChartBlock: React.FC<Props> = memo(
  props => <Component {...props} />,
  (prev, next) => prev.id === next.id && prev.chartKey === next.chartKey && prev.sourceUrl === next.sourceUrl,
);
