import { RetirementApplicationInformationPanelBlock } from '../../components';
import { useApi } from '../../core/hooks/useApi';
import { render, screen } from '../common';
import { MEMBER_QUOTES, TENANT } from '../mock';

const PARAMETERS = [{ key: 'success_next_page', value: 'submit_retirement_app' }];

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
    push: jest.fn(),
    parseUrlAndPush: jest.fn(),
  }),
}));

jest.mock('../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({
    page: null,
    globals: null,
    loading: false,
    cmsTokens: null,
    clearCmsTokens: () => {},
    updateCmsToken: (_: string, __: unknown) => {},
  }),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: {
      retirementApplication: {
        label: 'ReducedPensionDCAsLumpSum',
        totalPension: 100,
        totalSpousePension: 100,
        lastSearchedRetirementDate: '2022-08-24T00:00:00+00:00',
        expirationDate: '2022-04-04T10:24:48.171791+00:00',
        selectedRetirementDate: '2022-08-24T00:00:00+00:00',
        retirementApplicationStatus: 'StartedRA',
        submissionDate: null,
        pensionTranches: [],
        annuityPurchaseAmount: null,
      },
      retirementDate: {},
      nextPageUrl: { url: 'url' },
    },
    error: undefined,
    status: 'success',
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
}));

jest.mock('../../core/contexts/PageLoaderContext', () => ({
  usePageLoaderContext: jest.fn().mockReturnValue({
    setIsLoading: () => {},
  }),
}));

jest.mock('../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: jest.fn().mockReturnValue({ isAuthenticated: true }),
}));

describe('RetirementApplicationInformationPanelBlock', () => {
  it('Should not render component if api data is loading', () => {
    jest.mocked(useApi).mockReturnValue({ loading: true, error: undefined } as any);
    render(<RetirementApplicationInformationPanelBlock parameters={PARAMETERS} tenant={TENANT} />);
    const panel = screen.queryByTestId('retirement-application-information-panel');

    expect(panel).toBe(null);
  });

  it('Should not render component if api returns error', () => {
    jest.mocked(useApi).mockReturnValue({ error: 'error' } as any);
    render(<RetirementApplicationInformationPanelBlock parameters={PARAMETERS} tenant={TENANT} />);
    const panel = screen.queryByTestId('retirement-application-information-panel');

    expect(panel).toBe(null);
  });

  it('Should render retirement application information panel component', () => {
    jest.mocked(useApi).mockReturnValue({
      result: { retirementApplication: MEMBER_QUOTES, retirementDate: {}, nextPageUrl: { url: 'url' } },
      loading: false,
      error: undefined,
    } as any);
    render(<RetirementApplicationInformationPanelBlock parameters={PARAMETERS} tenant={TENANT} />);
    const panel = screen.queryByTestId('retirement-application-information-panel');

    expect(panel).toBeTruthy();
  });
});
