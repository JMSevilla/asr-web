import { CustomStartTransferApplicationButtonBlock } from '../../components/blocks/CustomStartTransferApplicationButtonBlock';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';
import { act, fireEvent, render, screen, waitFor } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({
    execute: jest.fn(),
    loading: false,
  }),
}));

jest.mock('../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({
    data: {
      contentAccessKey: 'contentAccessKey',
    },
    refresh: jest.fn(),
    loading: false,
  }),
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    parseUrlAndPush: jest.fn(),
    loading: false,
    parsing: false,
  }),
}));

describe('CustomStartTransferApplicationButtonBlock', () => {
  it('should render', () => {
    render(<CustomStartTransferApplicationButtonBlock parameters={[]} buttons={[]} />);

    expect(screen.getByTestId('custom-transfer-application-block')).toBeInTheDocument();
  });

  it('call start journey, refresh access key and parse url', async () => {
    const startJourneyCb = jest.fn().mockResolvedValue({});
    const refreshAccessKey = jest.fn().mockResolvedValue({});
    const parseUrlAndPush = jest.fn().mockResolvedValue({});

    jest.mocked(useApiCallback).mockReturnValue({ execute: startJourneyCb } as any);
    jest.mocked(useCachedAccessKey).mockReturnValue({
      refresh: refreshAccessKey,
      data: {
        contentAccessKey: 'contentAccessKey',
      },
    } as any);
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush } as any);

    render(
      <CustomStartTransferApplicationButtonBlock
        parameters={[
          { key: 'success_next_page', value: 'page' },
          { key: 'current_page', value: 'page' },
        ]}
        buttons={[]}
      />,
    );

    act(() => {
      fireEvent.click(screen.getByTestId('start-ta-action-btn'));
    });

    await waitFor(() => {
      expect(startJourneyCb).toBeCalledTimes(1);
      expect(refreshAccessKey).toBeCalledTimes(1);
      expect(parseUrlAndPush).toBeCalledTimes(1);
    });
  });

  it('should not call start journey, refresh access key and parse url', async () => {
    const startJourneyCb = jest.fn();
    const refreshAccessKey = jest.fn();
    const parseUrlAndPush = jest.fn();

    jest.mocked(useApiCallback).mockReturnValue({ execute: startJourneyCb } as any);
    jest.mocked(useCachedAccessKey).mockReturnValue({
      refresh: refreshAccessKey,
      data: {
        contentAccessKey: 'contentAccessKey',
      },
    } as any);
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush } as any);

    render(<CustomStartTransferApplicationButtonBlock parameters={[]} buttons={[]} />);

    await screen.findByTestId('start-ta-action-btn');

    screen.getByTestId('start-ta-action-btn').click();

    expect(startJourneyCb).toBeCalledTimes(0);
    expect(refreshAccessKey).toBeCalledTimes(0);
    expect(parseUrlAndPush).toBeCalledTimes(0);
  });
});
