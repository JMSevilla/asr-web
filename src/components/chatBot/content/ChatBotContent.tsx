import { Box, Button, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { mixpanelTrackButtonClick } from '../../../core/mixpanel-tracker';
import { ChatBotOptionsSegment } from '../hooks';
import { ChatBotMessage } from './ChatBotMessage';
import { ChatBotOption } from './ChatBotOption';
import { ChatBotSelectedOption } from './ChatBotSelectedOption';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  allOptions: ChatBotOptionsSegment[];
  selectedOptionText?: string;
  onOptionSelected(answerKey: string): void;
}

export const ChatBotContent: React.FC<Props> = ({
  isOpen,
  isLoading,
  allOptions,
  selectedOptionText,
  onOptionSelected,
}) => {
  const { labelByKey } = useGlobalsContext();
  const ref = useRef<HTMLDivElement>(null);
  const lastSegmentRef = useRef<HTMLDivElement>(null);

  const [messagesToShow, setMessagesToShow] = useState<ChatBotOptionsSegment[]>([]);
  const [showNewestMessage, setShowNewestMessage] = useState(false);
  const slicedMessages = allOptions.slice(-10);

  useEffect(() => {
    setMessagesToShow(allOptions.slice(-10));
  }, [allOptions]);

  useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [isOpen]);

  useEffect(() => {
    setTimeout(() => {
      isOpen && scrollToBottom();
    }, 100);
  }, [isOpen, isLoading, messagesToShow, selectedOptionText]);

  const loadMoreMessages = () => {
    const startIndex = Math.max(0, allOptions.length - messagesToShow.length - 10);
    const newMessages = allOptions.slice(startIndex, allOptions.length - messagesToShow.length);
    setMessagesToShow(prev => [...newMessages, ...prev]);
    setShowNewestMessage(true);
  };

  const showNewestMessages = () => {
    setMessagesToShow(allOptions.slice(-10));
    setShowNewestMessage(false);
  };

  return (
    <Stack
      id="chatbot-content"
      data-testid="chatbot-content"
      tabIndex={isOpen ? 0 : -1}
      aria-live="polite"
      height={480}
      maxHeight={{ sm: '45vh', md: '60vh', lg: 'unset' }}
      flex={{ xs: 1, sm: 'unset' }}
      spacing={3}
      px={4}
      py={3}
      ref={ref}
      sx={{ overflowY: 'scroll', overflowX: 'hidden' }}
    >
      {messagesToShow.length < allOptions.length && (
        <Button onClick={loadMoreMessages}>{labelByKey('load-more')}</Button>
      )}
      <Box flex={1}></Box>
      {slicedMessages.map((option, index) => (
        <Stack
          key={index}
          ref={index === messagesToShow.length - 1 ? lastSegmentRef : undefined}
          className="virtual-assistant-chat"
          spacing={3}
        >
          <ChatBotMessage text={option.answerText} timestamp={option.timestamp} />
          {!!option.subsequentOptions.length && (
            <Stack className="options" position="relative" alignItems="flex-end">
              <Box component="span" className="visually-hidden">
                {labelByKey('virtual_assistant_options_count', { count: option.subsequentOptions.length.toString() })}
              </Box>
              <Stack
                component="ul"
                className="options-list"
                spacing={3}
                alignItems="flex-end"
                sx={{ listStyle: 'none', marginBlock: 0, li: { display: 'flex', justifyContent: 'flex-end' } }}
              >
                {option.subsequentOptions.map(subOption => (
                  <li key={subOption.optionKey}>
                    <ChatBotOption
                      text={subOption.optionText}
                      disabled={disableSubsequentOptions(index) || isLoading}
                      onClick={handleOptionSelect(subOption.optionKey, subOption.optionText)}
                    />
                  </li>
                ))}
              </Stack>
              {!!optionSelectionText(index) && <ChatBotSelectedOption text={optionSelectionText(index)!} />}
            </Stack>
          )}
        </Stack>
      ))}
      {isLoading && <ChatBotMessage loading />}
      {showNewestMessage && <Button onClick={showNewestMessages}>{labelByKey('newest-message')}</Button>}
    </Stack>
  );

  function handleOptionSelect(optionKey: string, optionText: string) {
    return () => {
      onOptionSelected(optionKey);
      mixpanelTrackButtonClick({
        Category: optionText,
      });
    };
  }

  function scrollToBottom() {
    if (!ref.current) {
      return;
    }
    if (isLoading) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
      return;
    }
    const top = lastSegmentRef.current ? lastSegmentRef.current.offsetTop - 68 : ref.current.scrollHeight;
    ref.current.scrollTo({ top: top, behavior: 'smooth' });
  }

  function disableSubsequentOptions(index: number) {
    return !!(slicedMessages[index + 1]?.optionKey || selectedOptionText);
  }

  function optionSelectionText(index: number) {
    const nextOption = slicedMessages[index + 1];
    if (nextOption && nextOption.optionText && nextOption.optionText !== 'START') {
      return nextOption.optionText;
    }
    return selectedOptionText;
  }
};
