import { ChatBotActions } from '../../../components/chatBot/ChatBotActions';
import { isButtonLabelNotFound } from '../../../core/genesys';
import { act, render, screen, userEvent } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useGenesys', () => ({
  startTalk: jest.fn(),
  shouldHideDefaultChat: false,
}));
jest.mock('../../../core/genesys', () => ({
  isButtonLabelNotFound: jest.fn(),
}));

describe('ChatBotActions', () => {
  it('should not render talk to a human button', () => {
    render(
      <ChatBotActions
        shouldHideHelpWidget={true}
        onBackToStartClick={jest.fn()}
        onStartTalk={jest.fn()}
        isGenesysEnabled={false}
        shouldHideLiveChat={true}
      />,
    );
    expect(screen.queryByTestId('talk-to-human-btn')).not.toBeInTheDocument();
  });

  it('should render talk to a human button', () => {
    jest.mocked(isButtonLabelNotFound).mockReturnValue(false);
    render(
      <ChatBotActions
        shouldHideHelpWidget={false}
        onBackToStartClick={jest.fn()}
        onStartTalk={jest.fn()}
        isGenesysEnabled={true}
        shouldHideLiveChat={false}
      />,
    );
    expect(screen.queryByTestId('talk-to-human-btn')).toBeInTheDocument();
  });

  it('should call onBackToStartClick when back to start button is clicked', async () => {
    jest.mocked(isButtonLabelNotFound).mockReturnValue(false);
    const onBackToStartClick = jest.fn();
    render(
      <ChatBotActions
        shouldHideHelpWidget={false}
        onBackToStartClick={onBackToStartClick}
        onStartTalk={jest.fn()}
        isGenesysEnabled={true}
        shouldHideLiveChat={false}
      />,
    );
    await act(async () => {
      await userEvent.click(screen.getByTestId('back-to-start-btn'));
    });
    expect(onBackToStartClick).toHaveBeenCalled();
    expect(screen.queryByTestId('talk-to-human-btn')).toBeInTheDocument();
  });
});
