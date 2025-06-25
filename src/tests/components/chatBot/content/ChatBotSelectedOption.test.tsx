import { ChatBotSelectedOption } from '../../../../components/chatBot/content/ChatBotSelectedOption';
import { render, screen } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../core/router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../../../../cms/inject-tokens', () => ({ useTokenEnrichedValue: () => 'text' }));

describe('ChatBotSelectedOption', () => {
  it('should render with correct text', () => {
    render(<ChatBotSelectedOption text="text" />);
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
