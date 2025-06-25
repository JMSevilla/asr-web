import { PersonContactsSelectionBlock } from '../../../components/blocks/personContactsSelection';
import { BereavementFormStatus } from '../../../core/contexts/persistentAppState/hooks/bereavement/form';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { render, screen } from '../../common';

const DEFAULT_PROPS = {
  id: 'PersonContactsSelectionBlock',
  pageKey: 'page_key',
  parameters: [
    { key: 'success_next_page', value: 'success_next_page' },
    { key: 'contact_page', value: 'contact_page' },
  ],
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useApi', () => ({
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

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
  }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({
    bereavement: {
      form: {
        values: {
          reporter: {},
          nextOfKin: {},
          executor: {},
        },
      },
    },
  }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: {} }),
}));
jest.mock('../../../components/blocks/personContactsSelection/hooks', () => ({
  useBereavementContactInitialData: jest.fn().mockReturnValue({ loading: false, isNextOfKin: true, isExecutor: true }),
}));

describe('PersonContactsSelectionBlock', () => {
  it('render person contacts selection block component', () => {
    render(<PersonContactsSelectionBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('PersonContactsSelectionBlock')).toBeTruthy();
  });

  it('should render person contacts selection options component', () => {
    jest.mocked(usePersistentAppState).mockReturnValue({
      bereavement: {
        expiration: { date: null, aboutToExpire: false, update: jest.fn(), notify: jest.fn(), reset: jest.fn() },
        form: {
          status: BereavementFormStatus.NotStarted,
          start: jest.fn(),
          reset: jest.fn(),
          saveForm: jest.fn(),
          resetPersonType: jest.fn(),
          saveContactSelection: jest.fn(),
          values: {
            reporter: { name: 'reporter', surname: 'reporter_surname' },
            nextOfKin: { name: 'nextOfKin', surname: 'nextOfKin_surname' },
            executor: { name: 'executor', surname: 'executor_surname' },
          },
        },
      },
      transfer: {
        loader: {
          init: jest.fn(),
          reset: jest.fn(),
          initialized: false,
        },
      },
      checkbox: {
        saveForm: jest.fn(),
        state: {},
      },
      fastForward: {
        state: {},
        shouldGoToSummary: jest.fn().mockReturnValue(false),
        shouldGoToContact: jest.fn().mockReturnValue(true),
        init: jest.fn(),
        resetAll: jest.fn(),
        reset: jest.fn(),
      },
    });
    render(<PersonContactsSelectionBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('YOU-option')).toBeTruthy();
    expect(screen.getByTestId('NEXT_OF_KIN-option')).toBeTruthy();
    expect(screen.getByTestId('EXECUTOR-option')).toBeTruthy();
    expect(screen.getByTestId('OTHER-option')).toBeTruthy();
  });

  it('should render person contacts selection options correctly component', () => {
    jest.mocked(usePersistentAppState).mockReturnValue({
      bereavement: {
        expiration: { date: null, aboutToExpire: false, update: jest.fn(), notify: jest.fn(), reset: jest.fn() },
        form: {
          status: BereavementFormStatus.NotStarted,
          start: jest.fn(),
          reset: jest.fn(),
          saveForm: jest.fn(),
          resetPersonType: jest.fn(),
          saveContactSelection: jest.fn(),
          values: {
            reporter: { name: 'reporter', surname: 'reporter_surname' },
            nextOfKin: {},
            executor: {},
          },
        },
      },
      transfer: {
        loader: {
          init: jest.fn(),
          reset: jest.fn(),
          initialized: false,
        },
      },
      checkbox: {
        saveForm: jest.fn(),
        state: {},
      },
      fastForward: {
        state: {},
        shouldGoToSummary: jest.fn().mockReturnValue(false),
        shouldGoToContact: jest.fn().mockReturnValue(true),
        init: jest.fn(),
        resetAll: jest.fn(),
        reset: jest.fn(),
      },
    });
    render(<PersonContactsSelectionBlock {...DEFAULT_PROPS} />);

    expect(screen.getByTestId('YOU-option')).toBeTruthy();
    expect(screen.getByTestId('OTHER-option')).toBeTruthy();
  });
});
