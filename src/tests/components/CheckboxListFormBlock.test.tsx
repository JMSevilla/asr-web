import { CheckboxListFormBlock } from '../../components/blocks/checkboxList/CheckboxListFormBlock';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { useFormSubmissionBindingHooks } from '../../core/hooks/useFormSubmissionBindingHooks';
import { render, screen } from '../common';

const CHECKBOXES = [
  {
    checkboxKey: { value: 'key_1' },
    checkboxText: { value: 'key_1' },
    isMandatory: { value: false },
    defaultState: { value: false },
  },
  {
    checkboxKey: { value: 'key_2' },
    checkboxText: { value: 'key_2' },
    isMandatory: { value: false },
    defaultState: { value: false },
  },
  {
    checkboxKey: { value: 'key_3' },
    checkboxText: { value: 'key_3' },
    isMandatory: { value: false },
    defaultState: { value: false },
  },
];

const DEFAULT_PROPS: React.ComponentProps<typeof CheckboxListFormBlock> = {
  checkboxes: CHECKBOXES,
  checkboxesListKey: 'string',
  description: 'string',
  journeyType: 'transfer2',
  pageKey: 'pageKey',
};

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ checkbox: { state: {}, saveForm: jest.fn() } }),
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

jest.mock('../../core/contexts/auth/AuthContext', () => ({ useAuthContext: jest.fn() }));

jest.mock('../../core/hooks/useFormSubmissionBindingHooks', () => ({ useFormSubmissionBindingHooks: jest.fn() }));

describe('CheckboxListFormBlock', () => {
  it('renders checkboxes', () => {
    const formSubmissionBind = jest.fn();
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);
    jest.mocked(useFormSubmissionBindingHooks).mockImplementation(formSubmissionBind);
    render(<CheckboxListFormBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByText('key_1')).toBeTruthy();
    expect(screen.queryByText('key_2')).toBeTruthy();
    expect(screen.queryByText('key_3')).toBeTruthy();

    expect(formSubmissionBind).toBeCalledTimes(1);
  });
});
