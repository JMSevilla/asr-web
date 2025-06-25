import { useAuthContext } from '../contexts/auth/AuthContext';
import { usePageLoaderContext } from '../contexts/PageLoaderContext';
import { logger } from '../datadog-logs';
import { useRouter } from '../router';

export const useLogout = () => {
  const auth = useAuthContext();
  const { setIsLoading } = usePageLoaderContext();
  const router = useRouter();
  const logoutUrl = router.getLogoutUrl('epa_logout_url', 'logoutUrl');

  return {
    logout: async () => {
      setIsLoading(true);
      await auth.logout();

      if (logoutUrl) {
        window.location.replace(logoutUrl);
        return;
      }

      logger.warn('epa_logout_url not provided or CMS tenant logoutUrl is not defined');
      await router.replace(routes => routes.logout, { shallow: false });
      setIsLoading(false);
    },
  };
};
