import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { CmsPage } from '../../api/content/types/page';
import { PageContent } from '../../components';
import { render, screen } from '../common';
import { PAGE } from '../mock';

const elements = {
  accessGroups: {},
  header: { value: 'test header' },
  parameters: {
    values: [],
  },
};

const contentEntity = {
  name: 'name',
  elements,
};

const contentHTMLBlock = { ...contentEntity, type: 'Content HTML block' };
const authBlock = { ...contentEntity, type: 'authentication_form' };
const pensionProjectionBlock = { ...contentEntity, type: 'pension_projections' };
const linkPanelBlock = { ...contentEntity, type: 'Link Panel' };
const Message = { ...contentEntity, type: 'Message' };
const InformationMessage = {
  ...{ ...contentEntity, elements: { ...elements, type: { value: { selection: 'Info block' } } } },
  type: 'Message',
};
const informationComponentBlock = { ...contentEntity, type: 'retirement_application_acknowledgements' };
const headerBlock = { ...contentEntity, type: 'header' };
const retirementAppFileDownloadBlock = { ...contentEntity, type: 'retirement_app_file_download' };
const retirementEndBlock = { ...contentEntity, type: 'retirement_end' };
const retirementSubmitBlock = { ...contentEntity, type: 'retirement_app_submission' };
const defaultBlock = { ...contentEntity, type: 'default' };
const journeyStageIndicatorBlock = {
  ...{ ...contentEntity, elements: { ...elements, stage: { values: [] }, maxNumberOfJourneySteps: { value: 1 } } },
  type: 'Journey stage indicator',
};
const bankDetailsBlock = { ...contentEntity, type: 'bank_details_form' };
const addressFormBlock = { ...contentEntity, type: 'address_form' };
const emailFormBlock = { ...contentEntity, type: 'email_confirmation_form' };
const phoneFormBlock = { ...contentEntity, type: 'phone_confirmation_form' };
const personalDetailsBlock = { ...contentEntity, type: 'personal_details_retirement' };
const ltaUsedAnswersBlock = { ...contentEntity, type: 'lta_used_answers' };
const ltaPercentageFormBlock = { ...contentEntity, type: 'lta_entering_of_percentage' };
const ltaUsedPercentageBlock = { ...contentEntity, type: 'lta_used_percentage' };
const contentButtonBlock = { ...contentEntity, type: 'Button' };
const journeyContinueControlBlock = { ...contentEntity, type: 'journey_continue_control' };
const gbgUserIdentificationFormBlock = { ...contentEntity, type: 'gbg_user_identification_form' };
const retirementApplicationDeleteBlock = { ...contentEntity, type: 'delete_retirement_app' };
const documentsListBlock = { ...contentEntity, type: 'document_list' };
const backButtonBlock = { ...contentEntity, type: 'back_button' };
const backButtonByKeyBlock = { ...contentEntity, type: 'back_button_by_page_key' };

global.BroadcastChannel = class {
  onmessage: ((event: MessageEvent) => void) | null = null;
  constructor(_name: string) {}
  postMessage(_data: any): void {}
  addEventListener(_type: string, _listener: (event: MessageEvent) => void): void {}
  close(): void {}
} as any;

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
    parsedQuery: { type: 'quote' },
  }),
}));

jest.mock('../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: jest.fn().mockReturnValue({ login: jest.fn() }),
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {}, expiration: {} } }),
}));

jest.mock('../../core/contexts/bereavement/BereavementSessionContext', () => ({
  useBereavementSession: jest.fn().mockReturnValue({ resetBereavementSession: jest.fn() }),
}));

jest.mock('../../core/contexts/PageLoaderContext', () => ({
  usePageLoaderContext: jest.fn().mockReturnValue({ setIsLoading: () => {} }),
}));

jest.mock('../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({
    page: null,
    globals: null,
    loading: false,
    cmsTokens: {},
    clearCmsTokens: () => {},
    updateCmsToken: (_: string, __: unknown) => {},
  }),
}));

