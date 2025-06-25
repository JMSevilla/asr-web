import { ChatBotToggleButton } from '../../../components/chatBot/ChatBotToggleButton';
import { act, render, screen, userEvent } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useCmsAsset', () => ({
  useCachedCmsAsset: () => 'image',
}));

describe('ChatBotToggleButton', () => {
  it('should render', () => {
    render(<ChatBotToggleButton isOpen={false} onOpen={jest.fn()} onClose={jest.fn()} />);
  });

  it('should call onOpen when button is clicked', async () => {
    const onOpen = jest.fn();
    render(<ChatBotToggleButton isOpen={false} onOpen={onOpen} onClose={jest.fn()} />);
    await act(async () => {
      await userEvent.click(screen.getByTestId('chatbot-toggle-button'));
    });
    expect(onOpen).toHaveBeenCalled();
  });

  it('should call onClose when button is clicked', async () => {
    const onClose = jest.fn();
    render(<ChatBotToggleButton isOpen={true} onOpen={jest.fn()} onClose={onClose} />);
    await act(async () => {
      await userEvent.click(screen.getByTestId('chatbot-toggle-button'));
    });
    expect(onClose).toHaveBeenCalled();
  });
});
