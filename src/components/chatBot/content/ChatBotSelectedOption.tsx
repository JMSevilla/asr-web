import { Box, Stack } from '@mui/material';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { ParsedHtml } from '../../ParsedHtml';

interface Props {
  text: string;
}

export const ChatBotSelectedOption: React.FC<Props> = ({ text }) => {
  const { labelByKey } = useGlobalsContext();
  return (
    <Stack className="selected-option" position="relative" width="100%" mt={3} alignItems="flex-end">
      <Box component="span" className="visually-hidden">
        {labelByKey('virtual_assistant_user_question')}
      </Box>
      <Box
        p={3}
        alignSelf="flex-end"
        width="fit-content"
        maxWidth="80%"
        borderRadius="6px 6px 0px 6px"
        bgcolor="primary.main"
        color="primary.contrastText"
      >
        <ParsedHtml html={text} fontSize={theme => theme.typography.caption.fontSize} />
      </Box>
    </Stack>
  );
};
