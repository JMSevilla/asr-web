import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { DEFAULT_ERROR_NOTIFICATION, useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useAuthContext } from '../../../../core/contexts/auth/AuthContext';
import { MessageType } from '../../../topAlertMessages';
import { CustomActionHook } from '../types';

export const useAuthLoginAction: CustomActionHook = () => {
  const { login, loading, isSingleAuth } = useAuthContext();
  const { showNotifications } = useNotificationsContext();
  const { errorByKey } = useGlobalsContext();

  const executeLogin = async () => {
    if (isSingleAuth) {
      await login({
        onError: () => showNotifications([{ type: MessageType.Problem, message: errorByKey(DEFAULT_ERROR_NOTIFICATION) }]),
      });
    } else {
      throw new Error('Login custom action is not supported for this auth method');
    }
  }

  return {
    execute: executeLogin,
    loading: loading,
  }
};
