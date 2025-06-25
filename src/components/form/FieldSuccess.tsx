import { Typography } from '@mui/material';
import { InterpolationTokens } from '../../cms/types';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
interface Props {
  tokens?: InterpolationTokens;
  messageKey: string;
  bolded?: boolean;
}

export const FieldSuccess: React.FC<Props> = ({ messageKey, bolded = true, tokens }) => {
  const { labelByKey } = useGlobalsContext();

  return (
    <Typography color="success" fontWeight={bolded ? 'bold' : 'normal'}>
      {labelByKey(messageKey, tokens)}
    </Typography>
  );
};
