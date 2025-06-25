import { ComponentProps } from 'react';
import { PensionWiseOptOutDeclarationFormBlock } from '../../components/blocks/pensionWiseOptOutForm/PensionWiseOptOutDeclarationFormBlock';
import { useApiCallback } from '../../core/hooks/useApi';
import { act, fireEvent, render, screen, userEvent } from '../common';

const DEFAULT_PROPS: ComponentProps<typeof PensionWiseOptOutDeclarationFormBlock> = {
  id: 'id',
  formKey: 'formKey',
  pageKey: 'pageKey',
  parameters: [
    { key: 'success_next_page', value: 'expectedNextPageKey' },
    { key: 'save_and_exit_button', value: 'save_and_exit_button' },
    { key: 'hide_save_and_close', value: 'true' },
  ],
  isCloseButtonHidden: false,
};

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: { data: { optOutPensionWise: false } },
    loading: false,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false, error: false }),
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    parseUrlAndPush: jest.fn(),
  }),
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ fastForward: { shouldGoToSummary: jest.fn().mockReturnValue(false) } }),
}));

describe('PensionWiseOptOutDeclarationFormBlock', () => {
  it('renders the component correctly', () => {
    render(<PensionWiseOptOutDeclarationFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('pension-wise-opt-out-declaration-form')).toBeEnabled();
  });

  it('should render correct buttons', () => {
    render(<PensionWiseOptOutDeclarationFormBlock {...DEFAULT_PROPS} />, undefined, {
      buttons: [
        { elements: { buttonKey: { value: 'content-button-block' } }, type: 'button' },
        { elements: { buttonKey: { value: 'close_app_save_and_exit' } }, type: 'button' },
      ],
    });
    expect(screen.getByTestId('content-button-block')).toBeInTheDocument();
    expect(screen.queryByTestId('close_app_save_and_exit')).not.toBeInTheDocument();
  });

  it('should submit on continue button click', async () => {
    const optOutPensionWise = true;
    const mockExecute = jest.fn();
    jest.mocked(useApiCallback).mockReturnValue({ execute: mockExecute } as any);

    render(<PensionWiseOptOutDeclarationFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('continue')).toBeEnabled();
    const input = screen.getByTestId('pension-wise-opt-out-declaration-form').querySelector('input');

    expect(screen.getByTestId('continue')).toBeEnabled();

    await act(async () => {
      input && fireEvent.click(input);
      input && fireEvent.change(input, { target: { value: true } });
      input && (await userEvent.tab());
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('continue'));
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledWith({ optOutPensionWise: optOutPensionWise });
  });
});
