import { Box, BoxProps } from '@mui/material';
import { AnimatedBoxSkeleton } from '../animations';

interface Props {
  light?: boolean;
  width?: BoxProps['width'];
  height?: BoxProps['height'];
}

export const ButtonLoader: React.FC<Props> = ({ light = true, width = 150, height = 70 }) => {
  return (
    <Box data-testid="button-loader" height={height} width={width}>
      <AnimatedBoxSkeleton pt={4} pb={2} pl={4} pr={2} light={light} />
    </Box>
  );
};
