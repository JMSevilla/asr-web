import { ChatBotWidget } from '../../../components/chatBot/ChatBotWidget';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useCmsAsset', () => ({ useCachedCmsAsset: () => 'image' }));
jest.mock('../../../core/contexts/auth/AuthContext');
jest.mock('../../../core/hooks/useGenesys', () => ({
  useGenesys: () => ({
    startTalk: jest.fn(),
    shouldHideDefaultChat: false,
  }),
}));
jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: { contentAccessKey: 'contentAccessKey' } }),
}));
jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({
    membership: null,
  }),
}));
jest.mock('../../../components/chatBot/hooks', () => ({
  useTrapContainerFocus: jest.fn(),
  useCloseOnEscClick: jest.fn(),
  useChatBotConversation: () => ({
    loading: false,
    allOptions: [],
    selectedOptionText: '',
    selectOption: jest.fn(),
    start: jest.fn(),
  }),
}));
jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: { contentAccessKey: { isWebChatEnabled: false } } }),
}));

describe('ChatBotWidget', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render null when unauthenticated', () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: false } as any);
    const mockedContentAccessKey = '{"isWebChatEnabled": false}';
    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: mockedContentAccessKey,
      },
    } as any);
    render(<ChatBotWidget />);
    expect(screen.queryByTestId('help-widget')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-toggle-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-actions')).not.toBeInTheDocument();
  });

  it('should render all needed components when authenticated', async () => {
    const mockedContentAccessKey = '{"isWebChatEnabled": true}';
    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: mockedContentAccessKey,
      },
    } as any);
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);
    render(<ChatBotWidget />);
    expect(screen.queryByTestId('help-widget')).toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-toggle-button')).toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-header')).toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-content')).toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-actions')).toBeInTheDocument();
  });
});
