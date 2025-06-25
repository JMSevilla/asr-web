import { Box, Typography } from '@mui/material';
import { TwoColumnBlockLoader } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';

export const OptionLoader: React.FC = () => {
  const { labelByKey } = useGlobalsContext();

  return (
    <Box position="relative">
      <Box
        sx={{ backgroundColor: 'appColors.tertiary.light' }}
        color="appColors.tertiary.light"
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        top={-24}
        left={0}
        height={60}
        minWidth={140}
        px={4}
        zIndex={2}
      >
        <Typography variant="h4" fontWeight="bold">
          {labelByKey('options_option')} X
        </Typography>
      </Box>
      <TwoColumnBlockLoader />
    </Box>
  );
};
