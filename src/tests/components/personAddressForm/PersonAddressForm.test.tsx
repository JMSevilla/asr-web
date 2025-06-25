import { PersonAddressForm } from '../../../components/blocks/personAddressForm/PersonAddressForm';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn().mockReturnValue({ cb: jest.fn(), key: 'key' }),
}));
jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
  }),
}));
jest.mock('../../../core/hooks/useFormFocusOnError', () => ({
  useFormFocusOnError: jest.fn().mockReturnValue({ enabled: false, cb: jest.fn() }),
}));

const DEFAULT_DATA = {
  prefix: 'address-form',
  defaultValues: {
    address: {
      line1: '',
      line2: '',
      line3: '',
      line4: '',
      line5: '',
      country: '',
      countryCode: 'GB',
      postCode: '',
      countryName: '',
    },
  },
  isStandAlone: false,
  isOptional: false,
  onSubmit: jest.fn(),
  onAddressDetailsLookup: jest.fn(),
  onAddressSummaryLookup: jest.fn(),
};

describe('PersonAddressForm', () => {
  it('should render person address form with lookup', () => {
    render(<PersonAddressForm {...DEFAULT_DATA} />);

    expect(screen.getByTestId('address-form_form')).toBeTruthy();
    expect(screen.getByTestId('address-search')).toBeTruthy();
  });
});
