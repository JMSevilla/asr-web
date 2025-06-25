import { Box } from '@mui/material';
import { useState } from 'react';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { useRouter } from '../../../core/router';
import { MessageType } from '../../topAlertMessages';
import { LoginForm } from './LoginForm';
import { LoginForm as LoginFormType } from './validation';

interface Props {
  id?: string;
  backgroundColor?: string | null;
  parameters: { key: string; value: string }[];
}

export const LoginFormBlock: React.FC<Props> = ({ id, parameters, backgroundColor }) => {
  const router = useRouter();
  const { errorByKey } = useGlobalsContext();
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { showNotifications } = useNotificationsContext();

  return (
    <Box id={id} sx={{ backgroundColor }} display="flex">
      <LoginForm onSubmit={handleSubmit} submitLoading={loading} />
    </Box>
  );

  async function handleSubmit({ userName, password }: LoginFormType) {
    try {
      setLoading(true);
      await login({ userName, password });
      await router.push(router => router.hub);
    } catch (err) {
      const errors = err as string[];
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          title: errorByKey('authentication_form_error'),
          message: errorByKey(error),
        })),
      );
    } finally {
      setLoading(false);
    }
  }
};
