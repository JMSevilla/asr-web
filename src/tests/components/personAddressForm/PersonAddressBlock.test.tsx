import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { PersonAddressBlock } from '../../../components/blocks/personAddressForm/PersonAddressBlock';
import { BereavementFormStatus } from '../../../core/contexts/persistentAppState/hooks/bereavement/form';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../components/blocks/personAddressForm/hooks', () => ({
  usePersonAddressLookup: () => ({ loadDetails: jest.fn(), loadSummary: jest.fn() }),
}));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: () => ({ values: { address: { countryCode: 'GB' } }, save: jest.fn() }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn().mockReturnValue({ cb: jest.fn(), key: 'key' }),
}));

jest.mock('../../../core/hooks/useFormFocusOnError', () => ({
  useFormFocusOnError: jest.fn().mockReturnValue({ enabled: false, cb: jest.fn() }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
  }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: { values: {} } }, transfer: {} }),
}));

jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
  }),
}));

jest.mock('../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: null }, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({
    result: { data: { quotes: null } },
    loading: false,
    execute: () => Promise.resolve({ result: { data: null } }),
  }),
}));

const DEFAULT_DATA = {
  id: 'address-block',
  pageKey: 'pageKey',
  parameters: [],
  isStandAlone: false,
  journeyType: 'bereavement' as JourneyTypeSelection,
  panelList: [] as PanelListItem[],
};

describe('PersonAddressBlock', () => {
  it('should render person address form', () => {
    const executeCb = jest.fn();
    jest.mocked(useApiCallback).mockReturnValueOnce({ execute: executeCb, loading: false } as any);
    jest.mocked(useApi).mockReturnValue({
      result: {
        data: [],
      },
    } as any);
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

    render(<PersonAddressBlock {...DEFAULT_DATA} />);

    expect(screen.getByTestId('person-address-form-block')).toBeTruthy();
    expect(screen.getByTestId('address-search')).toBeTruthy();
  });
});
