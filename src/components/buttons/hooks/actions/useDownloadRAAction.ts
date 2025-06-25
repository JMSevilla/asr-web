import { useApiCallback } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useDownloadRAAction: CustomActionHook = () => {
  const router = useRouter();
  const pdfDownloadCb = useApiCallback(api => api.mdp.retirementJourneyDocument());

  return { execute: pdfDownloadCb.execute, loading: router.loading || pdfDownloadCb.loading };
};