jest.mock('../../core/contexts/AcknowledgementsContext', () => ({
  useAcknowledgementsContext: jest.fn().mockReturnValue({
    acknowledgements: undefined,
    onAcknowledgementsChanged: () => {},
  }),
}));

jest.mock('../../core/contexts/dialog/DialogContext', () => ({
  useDialogContext: jest.fn().mockReturnValue({ isDialogOpen: false, openDialog: jest.fn(), closeDialog: jest.fn() }),
}));

jest.mock('../../core/hooks/useFormSubmissionBindingHooks', () => ({ useFormSubmissionBindingHooks: jest.fn() }));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    error: undefined,
    result: {
      answers: [],
      availableRetirementDateRange: { from: '', to: '' },
      data: { retirementDate: '2030-02-02', filter: () => [] },
    },
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    error: undefined,
    result: { data: {} },
    execute: () => ({ data: { url: 'url' } }),
  }),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: {
      answers: [],
      availableRetirementDateRange: { from: '', to: '' },
      data: [],
    },
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    error: undefined,
    result: { data: {} },
    execute: () => ({ data: { url: 'url' } }),
  }),
}));

jest.mock('../../core/hooks/useScroll', () => ({
  useScroll: jest.fn().mockReturnValue({ scrollTop: jest.fn() }),
}));

jest.mock('../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    retirementCalculation: {
      isCalculationSuccessful: true,
      totalPension: 0,
      totalAVCFund: null,
    },
    quotesOptions: {
      quotes: [
        {
          label: 'quote',
          totalPension: 100,
          totalLumpSum: 100,
          lumpSumFromDb: 100,
          lumpSumFromDc: 100,
          pensionTranches: [],
        },
      ],
    },
  }),
}));

