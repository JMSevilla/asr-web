import { createContext, useContext, useEffect, useMemo } from 'react';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { SubmitStepParams } from '../../../api/mdp/types';
import { useApiCallback } from '../../hooks/useApi';
import { useRouter } from '../../router';
import { useTenantContext } from '../TenantContext';
import { useContentDataContext } from '../contentData/ContentDataContext';
import { useCachedCmsTokens } from '../contentData/useCachedCmsTokens';
import { usePersistentAppState } from '../persistentAppState/PersistentAppStateContext';
import { BereavementFormStatus } from '../persistentAppState/hooks/bereavement/form';
import { useBereavementSessionIdleTimer } from './hooks';

const context = createContext<{
  bereavementLogin(params: SubmitStepParams): Promise<void>;
  bereavementContinue: AsyncFunction;
  bereavementRestart: VoidFunction;
  bereavementSubmit: AsyncFunction;
  bereavementDelete: VoidFunction;
  resetSession: AsyncFunction;
  endSession: AsyncFunction;
  loginError?: Error | null;
  submitError?: Error | null;
}>(undefined as any);

export const BereavementSessionProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const { tenant } = useTenantContext();
  const { bereavement } = usePersistentAppState();
  const cmsTokens = useCachedCmsTokens();
  const contentData = useContentDataContext();
  const isCurrentPageInBereavementJourney =
    (contentData.page?.journeyType?.value?.selection.toLowerCase() as JourneyTypeSelection) === 'bereavement';
  const bereavementLoginCb = useApiCallback((api, params: string[]) => api.authentication.bereavementLogin(params));
  const startJourneyCb = useApiCallback((api, params: SubmitStepParams) => api.mdp.bereavementJourneyStart(params));
  const submitJourneyCb = useApiCallback(api =>
    api.mdp.bereavementSubmit(tenant.tenantUrl.value, bereavement.form.values),
  );
  const endJourneyCb = useApiCallback(api => api.mdp.bereavementEnd());
  const extendExpirationDateCb = useApiCallback(async api => {
    const result = await api.mdp.bereavementJourneyKeepAlive();
    bereavement.expiration.update(new Date(result.data.expirationDate));
  });
  const bereavementIdleTimer = useBereavementSessionIdleTimer({
    expirationDate: bereavement.expiration.date,
    onAboutToExpire: bereavement.expiration.notify,
    onSessionExpired: handleExpiredSession,
    onExtendSession: extendExpirationDateCb.execute,
  });

  useEffect(() => {
    if (isCurrentPageInBereavementJourney && bereavement.expiration.date) {
      bereavementIdleTimer.start();
      return;
    }
  }, [router.asPath, isCurrentPageInBereavementJourney]);

  useEffect(() => {
    if (!isCurrentPageInBereavementJourney && bereavement.expiration.date) {
      bereavementIdleTimer.stop();
      bereavement.expiration.reset();
      return;
    }
    if (isCurrentPageInBereavementJourney && !bereavement.expiration.date) {
      handleExpiredSession();
    }
  }, [isCurrentPageInBereavementJourney]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isCurrentPageInBereavementJourney || bereavement.form.status === BereavementFormStatus.NotStarted) {
      return () => window.removeEventListener('beforeunload', alertUser);
    }
    window.addEventListener('beforeunload', alertUser);
    return () => window.removeEventListener('beforeunload', alertUser);
  }, [isCurrentPageInBereavementJourney, bereavement.form.status]);

  return (
    <context.Provider
      value={useMemo(
        () => ({
          bereavementLogin: async (params: SubmitStepParams) => {
            await bereavementLoginCb.execute(tenant?.businessGroup?.values ?? []);
            await startJourneyCb.execute(params);
            await bereavementIdleTimer.start();
            bereavement.form.start();
          },
          bereavementContinue: bereavementIdleTimer.start,
          bereavementRestart: bereavement.form.reset,
          bereavementSubmit: async () => {
            const result = await submitJourneyCb.execute();
            cmsTokens.update('bereavementCaseNumber', result.data.caseNumber);
            bereavementIdleTimer.stop();
            bereavement.expiration.reset();
          },
          bereavementDelete: async () => {
            bereavement.form.reset();
            await endJourneyCb.execute();
          },
          resetSession: bereavementIdleTimer.start,
          endSession: handleExpiredSession,
          loginError: bereavementLoginCb.error || startJourneyCb.error,
          submitError: submitJourneyCb.error,
        }),
        [bereavementLoginCb.error, startJourneyCb.error, submitJourneyCb.error, router.staticRoutes],
      )}
    >
      {children}
    </context.Provider>
  );

  async function handleExpiredSession() {
    window.removeEventListener('beforeunload', alertUser);
    bereavementIdleTimer.stop();
    bereavement.expiration.reset();
    bereavement.form.reset();
    await router.push(routes => routes.bereavement_start);
  }
};

export const useBereavementSession = () => {
  if (!context) {
    throw new Error('BereavementSessionProvider should be used');
  }

  return useContext(context);
};

const alertUser = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = '';
};
