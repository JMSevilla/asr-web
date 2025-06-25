import { phoneFormSchema, PhoneFormType } from '../../../components/blocks/phoneForm/validation';
import { generateFormValues } from '../../mock';

const validForm: PhoneFormType = {
  phone: '+37000',
};

describe('PhoneForm validation', () => {
  describe('Great Britain phone number', () => {
    it('should start Great Britain numbers with 7', () => {
      expect(
        phoneFormSchema('GB').isValidSync(generateFormValues<PhoneFormType>({ phone: '7000000000' })),
      ).toBeTruthy();
      expect(phoneFormSchema('GB').isValidSync(generateFormValues<PhoneFormType>({ phone: '1700000000' }))).toBeFalsy();
    });
    it('should be length of 10', () => {
      expect(
        phoneFormSchema('GB').isValidSync(
          generateFormValues<PhoneFormType>(validForm, { phone: new Array(11).join('7') }),
        ),
      ).toBeTruthy();
      expect(
        phoneFormSchema('GB').isValidSync(
          generateFormValues<PhoneFormType>(validForm, { phone: new Array(12).join('7') }),
        ),
      ).toBeFalsy();
      expect(
        phoneFormSchema('GB').isValidSync(
          generateFormValues<PhoneFormType>(validForm, { phone: new Array(10).join('7') }),
        ),
      ).toBeFalsy();
    });
  });
  describe('other phone number', () => {
    it('should validate correct phone form', () => {
      expect(phoneFormSchema().isValidSync(generateFormValues<PhoneFormType>(validForm))).toBeTruthy();
    });

    it('should be invalid without phone value', () => {
      expect(phoneFormSchema().isValidSync(generateFormValues<PhoneFormType>(validForm, { phone: '' }))).toBeFalsy();
    });

    it('should be invalid with phone value longer than 20', () => {
      expect(
        phoneFormSchema().isValidSync(generateFormValues<PhoneFormType>(validForm, { phone: new Array(22).join('a') })),
      ).toBeFalsy();
    });

    it('should be invalid with phone value shorter than 3', () => {
      expect(phoneFormSchema().isValidSync(generateFormValues<PhoneFormType>(validForm, { phone: '00' }))).toBeFalsy();
    });
  });
});
