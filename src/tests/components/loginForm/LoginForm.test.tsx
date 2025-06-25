import { LoginForm } from '../../../components';
import { act, render, screen, userEvent } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  it('should render login form with two inputs', () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} submitLoading={false} />);

    expect(screen.getByTestId('auth-username')).toBeInTheDocument();
    expect(screen.getByTestId('auth-password')).toBeInTheDocument();
  });

  it('should login user', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} submitLoading={false} />);

    await act(async () => {
      await userEvent.type(screen.getByTestId('auth-username'), 'name');
      await userEvent.type(screen.getByTestId('auth-password'), 'password');
      await userEvent.click(screen.getByTestId('auth-submit-button'));
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should show mandatory inputs errors keys if inputs are empty ', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} submitLoading={false} />);

    await act(async () => await userEvent.click(screen.getByTestId('auth-submit-button')));

    expect(screen.getByText('[[user_id_mandatory_field]]')).toBeInTheDocument();
    expect(screen.getByText('[[password_mandatory_field]]')).toBeInTheDocument();
  });

  it('should show inputs errors keys if username length  more than 80 and password more then 128', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} submitLoading={false} />);

    await act(async () => {
      await userEvent.type(screen.getByTestId('auth-username'), [...Array(82)].join('t'));
      await userEvent.type(screen.getByTestId('auth-password'), [...Array(130)].join('t'));
      await userEvent.click(screen.getByTestId('auth-submit-button'));
    });

    expect(screen.getByText('[[user_id_max_length]]')).toBeInTheDocument();
    expect(screen.getByText('[[password_max_length]]')).toBeInTheDocument();
  });
});
