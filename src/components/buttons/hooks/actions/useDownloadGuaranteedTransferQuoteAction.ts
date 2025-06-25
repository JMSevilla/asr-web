import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useDownloadGuaranteedTransferQuoteAction: CustomActionHook = () => {
  const router = useRouter();
  const { data: accessKey } = useCachedAccessKey();
  const pdfDownloadCb = useApiCallback(api =>
    accessKey ? api.mdp.guaranteedTransferQuoteDocument(accessKey.contentAccessKey) : Promise.reject(),
  );
  return { execute: pdfDownloadCb.execute, loading: router.loading || pdfDownloadCb.loading };
};
