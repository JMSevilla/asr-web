import { Box, Button } from '@mui/material';
import { ParsedHtml } from '../../ParsedHtml';

interface Props {
  text: string;
  disabled?: boolean;
  onClick(): void;
}

export const ChatBotOption: React.FC<Props> = ({ text, disabled, onClick }) => (
  <Box alignSelf="flex-end" width="fit-content">
    <Button color="secondary" variant="outlined" disabled={disabled} onClick={onClick}>
      <ParsedHtml html={text} fontSize={theme => theme.typography.caption.fontSize} textAlign="left" />
    </Button>
  </Box>
);
