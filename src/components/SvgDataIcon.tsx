import { Box, useTheme } from '@mui/material';
import React from 'react';

interface Props {
  svgData: string;
  height?: string | number;
  width?: string | number;
  swapColor?: string;
}

export const SvgDataIcon: React.FC<Props> = ({ svgData, swapColor, width, height }) => {
  const theme = useTheme();

  return (
    <Box
      component="i"
      aria-hidden={true}
      className="svg-data-icon"
      data-testid="svg-data-icon"
      width={width}
      height={height}
      overflow="auto"
      position="relative"
      dangerouslySetInnerHTML={{ __html: updateSize(updateColor(svgData, swapColor), width, height) }}
    />
  );

  function updateColor(svgData: string, color?: string) {
    if (!color) return svgData;
    return svgData.replace(new RegExp(color, 'g'), theme.palette.primary.main);
  }

  function updateSize(svgData: string, width: number | string = '100%', height: number | string = '100%') {
    return svgData.replace(/<svg width=\"\d+\" height=\"\d+\"/g, `<svg width="${width}" height="${height}"`);
  }
};
