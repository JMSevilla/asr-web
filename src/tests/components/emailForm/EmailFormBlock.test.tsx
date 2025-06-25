import { ComponentProps } from 'react';
import { EmailFormBlock } from '../../../components';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { act, fireEvent, render, screen, userEvent } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useScroll', () => ({
  useScroll: () => ({
    scrollTop: jest.fn(),
  }),
}));
jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
  }),
}));
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: { data: { email: null } },
    loading: false,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    error: undefined,
    result: { data: {} },
    execute: () => ({ data: { emailConfirmationToken: null } }),
  }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ fastForward: { shouldGoToSummary: jest.fn().mockReturnValue(false) } }),
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({
    updateCmsToken: (_: string, __: unknown) => {},
  }),
}));

jest.mock('../../../core/contexts/NotificationsContext', () => ({
  useNotificationsContext: jest.fn().mockReturnValue({ showNotifications: jest.fn(), hideNotifications: jest.fn() }),
}));

const DEFAULT_PROPS: ComponentProps<typeof EmailFormBlock> = {
  id: 'id',
  pageKey: 'pageKey',
  parameters: [
    { key: 'hide_save_and_close', value: 'true' },
    { key: 'success_next_page', value: '/success' },
    { key: 'close_next_page', value: '/close' },
    { key: 'save_and_exit_button', value: 'save_and_exit_button' },
  ],
  isStandAlone: false,
  journeyType: 'bereavement',
};

describe('EmailFormBlock', () => {
  it('renders the component correctly', () => {
    render(<EmailFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('email_form')).toBeInTheDocument();
  });

  it('should render correct buttons', () => {
    render(<EmailFormBlock {...DEFAULT_PROPS} />, undefined, {
      buttons: [
        { elements: { buttonKey: { value: 'content-button-block' } }, type: 'button' },
        { elements: { buttonKey: { value: 'close_app_save_and_exit' } }, type: 'button' },
        { elements: { buttonKey: { value: 'close' } }, type: 'button' },
      ],
    });
    expect(screen.getByTestId('content-button-block')).toBeInTheDocument();
    expect(screen.queryByTestId('close_app_save_and_exit')).toBeNull();
    expect(screen.queryByTestId('close')).toBeNull();
  });

  it('should submit on continue button click', async () => {
    const mockExecute = jest.fn();
    jest.mocked(useCachedAccessKey).mockReturnValue({ data: { contentAccessKey: 'contentAccessKey' } } as any);
    jest.mocked(useApiCallback).mockReturnValue({ execute: mockExecute } as any);

    render(<EmailFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('continue')).toBeEnabled();
    const input = screen.getByTestId('email_form').querySelector('input');

    await act(async () => {
      input && fireEvent.click(input);
      input && fireEvent.change(input, { target: { value: 'johndoetest@test.com' } });
      input && (await userEvent.tab());
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('continue'));
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledWith({
      emailAddress: 'johndoetest@test.com',
      contentAccessKey: 'contentAccessKey',
    });
  });
});
