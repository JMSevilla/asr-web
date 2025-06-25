import { Close } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { ChatBotLogo } from './ChatBotLogo';

interface Props {
  onClose(): void;
}

export const ChatBotHeader: React.FC<Props> = ({ onClose }) => {
  const { labelByKey } = useGlobalsContext();

  return (
    <Stack
      width="100%"
      height={64}
      p={4}
      pr={2}
      bgcolor="primary.main"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      color="primary.contrastText"
      data-testid="chatbot-header"
    >
      <Typography id="chatbot-title" className="visually-hidden" variant="h1" tabIndex={-1}>
        {labelByKey('virtual_assistant_title')}
      </Typography>
      <ChatBotLogo width={70} height={28} />
      <Box>
        <IconButton
          data-testid="close-btn"
          aria-label={labelByKey('virtual_assistant_close')}
          size="small"
          color="inherit"
          onClick={onClose}
          LinkComponent="button"
        >
          <Close aria-hidden="true" />
          <Typography className="visually-hidden">{labelByKey('virtual_assistant_close')}</Typography>
        </IconButton>
      </Box>
    </Stack>
  );
};
