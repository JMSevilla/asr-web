import { ComponentProps } from 'react';
import { BereavementSubmitFormBlock } from '../../components';
import { config } from '../../config';
import { useBereavementSession } from '../../core/contexts/bereavement/BereavementSessionContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useRouter } from '../../core/router';
import { fireEvent, render, screen, waitFor } from '../common';

const DEFAULT_PROPS: ComponentProps<typeof BereavementSubmitFormBlock> = { id: 'id', pageKey: 'page', parameters: [] };

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: {
    get value() {
      return {};
    },
  },
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ parsing: false, parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../core/contexts/bereavement/BereavementSessionContext', () => ({
  useBereavementSession: jest.fn().mockReturnValue({ bereavementSubmit: jest.fn() }),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({ loading: false, data: null, error: false }),
}));

jest.mock('../../core/contexts/NotificationsContext', () => ({
  useNotificationsContext: jest.fn().mockReturnValue({ showNotifications: jest.fn(), hideNotifications: jest.fn() }),
}));

describe('BereavementSubmitFormBlock', () => {
  it('should have enabled button by default', () => {
    render(<BereavementSubmitFormBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('bereavement-submit-btn')).not.toHaveClass('disabled');
  });

  it('should call bereavementSubmit, registerStep and parseUrlAndPush functions on button click', async () => {
    jest.spyOn(config, 'value', 'get').mockReturnValue({} as any);
    const bereavementSubmitFn = jest.fn();
    jest.mocked(useBereavementSession).mockReturnValue({ bereavementSubmit: bereavementSubmitFn } as any);
    const registerStepFn = jest.fn();
    jest.mocked(useApiCallback).mockReturnValue({ execute: registerStepFn } as any);
    const parseUrlAndPushFn = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ parsing: false, parseUrlAndPush: parseUrlAndPushFn } as any);
    render(<BereavementSubmitFormBlock {...DEFAULT_PROPS} />);
    const bereavementSubmitBtn = screen.queryByTestId('bereavement-submit-btn');
    bereavementSubmitBtn && fireEvent.click(bereavementSubmitBtn);

    await waitFor(() => {
      expect(bereavementSubmitFn).toBeCalledTimes(1);
      expect(registerStepFn).toBeCalledTimes(1);
      expect(parseUrlAndPushFn).toBeCalledTimes(1);
    });
  });
});
