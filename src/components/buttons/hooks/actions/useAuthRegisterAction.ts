import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { DEFAULT_ERROR_NOTIFICATION, useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useAuthContext } from '../../../../core/contexts/auth/AuthContext';
import { MessageType } from '../../../topAlertMessages';
import { CustomActionHook } from '../types';

export const useAuthRegisterAction: CustomActionHook = () => {
  const { register, isSingleAuth, loading } = useAuthContext();
  const { showNotifications } = useNotificationsContext();
  const { errorByKey } = useGlobalsContext();

  const executeRegister = async () => {
    if (isSingleAuth) {
      await register({
        onError: () => showNotifications([{ type: MessageType.Problem, message: errorByKey(DEFAULT_ERROR_NOTIFICATION) }]),
      });
    } else {
      throw new Error('Register custom action is not supported for this auth method');
    }
  }

  return {
    execute: executeRegister,
    loading: loading,
  }
};
