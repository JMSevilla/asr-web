import { LoginForm, loginFormSchema } from '../../../components/blocks/loginForm/validation';
import { generateFormValues } from '../../mock';

const validForm: LoginForm = {
  userName: 'name',
  password: 'pass',
};

describe('LoginForm validation', () => {
  it('should validate correct login form', () => {
    expect(loginFormSchema.isValidSync(generateFormValues<LoginForm>(validForm))).toBeTruthy();
  });

  it('should be invalid with name longer than 80', () => {
    expect(
      loginFormSchema.isValidSync(generateFormValues<LoginForm>(validForm, { userName: new Array(82).join('a') })),
    ).toBeFalsy();
  });

  it('should be invalid with password longer than 128', () => {
    expect(
      loginFormSchema.isValidSync(generateFormValues<LoginForm>(validForm, { userName: new Array(130).join('a') })),
    ).toBeFalsy();
  });
});
