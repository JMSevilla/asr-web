import { ComponentProps } from 'react';
import { EmailValidation } from '../../../components/blocks/emailForm/EmailValidation';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

const DEFAULT_PROPS: ComponentProps<typeof EmailValidation> = {
  id: '',
  onContinue: jest.fn(),
  email: '',
  onBackClick: jest.fn(),
  onTokenChange: jest.fn(),
  onTokenCompleted: jest.fn(),
  enabled: false,
  defaultEmail: 'johndoetest@gmail.com',
  onDefaultEmailClick: jest.fn(),
  submitLoading: false,
  expiredToken: false,
  isCodeResent: false,
  onExpiredTokenClick: jest.fn(),
  isCloseButtonHidden: false,
};

describe('EmailValidation', () => {
  it('should render email validation correctly', async () => {
    render(<EmailValidation {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('email-form-revert')).toBeTruthy();
    expect(screen.getByTestId('email-validation-continue')).toBeInTheDocument();
  });
});
