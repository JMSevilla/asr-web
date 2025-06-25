import { ButtonClipBlock } from '../../../components/blocks/ButtonClipBlock';
import { GuaranteedTransferMessageBlock } from '../../../components/blocks/guaranteedTransfer/GuaranteedTransferMessageBlock';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { render, screen } from '../../common';

const BUTTON: React.ComponentProps<typeof ButtonClipBlock>['buttons'][number] = {
  key: 'string',
  linkKey: 'string',
  anchor: '',
  link: 'string',
  type: 'Primary',
  text: 'buttonText',
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

const DEFAULT_PROPS = {
  id: 'guaranteed-transfer',
  buttonKey: 'button',
  prefix: 'transfer_block',
  headerKey: 'header',
  hideTexts: false,
  buttons: [BUTTON, BUTTON, BUTTON],
};

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn(), parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ transfer: {} }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: {} }),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    retirementCalculation: undefined,
    retirementCalculationLoading: false,
    transferOptions: {
      totalGuaranteedTransferValue: 10,
      totalTransferValue: 15,
      totalNonGuaranteedTransferValue: 20,
    },
    transferOptionsLoading: false,
    quotesOptions: undefined,
    quotesOptionsError: undefined,
    quotesOptionsLoading: false,
    refreshQuotesOptions: jest.fn(),
  }),
}));

describe('GuaranteedTransferBlock', () => {
  it('render guaranteed transfer component', () => {
    render(<GuaranteedTransferMessageBlock {...DEFAULT_PROPS} />);

    expect(screen.queryByTestId('guaranteed-transfer')).toBeTruthy();
  });

  it('should render guaranteed transfer header', () => {
    render(<GuaranteedTransferMessageBlock {...DEFAULT_PROPS} headerKey="header_key" />);

    expect(screen.getByText('[[header_key]]')).toBeTruthy();
  });
  it('should render buttons', () => {
    render(<GuaranteedTransferMessageBlock {...DEFAULT_PROPS} />);

    expect(screen.getAllByTestId('content-button-block').length).toBe(3);
  });

  it('should render guaranteed transfer ', () => {
    jest.mocked(useContentDataContext).mockReturnValueOnce({ membership: { hasAdditionalContributions: true } } as any);
    render(<GuaranteedTransferMessageBlock {...DEFAULT_PROPS} />);

    expect(screen.queryByTestId('transfer-quote-total-value')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]10.00')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]15.00')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]20.00')).toBeTruthy();
  });
});