describe('PageContent', () => {
  it('should render Page content component', () => {
    render(<PageContent page={PAGE} tenant={null} />);
    const content = screen.getByTestId('page-content');

    expect(content).toBeInTheDocument();
  });

  it('should not render', () => {
    render(<PageContent page={null} tenant={null} />);
    const content = screen.queryByTestId('page-content');

    expect(content).toBe(null);
  });

  it('should render correct components according types', () => {
    const page: CmsPage = {
      ...PAGE,
      content: {
        values: [
          contentHTMLBlock,
          authBlock,
          linkPanelBlock,
          Message,
          pensionProjectionBlock,
          InformationMessage,
          informationComponentBlock,
          headerBlock,
          retirementAppFileDownloadBlock,
          retirementEndBlock,
          retirementSubmitBlock,
          defaultBlock,
          journeyStageIndicatorBlock,
          bankDetailsBlock,
          addressFormBlock,
          emailFormBlock,
          phoneFormBlock,
          personalDetailsBlock,
          ltaUsedAnswersBlock,
          ltaPercentageFormBlock,
          ltaUsedPercentageBlock,
          contentButtonBlock,
          journeyContinueControlBlock,
          gbgUserIdentificationFormBlock,
          retirementApplicationDeleteBlock,
          documentsListBlock,
          backButtonBlock,
          backButtonByKeyBlock,
        ],
      },
    };

    render(
      <LocalizationProvider dateAdapter={DateAdapter}>
        <PageContent page={page} tenant={null} />
      </LocalizationProvider>,
    );
    const pensionProjections = screen.getByTestId('pension_projections');
    const htmlElement = screen.getByTestId('content-html-block');
    const loginForm = screen.getByTestId('authentication_form');
    const lnkPanel = screen.getByTestId('link-panel');
    const messages = screen.getByTestId('message-component');
    const informationMessage = screen.getByTestId('information-message-component');
    const informationComponent = screen.getByTestId('information-component');
    const acknowledgementsForm = screen.getByTestId('acknowledgements-form');
    const headerTitle = screen.getAllByTestId('header-title');
    const retirementEndButton = screen.getByTestId('retirement_end_button');
    const retirementSubmitButton = screen.getByTestId('retirement_app_submit');
    const defaultElement = screen.getByTestId('default-component');
    const stageIndicator = screen.getByTestId('stage-indicator-block');
    const bankForm = screen.getByTestId('bank_form');
    const addressForm = screen.getByTestId('address_form');
    const emailForm = screen.getByTestId('email_form');
    const phoneForm = screen.getByTestId('phone_form');
    const personalDetailsList = screen.getByTestId('personal-details-list');
    const ltaPercentageForm = screen.getByTestId('lta-percentage-form');
    const ltaUsedPercentage = screen.getByTestId('lta-used-percentage-block');
    const contentButton = screen.getByTestId('content-button-block');
    const journeyContinueControl = screen.getByTestId('journey-continue-control-block');
    const gbgUserIdentificationForm = screen.getByTestId('gbg-scan-form-block');
    const retirementApplicationDelete = screen.getByTestId('retirement-info-panel-delete');
    const documentsList = screen.getByTestId('documents-list');
    const backButton = screen.getAllByTestId('back-button');

    expect(htmlElement).toBeInTheDocument();
    expect(loginForm).toBeInTheDocument();
    expect(pensionProjections).toBeInTheDocument();
    expect(lnkPanel).toBeInTheDocument();
    expect(messages).toBeInTheDocument();
    expect(informationMessage).toBeInTheDocument();
    expect(informationComponent).toBeInTheDocument();
    expect(acknowledgementsForm).toBeInTheDocument();
    expect(headerTitle[1]).toBeInTheDocument();
    expect(retirementEndButton).toBeInTheDocument();
    expect(retirementSubmitButton).toBeInTheDocument();
    expect(defaultElement).toBeInTheDocument();
    expect(stageIndicator).toBeInTheDocument();
    expect(bankForm).toBeInTheDocument();
    expect(addressForm).toBeInTheDocument();
    expect(emailForm).toBeInTheDocument();
    expect(phoneForm).toBeInTheDocument();
    expect(personalDetailsList).toBeInTheDocument();
    expect(ltaPercentageForm).toBeInTheDocument();
    expect(ltaUsedPercentage).toBeInTheDocument();
    expect(contentButton).toBeInTheDocument();
    expect(journeyContinueControl).toBeInTheDocument();
    expect(gbgUserIdentificationForm).toBeInTheDocument();
    expect(retirementApplicationDelete).toBeInTheDocument();
    expect(documentsList).toBeInTheDocument();
    expect(backButton[0]).toBeInTheDocument();
    expect(backButton[1]).toBeInTheDocument();
  });

  it('should render journey indicator and back button first in journey page', () => {
    const page: CmsPage = {
      ...PAGE,
      journeyType: { value: { selection: 'retirement', label: 'retirement' } },
      content: { values: [contentHTMLBlock, journeyStageIndicatorBlock] },
    };

    const { getByTestId, container } = render(<PageContent page={page} tenant={null} />);

    const backButton = getByTestId('back-button');
    const stageIndicator = getByTestId('stage-indicator-block');
    const content = getByTestId('content-html-block');
    const headerTitle = getByTestId('header-title');

    expect(container.firstChild?.childNodes[0].firstChild).toBe(stageIndicator);
    expect(container.firstChild?.childNodes[1].firstChild).toBe(backButton);
    expect(container.firstChild?.childNodes[2].firstChild).toBe(headerTitle);
    expect(container.firstChild?.childNodes[3].firstChild).toBe(content);
  });

  it('should render  journey indicator and back button first in not journey page with backPageKey and indicator', () => {
    const page: CmsPage = {
      ...PAGE,
      backPageKey: { value: 'url' },
      content: { values: [contentHTMLBlock, journeyStageIndicatorBlock] },
    };

    const { getByTestId, container } = render(<PageContent page={page} tenant={null} />);

    const backButton = getByTestId('back-button');
    const stageIndicator = getByTestId('stage-indicator-block');
    const content = getByTestId('content-html-block');
    const headerTitle = getByTestId('header-title');

    expect(container.firstChild?.childNodes[0].firstChild).toBe(stageIndicator);
    expect(container.firstChild?.childNodes[1].firstChild).toBe(backButton);
    expect(container.firstChild?.childNodes[2].firstChild).toBe(headerTitle);
    expect(container.firstChild?.childNodes[3].firstChild).toBe(content);
  });
});
