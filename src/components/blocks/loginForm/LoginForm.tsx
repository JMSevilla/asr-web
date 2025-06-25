import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Stack } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PrimaryButton, TextField } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { SingleAuthOptionsModal } from './SingleAuthOptionsModal';
import { LoginForm as LoginFormType, loginFormSchema } from './validation';

interface Props {
  onSubmit: (values: LoginFormType) => void;
  submitLoading: boolean;
}

type ModalType = 'login' | 'register' | 'registerWorkEmail' | null;

export const LoginForm: React.FC<Props> = ({ onSubmit, submitLoading }) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const { handleSubmit, control, formState, setFocus, clearErrors } = useForm<LoginFormType>({
    resolver: yupResolver(loginFormSchema),
    mode: 'onChange',
    defaultValues: loginFormSchema.getDefault(),
  });

  useFormFocusOnError<LoginFormType>(formState.errors, setFocus);

  const handleModalOpen = (modalType: ModalType) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const saWorkEmailRegisterFields = [
    {
      name: 'email',
      label: 'Email Address',
    },
  ];

  const saLoginFields = [
    {
      name: 'email',
      label: 'Email Address',
    },
    {
      name: 'returnUrl',
      label: 'Return URL',
    },
    {
      name: 'next',
      label: 'Next URL',
    },
  ];

  return (
    <>
      <form data-testid="authentication_form" id="login-form" name="login-form">
        <Grid container direction="column" rowSpacing={12}>
          <Grid item md={6} lg={4}>
            <TextField<LoginFormType>
              data-testid="auth-username"
              name="userName"
              control={control}
              label={labelByKey('username')}
              tooltip={tooltipByKey('forgot_username')}
              errorTooltip={tooltipByKey('forgot_username')}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid item md={6} lg={4}>
            <TextField<LoginFormType>
              data-testid="auth-password"
              name="password"
              type="password"
              control={control}
              label={labelByKey('password')}
              tooltip={tooltipByKey('forgot_password')}
              errorTooltip={tooltipByKey('forgot_password')}
              onBlur={() => clearErrors()}
            />
          </Grid>
        </Grid>
        <Box mt={16}>
          <PrimaryButton
            onClick={handleSubmit(onSubmit)}
            loading={submitLoading}
            id="login-button"
            name="login-button"
            data-testid="auth-submit-button"
          >
            {labelByKey('login_button')}
          </PrimaryButton>
        </Box>
        <Box mt={8}>
          <Stack spacing={2}>
            <a href="#" id="sa-login" onClick={handleModalOpen('login')}>
              Single Auth Login
            </a>
            <a href="/sa/register" id="sa-register">
              Single Auth Register - IDV
            </a>
            <a href="#" id="sa-register-work-email" onClick={handleModalOpen('registerWorkEmail')}>
              Single Auth Register - Work Email
            </a>
          </Stack>
        </Box>
      </form>

      <SingleAuthOptionsModal
        open={activeModal === 'login'}
        onClose={handleCloseModal}
        header="Single Auth Sign-in"
        redirectPath="/sa/sign-in"
        fields={saLoginFields}
      />
      <SingleAuthOptionsModal
        open={activeModal === 'registerWorkEmail'}
        onClose={handleCloseModal}
        header="Single Auth Register Work Email"
        redirectPath="/sa/register?type=work-email"
        fields={saWorkEmailRegisterFields}
      />
    </>
  );
};
