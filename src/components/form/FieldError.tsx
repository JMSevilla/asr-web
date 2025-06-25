import { InfoOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { InterpolationTokens } from '../../cms/types';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';

interface Props {
  tokens?: InterpolationTokens;
  messageKey: string;
  bolded?: boolean;
}

export const FieldError: React.FC<Props> = ({ messageKey, bolded = false, tokens }) => {
  const { errorByKey } = useGlobalsContext();

  return (
    <Typography color="error" fontWeight={bolded ? 'bold' : 'normal'}>
      <Box sx={{ mt: '10px' }} display="flex" alignItems="center" gap={2}>
        <InfoOutlined sx={{ color: 'error' }} />
        {errorByKey(messageKey, tokens)}
      </Box>
    </Typography>
  );
};
