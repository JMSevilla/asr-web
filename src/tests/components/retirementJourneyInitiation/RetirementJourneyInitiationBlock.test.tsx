import { ComponentProps } from 'react';
import { act } from 'react-dom/test-utils';
import { RetirementJourneyInitiationBlock } from '../../../components';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { render, screen, waitFor } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof RetirementJourneyInitiationBlock> = {
  id: 'id',
  tenant: null,
  parameters: [],
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
    parsedQuery: { type: 'quote' },
    parseUrlAndPush: jest.fn(),
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: null, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({
    result: null,
    loading: false,
    execute: () => Promise.resolve({ result: { data: null } }),
  }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ clearCmsTokens: jest.fn() }),
}));

jest.mock('../../../core/contexts/NotificationsContext', () => ({
  useNotificationsContext: jest.fn().mockReturnValue({ showNotifications: jest.fn(), hideNotifications: jest.fn() }),
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null, refresh: jest.fn() }),
}));

describe('RetirementJourneyInitiationBlock', () => {
  it('should display list', () => {
    render(<RetirementJourneyInitiationBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('retirement_start_button')).toBeTruthy();
  });

  it('should add loading class to start button when loading', () => {
    jest.mocked(useApi).mockReturnValueOnce({ loading: true } as any);
    render(<RetirementJourneyInitiationBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('retirement_start_button')).toHaveClass('loading');
  });

  it('should not start journey if selected quote name is not present', () => {
    const apiCbFn = jest.fn();
    jest.mocked(useApiCallback).mockReturnValueOnce({ execute: apiCbFn } as any);
    render(<RetirementJourneyInitiationBlock {...DEFAULT_PROPS} />);
    act(() => screen.queryByTestId('retirement_start_button')?.click());
    expect(apiCbFn).not.toHaveBeenCalled();
  });

  it('should start journey if selected quote name is present', () => {
    const apiCbFn = jest.fn();
    jest.mocked(useApiCallback).mockReturnValueOnce({ execute: apiCbFn } as any);
    jest.mocked(useApi).mockReturnValue({ result: { data: { selectedQuoteName: 'test' } } } as any);
    render(<RetirementJourneyInitiationBlock {...DEFAULT_PROPS} />);
    act(() => screen.queryByTestId('retirement_start_button')?.click());
    waitFor(() => expect(apiCbFn).toHaveBeenCalledTimes(1));
  });

  it('should refresh tokens if selected quote name is present', () => {
    const refreshFn = jest.fn();
    jest.mocked(useCachedAccessKey).mockReturnValue({ refresh: refreshFn } as any);
    jest.mocked(useApi).mockReturnValue({ result: { data: { selectedQuoteName: 'test' } } } as any);
    render(<RetirementJourneyInitiationBlock {...DEFAULT_PROPS} />);
    act(() => screen.queryByTestId('retirement_start_button')?.click());
    waitFor(() => expect(refreshFn).toHaveBeenCalledTimes(1));
  });

  it('should redirect only if url is present', () => {
    const navigateFn = jest.fn();
    jest.mocked(useRouter).mockReturnValueOnce({ parseUrlAndPush: navigateFn } as any);
    render(<RetirementJourneyInitiationBlock {...DEFAULT_PROPS} />);
    act(() => screen.queryByTestId('retirement_start_button')?.click());
    waitFor(() => expect(navigateFn).not.toHaveBeenCalled());
    jest.mocked(useApi).mockReturnValue({ result: { data: { url: 'test' } } } as any);
    act(() => screen.queryByTestId('retirement_start_button')?.click());
    waitFor(() => expect(navigateFn).toHaveBeenCalledTimes(1));
  });

  it('should show notification if start journey endpoint returns errror', () => {
    const showNotificationsFn = jest.fn();
    jest.mocked(useApiCallback).mockReturnValueOnce({ error: ['error'] } as any);
    jest
      .mocked(useNotificationsContext)
      .mockReturnValue({ showNotifications: showNotificationsFn, hideNotifications: jest.fn() });
    render(<RetirementJourneyInitiationBlock {...DEFAULT_PROPS} />);
    waitFor(() => expect(showNotificationsFn).toHaveBeenCalledTimes(1));
  });
});
