import { CmsPage } from '../../api/content/types/page';
import { TopAlertMessages } from '../../components';
import { useDataReplacerApi } from '../../core/hooks/useDataReplacerApi';
import { render, screen } from '../common';
import { PAGE } from '../mock';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
    parsedQuery: {},
  }),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: {},
    error: undefined,
    status: 'success',
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {} } }),
}));

jest.mock('../../core/hooks/useDataReplacerApi', () => ({
  useDataReplacerApi: jest.fn().mockReturnValue({
    error: undefined,
    loading: false,
    replaceDataInText: jest.fn(),
    elementProps: jest.fn(),
  }),
}));

describe('TopAlertMessages', () => {
  it('should not render message if no message type in content', () => {
    const page: CmsPage = {
      ...PAGE,
      content: {
        values: [],
      },
    };
    render(<TopAlertMessages page={page} />);
    const message = screen.queryByTestId('message-component');

    expect(message).toBeFalsy();
  });

  it('should not render message if message property `showAlwaysOnTop` is falsy', () => {
    const page: CmsPage = {
      ...PAGE,
      content: {
        values: [
          {
            name: '',
            type: 'message',
            elements: {
              text: { value: 'text' },
            },
          },
        ],
      },
    };
    render(<TopAlertMessages page={page} />);
    const message = screen.queryByTestId('message-component');

    expect(message).toBeFalsy();
  });

  it('should render message if message property `showAlwaysOnTop` is true', () => {
    const page: CmsPage = {
      ...PAGE,
      content: {
        values: [
          {
            name: '',
            type: 'Message',
            elements: {
              text: { value: 'text' },
              showAlwaysOnTop: { value: true },
              type: { value: { label: 'Warning', selection: 'Warning' } },
            },
          },
        ],
      },
    };
    render(<TopAlertMessages page={page} />);
    const message = screen.queryByTestId('alert-message-component');

    expect(message).toBeTruthy();
  });

  it('should not render messages when data replacer api returns error', () => {
    jest.mocked(useDataReplacerApi).mockReturnValue({
      data: null,
      loading: false,
      error: Error('error'),
      getRawValue: jest.fn(),
      replaceDataInText: jest.fn(),
      elementProps: jest.fn(),
    });

    const page: CmsPage = {
      ...PAGE,
      content: {
        values: [
          {
            name: '',
            type: 'Message',
            elements: {
              text: { value: 'text' },
              showAlwaysOnTop: { value: true },
              type: { value: { label: 'Warning', selection: 'Warning' } },
            },
          },
        ],
      },
    };

    render(<TopAlertMessages page={page} />);
    expect(screen.queryByTestId('message-component')).not.toBeInTheDocument();
  });
});
