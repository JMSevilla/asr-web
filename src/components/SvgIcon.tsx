import { Box } from '@mui/material';
import React from 'react';
import { FileValue } from '../api/content/types/common';
import { parseImageUrl } from '../cms/parse-cms';

interface Props {
  icon: FileValue;
  width?: number;
  height?: number;
  color?: string;
  hoverColor?: string;
  mr?: number;
  ml?: number;
  className?: string;
}

export const SvgIcon: React.FC<Props> = ({
  icon,
  width = 23,
  height = 23,
  color,
  hoverColor,
  mr = 0,
  ml = 0,
  className,
}) => {
  const relativeUrl = icon?.renditions?.default?.url ?? icon?.url;

  if (!relativeUrl) {
    return null;
  }
  const url = parseImageUrl(relativeUrl);

  return (
    <Box mr={mr} ml={ml} height={height} width={width}>
      <Box
        id="icon"
        className={className}
        sx={{
          mr,
          height,
          width,
          backgroundColor: color,
          mask: `url(${url}) no-repeat center`,
          maskSize: `${width}px ${height}px`,
          '&:hover': hoverColor ? { backgroundColor: hoverColor } : {},
        }}
      />
    </Box>
  );
};
