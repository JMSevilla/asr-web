import { emailFormSchema, EmailsFormType } from '../../../components/blocks/emailForm/validation';
import { generateFormValues } from '../../mock';

const validForm: EmailsFormType = {
  email: 'xx@xx.xx',
};

describe('EmailForm validation', () => {
  it('should validate correct email form', () => {
    expect(emailFormSchema.isValidSync(generateFormValues<EmailsFormType>(validForm))).toBeTruthy();
  });

  it('should be invalid without email value', () => {
    expect(emailFormSchema.isValidSync(generateFormValues<EmailsFormType>(validForm, { email: '' }))).toBeFalsy();
  });

  it('should be invalid with not email value', () => {
    expect(emailFormSchema.isValidSync(generateFormValues<EmailsFormType>(validForm, { email: `xxx` }))).toBeFalsy();
  });

  it('should be invalid with email value longer than 50', () => {
    expect(
      emailFormSchema.isValidSync(
        generateFormValues<EmailsFormType>(validForm, { email: `xx@xx.xx${new Array(52).join('a')}` }),
      ),
    ).toBeFalsy();
  });
});
