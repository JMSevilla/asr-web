import { personAddressFormSchema } from '../../../components/blocks/personAddressForm/validation';

describe('personAddressFormSchema', () => {
  it('should validate required field', async () => {
    const schemaHasNoRequiredField = personAddressFormSchema('address-form_form', true);
    const schemaHasRequiredField = personAddressFormSchema('address-form_form', false);
    const validData = {
      address: {
        line1: 'Test Address',
        line2: 'Test Address',
        line3: 'Test Address',
        line4: 'Test Address',
        line5: 'Test Address',
        postCode: '123 456',
        countryCode: 'GB',
        country: 'United Kingdom',
        countryName: 'United Kingdom',
      },
    };
    const requiredValidData = {
      address: {
        line1: 'test address line 1',
        line2: 'test address line 2',
        line3: 'test address line 3',
        line4: 'test address line 4',
        line5: 'test address line 5',
        postCode: '',
        countryCode: 'GB',
        country: '',
        countryName: '',
      },
    };
    const invalidData = {
      address: {
        line2: '',
        line3: '',
        line4: '',
        line5: '',
        postCode: '',
        countryCode: '',
        country: '',
        countryName: '',
      },
    };
    const invalidDataWithRegex = {
      address: {
        line1: '123 Main St!@',
        line2: 'Apt #$%^',
        line3: 'P.O. Box 123&*()',
        line4: 'C/O John Doe^',
        line5: 'Suite 456@!',
        postCode: 'W1A 1AA$!',
        countryCode: 'GB',
        country: 'United Kingdom',
        countryName: 'United Kingdom',
      },
    };
    await expect(schemaHasNoRequiredField.validate(validData)).resolves.toBe(validData);
    await expect(schemaHasRequiredField.validate(requiredValidData)).resolves.toBe(requiredValidData);
    await expect(schemaHasRequiredField.validate(invalidData)).rejects.toThrow();
    await expect(schemaHasRequiredField.validate(invalidDataWithRegex)).rejects.toThrow();
  });
});
