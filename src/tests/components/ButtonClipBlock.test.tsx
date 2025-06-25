import { ButtonClipBlock } from '../../components/blocks/ButtonClipBlock';
import { render, screen } from '../common';

const BUTTON: React.ComponentProps<typeof ButtonClipBlock>['buttons'][number] = {
  key: 'string',
  linkKey: 'string',
  link: 'string',
  anchor: '',
  type: 'Primary',
  text: 'string',
  icon: undefined,
  iconName: undefined,
  rightSideIcon: undefined,
  reuseUrlParameters: undefined,
  openInTheNewTab: undefined,
  widthPercentage: undefined,
  customActionKey: undefined,
  notification: undefined,
  disabledReason: undefined,
  fileUrl: '',
  dialogElement: undefined,
  analyticsKey: undefined,
  journeyType: undefined,
  fastForwardComparisonPageKey: undefined,
  fastForwardRedirectPageKey: undefined,
  postRequestUrl: undefined,
  largeIcon: undefined,
  disabled: undefined,
};

const DEFAULT_PROPS: React.ComponentProps<typeof ButtonClipBlock> = {
  id: 'button-clip',
  buttons: [BUTTON, BUTTON, BUTTON],
};

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ transfer: {} }),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

describe('ButtonClipBlock', () => {
  it('renders correct number of buttons', () => {
    render(<ButtonClipBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('button-clip')).toBeTruthy();
    expect(screen.getAllByTestId('content-button-block').length).toBe(DEFAULT_PROPS.buttons.length);
  });
});
