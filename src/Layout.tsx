import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { PreloadedGlobals } from './api/content/types/globals';
import { JourneyTypeSelection } from './api/content/types/page';
import { extractLabelFromGlobals, extractPreloadedLabelFromGlobals } from './business/globals';
import {
  AccessibilitySkipLinks,
  Footer,
  Header,
  PageContainer,
  PageContent,
  SingleAuthCustomLoader,
} from './components';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatBotWidget } from './components/chatBot/ChatBotWidget';
import { LoadablePageContent } from './components/page/LoadablePageContent';
import { config } from './config';
import { AcknowledgementsContextProvider } from './core/contexts/AcknowledgementsContext';
import { FormSubmissionContextProvider } from './core/contexts/FormSubmissionContext';
import { GlobalsProvider } from './core/contexts/GlobalsContext';
import { JourneyIndicatorContextProvider } from './core/contexts/JourneyIndicatorContext';
import { NotificationsContextProvider } from './core/contexts/NotificationsContext';
import { PopupContextProvider } from './core/contexts/PopupContextProvider';
import { useTenantContext } from './core/contexts/TenantContext';
import { TransferJourneyContextProvider } from './core/contexts/TransferJourneyContext';
import { AlertsProvider } from './core/contexts/alerts/AlertsContext';
import { useAuthContext } from './core/contexts/auth/AuthContext';
import { useContentDataContext } from './core/contexts/contentData/ContentDataContext';
import { DialogContextProvider } from './core/contexts/dialog/DialogContext';
import { TaskListProvider } from './core/contexts/tasks/TaskListContext';
import { useCachedAccessKey } from './core/hooks/useCachedAccessKey';
import { useDataDogMonitoring } from './core/hooks/useDataDogMonitoring';
import { useDocumentCleanup } from './core/hooks/useDocumentCleanup';
import { useDynamicTabIcon } from './core/hooks/useDynamicTabIcon';
import { useLogout } from './core/hooks/useLogout';
import { useRefreshSingleAuthTokenHandler } from './core/hooks/useRefreshSingleAuthTokenHandler';
import { useRefreshTokenHandler } from './core/hooks/useRefreshTokenHandler';
import { theme } from './core/theme/theme';

interface Props {
  preloadedGlobals: PreloadedGlobals;
}

export const Layout: React.FC<Props> = ({ preloadedGlobals }) => {
  const { logout } = useLogout();
  const { tenant } = useTenantContext();
  const contentData = useContentDataContext();
  const cachedAccessKey = useCachedAccessKey();
  const { isSingleAuth } = useAuthContext();

  const currentJourneyType = contentData.page?.journeyType?.value?.selection?.toLowerCase() as JourneyTypeSelection;
  useDocumentCleanup(currentJourneyType);

  const schemeType = cachedAccessKey.data?.schemeType;
  const businessGroup = tenant?.businessGroup?.values?.[0];
  const helpWidgetConfig = config.value.EXCLUDE_HIDE_HELP_FOR_BGROUPS_DC.split(',');

  const shouldShowChatBotWidget =
    !tenant.hideHelp?.value &&
    !contentData.loading &&
    contentData.cmsTokens &&
    (schemeType === 'DB' || (helpWidgetConfig.includes(businessGroup) && schemeType === 'DC'));

  if (isSingleAuth) {
    useRefreshSingleAuthTokenHandler(logout);
  } else {
    useRefreshTokenHandler(logout);
  }

  useDataDogMonitoring();
  useDynamicTabIcon(tenant);

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <ThemeProvider theme={theme(tenant)}>
        <CssBaseline />
        <SingleAuthCustomLoader />
        <ErrorBoundary errorMessage={extractPreloadedLabelFromGlobals('page_error', preloadedGlobals)}>
          <GlobalsProvider
            tenant={tenant}
            globals={contentData.globals}
            stickOut={contentData.page?.showAsStickOut?.value}
            preloadedGlobals={preloadedGlobals}
          >
            <JourneyIndicatorContextProvider>
              <AcknowledgementsContextProvider>
                <TransferJourneyContextProvider>
                  <TaskListProvider taskListContainer={contentData.globals?.taskListContainer}>
                    <NotificationsContextProvider>
                      <FormSubmissionContextProvider>
                        <DialogContextProvider
                          loading={contentData.loading}
                          dialogOnLoad={contentData?.page?.showDialogOnLoad}
                        >
                          <PopupContextProvider>
                            <Box minHeight="100vh" display="flex" flexDirection="column">
                              {!contentData.hideTemplateNavigation && (
                                <AccessibilitySkipLinks page={contentData.page} />
                              )}
                              <Header
                                onLogout={logout}
                                tenant={tenant}
                                menuData={contentData.menu}
                                pageKey={contentData.page?.pageKey?.value}
                                membershipData={contentData.membership}
                                hideNavigation={contentData.hideTemplateNavigation}
                              />
                              <PageContainer
                                stickOut={contentData.page?.showAsStickOut?.value}
                                loading={contentData.loading}
                                page={contentData.page}
                              >
                                <LoadablePageContent page={contentData.page} loading={contentData.loading}>
                                  <AlertsProvider page={contentData.page}>
                                    <PageContent page={contentData.page} tenant={tenant} />
                                  </AlertsProvider>
                                </LoadablePageContent>
                              </PageContainer>
                              <Footer
                                linkGroups={contentData.footer?.elements.linkGroups}
                                logo={tenant?.footerLogo?.renditions?.default}
                                copyrightText={extractLabelFromGlobals('copyright', contentData?.globals)}
                                hideNavigation={contentData.hideTemplateNavigation}
                              />
                              {shouldShowChatBotWidget && <ChatBotWidget />}
                            </Box>
                          </PopupContextProvider>
                        </DialogContextProvider>
                      </FormSubmissionContextProvider>
                    </NotificationsContextProvider>
                  </TaskListProvider>
                </TransferJourneyContextProvider>
              </AcknowledgementsContextProvider>
            </JourneyIndicatorContextProvider>
          </GlobalsProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </LocalizationProvider>
  );
};
