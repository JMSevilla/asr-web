import { Box } from '@mui/material';
import { useEffect } from 'react';
import { CmsPage } from '../../api/content/types/page';
import { usePageLoaderContext } from '../../core/contexts/PageLoaderContext';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { useRetirementContext } from '../../core/contexts/retirement/RetirementContext';
import { useRouter } from '../../core/router';
import { CalculationsPageLoader } from '../loaders/CalculationsPageLoader';
import { ComponentLoader } from '../loaders/ComponentLoader';

interface Props {
  page: CmsPage | null;
  loading: boolean;
}

export const LoadablePageContent: React.FC<React.PropsWithChildren<Props>> = ({ page, loading, children }) => {
  const { isLoading, setIsCalculationsLoaded, isCalculationsLoaded } = usePageLoaderContext();
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const { retirementCalculation, retirementCalculationLoading, quotesOptionsLoading } = useRetirementContext();

  const calculationsLoading =
    router.asPath === router.staticRoutes.hub &&
    !isCalculationsLoaded &&
    (retirementCalculationLoading || quotesOptionsLoading);
  const isPageLoading = (loading || isLoading) && !calculationsLoading;

  useEffect(() => {
    if (isAuthenticated && retirementCalculation) {
      setIsCalculationsLoaded(true);
      return;
    }
    if (!isAuthenticated) {
      setIsCalculationsLoaded(false);
    }
  }, [isAuthenticated, retirementCalculation]);

  useEffect(() => {
    if (!page && !calculationsLoading && !isPageLoading) {
      router.push(routes => routes.page_not_found);
    }
  }, [page, calculationsLoading, isPageLoading]);

  return (
    <>
      {calculationsLoading && <CalculationsPageLoader />}
      {isPageLoading && (
        <Box flex={1} height="100%" display="flex" alignItems="center" justifyContent="center">
          <ComponentLoader disableMarginBottom />
        </Box>
      )}
      {!isPageLoading && !calculationsLoading &&
        <Box display='flex' flexDirection="column" height="100%">
          {children}
        </Box>}
    </>
  );
};
