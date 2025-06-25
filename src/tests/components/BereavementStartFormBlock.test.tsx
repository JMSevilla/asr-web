import { ComponentProps } from 'react';
import { BereavementStartFormBlock } from '../../components';
import { config } from '../../config';
import { useBereavementSession } from '../../core/contexts/bereavement/BereavementSessionContext';
import { usePersistentAppState } from '../../core/contexts/persistentAppState/PersistentAppStateContext';
import { BereavementFormStatus } from '../../core/contexts/persistentAppState/hooks/bereavement/form';
import { useRouter } from '../../core/router';
import { fireEvent, render, screen, waitFor } from '../common';

const DEFAULT_PROPS: ComponentProps<typeof BereavementStartFormBlock> = { id: 'id', pageKey: 'key', parameters: [] };

jest.mock('../../config', () => ({
  config: {
    get value() {
      return { RECAPTCHA_KEY: 'recaptcha_mocked_key' };
    },
  },
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../core/contexts/bereavement/BereavementSessionContext', () => ({
  useBereavementSession: jest
    .fn()
    .mockReturnValue({ bereavementLogin: jest.fn(), bereavementRestart: jest.fn(), bereavementContinue: jest.fn() }),
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: { status: 'NotStarted' } } }),
}));

jest.mock('../../core/contexts/NotificationsContext', () => ({
  useNotificationsContext: jest.fn().mockReturnValue({ showNotifications: jest.fn(), hideNotifications: jest.fn() }),
}));

describe('BereavementStartFormBlock', () => {
  it('should have disabled start button by default', () => {
    render(<BereavementStartFormBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('bereavement-start-btn')).toHaveClass('disabled');
  });

  it('should have enabled start button if SUPPRESS_RECAPTCHA is true', () => {
    jest
      .spyOn(config, 'value', 'get')
      .mockReturnValue({ RECAPTCHA_KEY: 'recaptcha_mocked_key', SUPPRESS_RECAPTCHA: true } as any);
    render(<BereavementStartFormBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('bereavement-start-btn')).not.toHaveClass('disabled');
  });

  it('should call bereavementLogin and parseUrlAndPush functions on start button click', async () => {
    jest
      .spyOn(config, 'value', 'get')
      .mockReturnValue({ RECAPTCHA_KEY: 'recaptcha_mocked_key', SUPPRESS_RECAPTCHA: true } as any);
    const bereavementLoginFn = jest.fn();
    jest.mocked(useBereavementSession).mockReturnValue({
      bereavementLogin: bereavementLoginFn,
      bereavementRestart: jest.fn(),
      bereavementContinue: jest.fn(),
    } as any);
    const parseUrlAndPushFn = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush: parseUrlAndPushFn } as any);
    render(<BereavementStartFormBlock {...DEFAULT_PROPS} />);
    const bereavementStartBtn = screen.queryByTestId('bereavement-start-btn');
    bereavementStartBtn && fireEvent.click(bereavementStartBtn);

    await waitFor(() => {
      expect(bereavementLoginFn).toBeCalledTimes(1);
      expect(parseUrlAndPushFn).toBeCalledTimes(1);
    });
  });

  it('should call bereavementContinue and parseUrlAndPush functions on continue button click', async () => {
    jest
      .mocked(usePersistentAppState)
      .mockReturnValue({ bereavement: { form: { status: BereavementFormStatus.Started } } } as any);
    const bereavementContinueFn = jest.fn();
    jest.mocked(useBereavementSession).mockReturnValue({
      bereavementLogin: jest.fn(),
      bereavementRestart: jest.fn(),
      bereavementContinue: bereavementContinueFn,
    } as any);
    const parseUrlAndPushFn = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush: parseUrlAndPushFn } as any);
    render(<BereavementStartFormBlock {...DEFAULT_PROPS} />);
    const bereavementStartBtn = screen.queryByTestId('bereavement-continue-btn');
    bereavementStartBtn && fireEvent.click(bereavementStartBtn);

    await waitFor(() => {
      expect(bereavementContinueFn).toBeCalledTimes(1);
      expect(parseUrlAndPushFn).toBeCalledTimes(1);
    });
  });

  it('should call bereavementRestart and parseUrlAndPush functions on continue button click', async () => {
    jest
      .mocked(usePersistentAppState)
      .mockReturnValue({ bereavement: { form: { status: BereavementFormStatus.Started } } } as any);
    const bereavementRestartFn = jest.fn();
    jest.mocked(useBereavementSession).mockReturnValue({
      bereavementLogin: jest.fn(),
      bereavementRestart: bereavementRestartFn,
      bereavementContinue: jest.fn(),
    } as any);
    const reloadFn = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ reload: reloadFn } as any);
    render(<BereavementStartFormBlock {...DEFAULT_PROPS} />);
    const bereavementStartBtn = screen.queryByTestId('bereavement-restart-btn');
    bereavementStartBtn && fireEvent.click(bereavementStartBtn);

    await waitFor(() => {
      expect(bereavementRestartFn).toBeCalledTimes(1);
      expect(reloadFn).toBeCalledTimes(1);
    });
  });
});
