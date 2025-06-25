import { addressFormSchema, AddressFormType } from '../../../components/blocks/addressForm/validation';
import { generateFormValues } from '../../mock';

const validForm: AddressFormType = {
  addressLine1: 'address',
  addressLine2: '',
  addressLine3: '',
  addressLine4: '',
  addressLine5: '',
  postCode: '',
  countryCode: '',
  city: '',
};

describe('AddressForm validation', () => {
  it('should validate correct address form', () => {
    expect(addressFormSchema.isValidSync(generateFormValues<AddressFormType>(validForm))).toBeTruthy();
  });

  it('should be invalid without addressLine1 value', () => {
    expect(
      addressFormSchema.isValidSync(generateFormValues<AddressFormType>(validForm, { addressLine1: '' })),
    ).toBeFalsy();
  });

  it('should be invalid with postCode value longer than 8', () => {
    expect(
      addressFormSchema.isValidSync(generateFormValues<AddressFormType>(validForm, { postCode: '123456798' })),
    ).toBeFalsy();
  });
  it('should be invalid with special characters in addressLine1 field', () => {
    expect(
        addressFormSchema.isValidSync(generateFormValues<AddressFormType>(validForm, { addressLine1: '123 Main St!@' })),
    ).toBeFalsy();
  });
});
