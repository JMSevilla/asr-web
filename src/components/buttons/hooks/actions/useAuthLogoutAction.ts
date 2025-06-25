import { useAuthContext } from '../../../../core/contexts/auth/AuthContext';
import { useLogout } from '../../../../core/hooks/useLogout';
import { CustomActionHook } from '../types';

export const useAuthLogoutAction: CustomActionHook = () => {
  const { loading } = useAuthContext();
  const { logout } = useLogout();

  const executeLogout = async () => await logout();

  return {
    execute: executeLogout,
    loading: loading,
  }
};
