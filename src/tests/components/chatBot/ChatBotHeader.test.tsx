import { ChatBotHeader } from '../../../components/chatBot/ChatBotHeader';
import { act, render, screen, userEvent } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useCmsAsset', () => ({
  useCachedCmsAsset: () => 'image',
}));

describe('ChatBotHeader', () => {
  it('should render', () => {
    render(<ChatBotHeader onClose={jest.fn()} />);
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    render(<ChatBotHeader onClose={onClose} />);
    await act(async () => {
      await userEvent.click(screen.getByTestId('close-btn'));
    });
    expect(onClose).toHaveBeenCalled();
  });
});
