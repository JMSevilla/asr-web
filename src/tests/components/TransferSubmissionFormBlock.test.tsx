import { TransferSubmissionFormBlock } from '../../components';
import { useContentDataContext } from '../../core/contexts/contentData/ContentDataContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { FormSubmissionParams, useFormSubmissionBindingHooks } from '../../core/hooks/useFormSubmissionBindingHooks';
import { useRouter } from '../../core/router';
import { act, render } from '../common';

const DEFAULT_PROPS = {
  id: 'transfer-submission-block',
  parameters: [
    { key: 'success_next_page', value: 'success' },
    { key: 'error_next_page', value: 'error' },
  ],
  tenant: null,
};

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: null }),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../core/contexts/NotificationsContext', () => ({
  useNotificationsContext: jest.fn().mockReturnValue({ showNotifications: jest.fn(), hideNotifications: jest.fn() }),
}));

jest.mock('../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: { contentAccessKey: 'contentAccessKey' }, loading: false }),
}));

jest.mock('../../core/hooks/useFormSubmissionBindingHooks', () => ({ useFormSubmissionBindingHooks: jest.fn() }));

describe('TransferSubmissionFormBlock', () => {
  it('should enable bound submit button', () => {
    const formSubmissionBind = jest.fn();
    jest.mocked(useFormSubmissionBindingHooks).mockImplementation(formSubmissionBind);
    jest.mocked(useContentDataContext).mockReturnValueOnce({
      loading: false,
      membership: null,
      clearCmsTokens: jest.fn(),
    } as any);

    render(<TransferSubmissionFormBlock {...DEFAULT_PROPS} />);

    expect(formSubmissionBind).toBeCalledWith({
      key: 'transfer-submission-block',
      isValid: true,
      cb: expect.any(Function),
    });
  });

  it('should disable bound submit button', () => {
    const formSubmissionBind = jest.fn();
    jest.mocked(useFormSubmissionBindingHooks).mockImplementation(formSubmissionBind);
    jest
      .mocked(useContentDataContext)
      .mockReturnValueOnce({ membership: { hasAdditionalContributions: true }, clearCmsTokens: jest.fn() } as any);

    render(<TransferSubmissionFormBlock {...DEFAULT_PROPS} />);

    expect(formSubmissionBind).toBeCalledWith({
      key: 'transfer-submission-block',
      isValid: true,
      cb: expect.any(Function),
    });
  });

  it('should call submit logic correctly', async () => {
    let submitFn: Function | null = null;
    const formSubmissionBind = (args: FormSubmissionParams) => (submitFn = args.cb);
    jest.mocked(useFormSubmissionBindingHooks).mockImplementation(formSubmissionBind);
    jest.mocked(useContentDataContext).mockReturnValueOnce({ membership: null, clearCmsTokens: jest.fn() } as any);

    const navigateFn = jest.fn();
    const executeFn = jest.fn();
    const refreshKeyFn = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush: navigateFn } as any);
    jest.mocked(useApiCallback).mockReturnValue({ loading: false, execute: executeFn } as any);
    jest
      .mocked(useCachedAccessKey)
      .mockReturnValue({ data: { contentAccessKey: 'contentAccessKey' }, refresh: refreshKeyFn } as any);

    render(<TransferSubmissionFormBlock {...DEFAULT_PROPS} />);
    await act(() => submitFn!());

    expect(executeFn).toBeCalledTimes(2);
    expect(refreshKeyFn).toBeCalledTimes(1);
    expect(navigateFn).toBeCalledTimes(1);
  });
});
