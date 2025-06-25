import { AddressBlock } from '../../../components/blocks/addressForm/AddressBlock';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
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
jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: () => ({ values: { name: '', dateOfBirth: new Date(), phone: '' }, save: jest.fn() }),
}));
jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: null }),
}));
jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({
    bereavement: { form: { editingStatus: null, saveForm: jest.fn(), endEdit: jest.fn() } },
  }),
}));
jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
  }),
}));
jest.mock('../../../core/router', () => ({ useRouter: jest.fn().mockReturnValue({ parseUrlAndPush: jest.fn() }) }));
jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({ useFormSubmissionBindingHooks: jest.fn() }));

describe('AddressForm', () => {
  const mockParameters = [
    { key: 'address_type', value: 'address' },
    { key: 'success_next_page', value: '/success' },
    { key: 'show_fields', value: '' },
  ];
  const mockJourneyType = 'bereavement';
  it('should render address form', () => {
    render(
      <AddressBlock
        isStandAlone={false}
        id="address_form"
        pageKey="page"
        journeyType={mockJourneyType}
        parameters={mockParameters}
      />,
    );
    expect(screen.getByTestId('address_form')).toBeTruthy();
  });
});
