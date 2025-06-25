import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { isButtonLabelNotFound } from '../../core/genesys';

interface Props {
  onBackToStartClick: () => void;
  onStartTalk: () => void;
  isGenesysEnabled: boolean;
  shouldHideHelpWidget: boolean;
  shouldHideLiveChat: boolean;
}

const BackToStartButton = ({
  onBackToStartClick,
  text,
}: {
  onBackToStartClick: Props['onBackToStartClick'];
  text: string;
}) => (
  <Button
    data-testid="back-to-start-btn"
    fullWidth
    variant="text"
    color="inherit"
    href="#chatbot-content"
    onClick={onBackToStartClick}
  >
    <Typography variant="caption" fontWeight="bold" noWrap>
      {text}
    </Typography>
  </Button>
);

const TalkToHumanButton = ({ onStartTalk, text }: { onStartTalk: Props['onStartTalk']; text: string }) => (
  <Button data-testid="talk-to-human-btn" fullWidth variant="text" color="inherit" onClick={onStartTalk}>
    <Typography variant="caption" fontWeight="bold" noWrap>
      {text}
    </Typography>
  </Button>
);

export const ChatBotActions: React.FC<Props> = ({
  onBackToStartClick,
  onStartTalk,
  isGenesysEnabled,
  shouldHideHelpWidget,
  shouldHideLiveChat,
}) => {
  const { labelByKey } = useGlobalsContext();
  const virtualTalkToHuman = labelByKey(
    shouldHideHelpWidget || shouldHideLiveChat ? 'start_a_chat' : 'virtual_assistant_talk_to_a_human',
  );
  const backToStart = labelByKey('virtual_assistant_back_to_start');
  const isGenesysLabelNotFound = isButtonLabelNotFound(virtualTalkToHuman);

  return (
    <Stack
      data-testid="chatbot-actions"
      width="100%"
      height={43}
      direction="row"
      bgcolor="primary.main"
      color="primary.contrastText"
    >
      {isGenesysEnabled ? (
        <>
          {!shouldHideHelpWidget && !isGenesysLabelNotFound ? (
            <>
              <BackToStartButton onBackToStartClick={onBackToStartClick} text={backToStart} />
              <TalkToHumanButton onStartTalk={onStartTalk} text={virtualTalkToHuman} />
            </>
          ) : (
            <>
              {shouldHideLiveChat ? (
                <TalkToHumanButton onStartTalk={onStartTalk} text={virtualTalkToHuman} />
              ) : (
                <BackToStartButton onBackToStartClick={onBackToStartClick} text={backToStart} />
              )}
            </>
          )}
        </>
      ) : (
        <BackToStartButton onBackToStartClick={onBackToStartClick} text={backToStart} />
      )}
    </Stack>
  );
};
