import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { EvaIcon, Tooltip, usePanelCardContext } from '../..';
import { CheckOnGrowthResponse } from '../../../api/mdp/types';
import { currencyValue } from '../../../business/currency';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { ChartLoader } from '../chart/ChartLoader';
interface Props {
  id: string;
  parameters: { key: string; value: string }[];
}

export const CheckOnGrowthBlock: React.FC<Props> = ({ id, parameters }) => {
  const theme = useTheme();
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const { dataSource, isCard } = usePanelCardContext();
  const data = dataSource?.dataSource?.result?.data as unknown as CheckOnGrowthResponse;

  if (!data) return null;

  if (dataSource?.isLoading) {
    return <ChartLoader id="block-loader" message={labelByKey('chart_loading')} light={false} />;
  }

  const rawChange = data?.changeInValue ?? 0;
  const rawRate = data?.personalRateOfReturn ?? 0;
  const changeInValue = Number(rawChange.toFixed(2));
  const personalRateOfReturn = Number(Math.abs(rawRate).toFixed(2));

  const sign = changeInValue > 0 ? '+' : changeInValue < 0 ? '-' : '';
  const isTrending = rawRate > 0;

  const icon = findValueByKey(isTrending ? 'positive-icon-key' : 'negative-icon-key', parameters) || '';
  const iconAlt = findValueByKey(isTrending ? 'positive-icon-alt-text' : 'negative-icon-alt-text', parameters) || '';
  const personalRateOfReturnLabel = findValueByKey('rate-of-return-text', parameters) || null;
  const changeInValueLabel = findValueByKey('amount-change-text', parameters) || null;
  const tooltip = tooltipByKey('tooltip-personal-rate-of-return-explained') || undefined;

  return (
    <Box
      key={id}
      data-testid="check-growth"
      display="flex"
      flexDirection="column"
      gap={{ xs: 2, md: 4 }}
      marginTop={{ xs: 0, md: isCard ? 0 : 4 }}
    >
      <Stack>
        <Typography variant="h1" color={colorByValue(data?.changeInValue)} fontWeight="bold">
          {sign}
          {labelByKey('currency:GBP')}
          {currencyValue(Math.abs(data?.changeInValue || 0))}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {changeInValueLabel}
        </Typography>
      </Stack>
      <Stack direction="column">
        <Stack direction="row" gap={1}>
          {personalRateOfReturn !== 0 && (
            <EvaIcon role="img" name={icon} fill={colorByValue(data?.personalRateOfReturn)} ariaLabel={iconAlt} />
          )}
          <Typography variant="body2" color={colorByValue(data?.personalRateOfReturn)} fontWeight="bold">
            {personalRateOfReturn}%
          </Typography>
        </Stack>
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {personalRateOfReturnLabel}
          </Typography>
          {tooltip && <Tooltip header={tooltip.header} html={tooltip.html} />}
        </Stack>
      </Stack>
    </Box>
  );

  function colorByValue(value: number = 0) {
    if (value > 0) {
      return theme.palette.success.main;
    }
    if (value < 0) {
      return theme.palette.error.main;
    }
    return theme.palette.text.primary;
  }
};
