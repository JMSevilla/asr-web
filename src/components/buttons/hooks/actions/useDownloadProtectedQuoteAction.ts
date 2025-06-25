import { useApiCallback } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useDownloadProtectedQuoteAction: CustomActionHook = props => {
  const router = useRouter();

  const pdfDownloadCb = useApiCallback(api =>
    props?.params ? api.mdp.downloadProtectedQuote(props.params) : Promise.reject(),
  );

  return { execute: pdfDownloadCb.execute, loading: router.loading || pdfDownloadCb.loading };
};
