import { Box, Stack, Typography } from '@mui/material';
import { differenceInMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { EvaIcon, ParsedHtml } from '../..';
import { formatTime } from '../../../business/dates';
import { textInHtml } from '../../../business/strings';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { ChatBotMessageLoader } from './ChatBotMessageLoader';

interface Props {
  timestamp?: Date;
  loading?: boolean;
  text?: string;
}

export const ChatBotMessage: React.FC<Props> = ({ loading, text, timestamp }) => {
  const { labelByKey } = useGlobalsContext();
  const [justNow, setJustNow] = useState<boolean>(!!(timestamp && differenceInMinutes(new Date(), timestamp) === 0));
  const messages = text ? splitAnswersByLineBreaks(text).filter(textInHtml) : [];

  useEffect(() => {
    if (!timestamp) {
      return;
    }
    const intervalId = setTimeout(() => setJustNow(false), 1000 * 60);
    return () => clearInterval(intervalId);
  }, [timestamp]);

  return (
    <Stack spacing={1} className="message-wrapper" position="relative">
      <Typography variant="sublabel" aria-hidden="true" ml={theme => theme.spacing(9.5) + '!important'}>
        {labelByKey('virtual_assistant_name')}
      </Typography>
      <Stack spacing={2} direction="row" alignItems="flex-end">
        <Box
          data-testid="assistant-logo"
          borderRadius="50%"
          bgcolor="primary.main"
          minWidth={28}
          height={28}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ svg: { fill: theme => theme.palette.primary.contrastText } }}
        >
          <EvaIcon name="person-outline" width={22} height={22} ariaHidden />
        </Box>
        <Box component="span" className="visually-hidden">
          {labelByKey('virtual_assistant_says')}
        </Box>
        {loading && (
          <Box
            className="message-loader"
            py={3}
            px={2.5}
            bgcolor="appColors.incidental.035"
            borderRadius="6px 6px 6px 0px"
          >
            <Box className="visually-hidden">{labelByKey('virtual_assistant_loading')}</Box>
            <ChatBotMessageLoader />
          </Box>
        )}
        {!!messages.length && (
          <Stack spacing={3}>
            {messages.map((html, idx) => (
              <Box
                key={idx}
                className="message-bubble"
                alignSelf="flex-start"
                width="fit-content"
                maxWidth="80%"
                borderRadius="6px 6px 6px 0px"
                bgcolor="appColors.incidental.035"
                color="text.primary"
                p={3}
              >
                <ParsedHtml
                  html={html}
                  sx={{ overflowWrap: 'break-word' }}
                  fontSize={theme => theme.typography.caption.fontSize}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
      {!!timestamp && (
        <Typography
          className="message-timestamp"
          aria-label={labelByKey('time_stamp')}
          variant="sublabel"
          ml={theme => theme.spacing(9.5) + '!important'}
        >
          {justNow ? labelByKey('virtual_assistant_just_now') : formatTime(timestamp)}
        </Typography>
      )}
    </Stack>
  );
};

function splitAnswersByLineBreaks(answers: string) {
  return answers.split('\n\n');
}
