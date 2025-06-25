import { useApiCallback } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useDownloadRetirementQuoteAction: CustomActionHook = () => {
  const router = useRouter();
  const pdfDownloadCb = useApiCallback(api => api.mdp.retirementQuoteDocument());

  return { execute: pdfDownloadCb.execute, loading: router.loading || pdfDownloadCb.loading };
};
