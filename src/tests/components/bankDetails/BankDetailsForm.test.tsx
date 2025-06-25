import { BankDetailsForm } from '../../../components/blocks/bankDetailsForm/BankDetailsForm';
import { useApiCallback } from '../../../core/hooks/useApi';
import { act, render, screen, userEvent } from '../../common';

const DEFAULT_PROPS = {
  submitLoading: false,
  initialData: {
    bankCountryCode: 'DE',
    accountName: 'accountName',
    accountNumber: '',
    sortCode: '',
    iban: '123456',
    bic: 'BARCGB22',
    clearingCode: '12312312',
    accountCurrency: 'EUR',
  },
  currentData: {
    bankCountryCode: 'DE',
    accountName: 'accountName',
    accountNumber: '',
    sortCode: '',
    iban: '123456',
    bic: 'BARCGB22',
    clearingCode: '12312312',
    accountCurrency: 'EUR',
  },
  saveAndExitButtonKey: 'saveAndExitButtonKey',
  isValidating: false,
  pageKey: 'pageKey',
  isCloseButtonHidden: true,
  isLoading: false,
  onSubmit: jest.fn(),
};
const NONUK_NONIBAN_DEFAULT_PROPS = {
  ...DEFAULT_PROPS,
  initialData: {
    bankCountryCode: 'US',
    accountName: 'accountName',
    accountNumber: '12345678',
    sortCode: '123456',
    iban: '123456',
    bic: 'BARCGB22',
    clearingCode: '12312312',
    accountCurrency: 'USD',
  },
  currentData: {
    bankCountryCode: 'US',
    accountName: 'accountName',
    accountNumber: '12345678',
    sortCode: '123456',
    iban: '123456',
    bic: 'BARCGB22',
    clearingCode: '12312312',
    accountCurrency: 'USD',
  },
};
const UK_DEFAULT_PROPS = {
  ...DEFAULT_PROPS,
  initialData: {
    bankCountryCode: 'GB',
    accountName: 'accountName',
    accountNumber: '12345678',
    sortCode: '123456',
    iban: '',
    bic: '',
    clearingCode: '',
    accountCurrency: 'GBP',
  },
  currentData: {
    bankCountryCode: 'GB',
    accountName: 'accountName',
    accountNumber: '12345678',
    sortCode: '123456',
    iban: '',
    bic: '',
    clearingCode: '',
    accountCurrency: 'GBP',
  },
};
jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {}, expiration: {}, fastForward: {} } }),
}));

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
  useApiCallback: jest.fn(),
}));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: {},
  }),
}));

jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
  }),
}));

jest.mock('../../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue(jest.fn()),
}));

describe('BankDetailsForm', () => {
  afterAll(jest.resetAllMocks);

  it('should render bank details form by default', () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      data: null,
      error: undefined,
    } as any);

    render(<BankDetailsForm id="bank-details-form" {...DEFAULT_PROPS} />);
    const bankForm = screen.queryByTestId('bank_form');
    expect(bankForm).toBeTruthy();
  });
  it('should render save and exit button', () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      data: null,
      error: undefined,
    } as any);

    render(<BankDetailsForm id="bank-details-form" {...DEFAULT_PROPS} />);
    const saveAndExitButton = screen.queryByText('[[saveAndExitButtonKey]]');
    expect(saveAndExitButton).toBeInTheDocument();
  });
  it('should render bank_clearing_code and bank_bic field for non GB non iban country', () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      data: null,
      error: undefined,
    } as any);

    render(<BankDetailsForm id="bank-details-form" {...NONUK_NONIBAN_DEFAULT_PROPS} />);
    expect(screen.queryByText('[[bank_clearing_code]]')).toBeInTheDocument();
    expect(screen.queryByText('[[bank_bic]]')).toBeInTheDocument();
  });
  it('should render iban and bank_bic field for non GB iban country', () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      data: null,
      error: undefined,
    } as any);

    render(<BankDetailsForm id="bank-details-form" {...DEFAULT_PROPS} />);
    expect(screen.queryByText('[[bank_iban]]')).toBeInTheDocument();
    expect(screen.queryByText('[[bank_bic]]')).toBeInTheDocument();
  });
  it('should enable continue button for non GB country', async () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      data: null,
      error: undefined,
    } as any);
    const submit = jest.fn();
    render(<BankDetailsForm id="bank-details-form" {...DEFAULT_PROPS} onSubmit={submit} />);
    const submitButton = screen.queryByTestId('continue');

    await act(async () => {
      submitButton && (await userEvent.click(submitButton));
    });
    expect(screen.getByTestId('continue')).not.toBeDisabled();
  });
  it('should render message for non GB country', () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      data: null,
      error: undefined,
    } as any);

    render(<BankDetailsForm id="bank-details-form" {...DEFAULT_PROPS} />);
    expect(screen.queryByText('[[bank_details_form_note_sterling]]')).toBeInTheDocument();
  });
  it('should render accountNumber field and sortCode for GB country', () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      data: null,
      error: undefined,
    } as any);

    render(<BankDetailsForm id="bank-details-form" {...UK_DEFAULT_PROPS} />);

    expect(screen.queryByText('[[bank_account_number]]')).toBeInTheDocument();
    expect(screen.queryByText('[[bank_sort_code]]')).toBeInTheDocument();
  });
  it('should enable submit button for GB country', async () => {
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      data: null,
      error: undefined,
    } as any);
    const submit = jest.fn();
    render(<BankDetailsForm id="bank-details-form" {...UK_DEFAULT_PROPS} onSubmit={submit} />);
    screen.debug();
    const submitButton = screen.queryByTestId('continue');

    await act(async () => {
      submitButton && (await userEvent.click(submitButton));
    });
    expect(screen.getByTestId('continue')).not.toBeDisabled();
  });
});
