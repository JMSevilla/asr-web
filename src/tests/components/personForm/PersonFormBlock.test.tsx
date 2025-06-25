import { PersonFormBlock } from '../../../components';
import { useApi } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: {
      data: [],
    },
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn() }),
}));
jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: () => ({ values: { name: '', dateOfBirth: new Date(), phone: '' }, save: jest.fn() }),
}));
jest.mock('../../../core/hooks/usePanelBlock', () => ({ usePanelBlock: () => ({ panelByKey: () => null }) }));
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

describe('PersonFormBlock', () => {
  const mockParameters = [
    { key: 'person_type', value: 'person' },
    { key: 'success_next_page', value: '/success' },
    { key: 'show_fields', value: 'name;date_of_birth;phone;mandatory_comment' },
  ];
  const mockJourneyType = 'bereavement';

  it('should render the component', () => {
    jest.mocked(useApi).mockReturnValue({
      result: {
        data: [],
      },
    } as any);
    render(
      <PersonFormBlock
        id="person_form"
        pageKey="page"
        panelList={[]}
        parameters={mockParameters}
        journeyType={mockJourneyType}
      />,
    );

    expect(screen.getByTestId('person_form_person')).toBeTruthy();
  });

  it('should render the correct fields', () => {
    render(
      <PersonFormBlock
        id="person_form"
        pageKey="page"
        panelList={[]}
        parameters={mockParameters}
        journeyType={mockJourneyType}
      />,
    );

    expect(screen.getByTestId('person_form_person')).toBeTruthy();
    expect(screen.getByText('[[person_form_person_name]]')).toBeTruthy();
    expect(screen.getByText('[[person_form_person_date_of_birth]]')).toBeTruthy();
    expect(screen.getByText('[[person_form_person_phone]]')).toBeTruthy();
    expect(screen.getByText('[[person_form_person_comment]]')).toBeTruthy();
  });
});
