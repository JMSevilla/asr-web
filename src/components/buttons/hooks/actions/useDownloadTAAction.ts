import { useApiCallback } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useDownloadTAAction: CustomActionHook = () => {
  const router = useRouter();
  const pdfDownloadCb = useApiCallback(api => api.mdp.transferDocument());

  return { execute: pdfDownloadCb.execute, loading: router.loading || pdfDownloadCb.loading };
};
