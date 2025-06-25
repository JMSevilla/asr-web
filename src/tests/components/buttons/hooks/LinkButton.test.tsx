import { LinkButton } from '../../../../components';
import { useCustomAction } from '../../../../components/buttons/hooks/useCustomAction';
import { usePopupContext } from '../../../../core/contexts/PopupContextProvider';
import { act, render, screen, userEvent } from '../../../common';

const DEFAULT_PROPS: React.ComponentProps<typeof LinkButton> = {
  id: 'link',
  pageKey: 'pageKey',
  text: 'text',
  linkKey: 'string',
  journeyType: 'transfer2',
  disabled: false,
  notification: 'notification',
};

jest.mock('../../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock("'../../../../core/contexts/PopupContextProvider", () => ({
  usePopupContext: jest.fn().mockReturnValue({ show: jest.fn() }),
}));

jest.mock('../../../../components/buttons/hooks/useCustomAction', () => ({
  useCustomAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
}));

jest.mock('../../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

describe('LinkButton', () => {
  it('renders Link Button component', () => {
    render(<LinkButton {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('link')).toBeTruthy();
  });

  it('should call custom action', async () => {
    const executeFn = jest.fn();
    jest.mocked(useCustomAction).mockReturnValue({
      execute: executeFn,
      loading: false,
    });
    render(<LinkButton {...DEFAULT_PROPS} />);
    await act(async () => {
      await userEvent.click(screen.getByTestId('link'));
    });
    expect(executeFn).toBeCalledTimes(1);
  });

  it('should show popup', async () => {
    const showFn = jest.fn();
    jest.mocked(usePopupContext).mockReturnValue({
      show: showFn,
      hide: jest.fn(),
    });
    render(<LinkButton {...DEFAULT_PROPS} />);
    await act(async () => {
      await userEvent.click(screen.getByTestId('link'));
    });
    expect(showFn).toBeCalledTimes(1);
  });
});
