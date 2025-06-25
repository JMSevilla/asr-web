import { memo, useEffect, useState } from 'react';
import { config } from '../../../config';
import { ChartConfig } from './config';
import ext1 from './extension/fusioncharts.ext.accessibility';
import ext2 from './extension/fusioncharts.ext.accessibility-resources-strings-en';

interface Props {
  id: string;
  colorPalette?: string[];
  chartConfig: ChartConfig['config'];
  type?: string;
}

let ReactFC: any;
let isInitialized = false;

const initializeFusionCharts = () => {
  if (isInitialized || typeof window === 'undefined') return;

  const FusionCharts = require('fusioncharts');
  const Charts = require('fusioncharts/fusioncharts.charts');
  const FusionTheme = require('fusioncharts/themes/fusioncharts.theme.fusion.js');
  ReactFC = require('react-fusioncharts').default;

  FusionCharts.options.license({ key: config.value.CHARTS_API_KEY, creditLabel: false });
  ReactFC.fcRoot(FusionCharts, Charts, FusionTheme, ext1, ext2);

  isInitialized = true;
};

const Component: React.FC<Props> = ({ chartConfig }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeFusionCharts();
    setIsReady(true);
  }, []);

  if (!isReady || !isInitialized) {
    return null;
  }

  return !process.env.JEST_WORKER_ID ? <ReactFC {...chartConfig} /> : null;
};

export const DynamicChart: React.FC<Props> = memo(Component);
