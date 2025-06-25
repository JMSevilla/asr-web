import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useDownloadTemplateAction: CustomActionHook = props => {
  const router = useRouter();
  const accessKey = useCachedAccessKey();
  const pdfDownloadCb = useApiCallback(api =>
    props?.journeyType && accessKey.data?.contentAccessKey && props.actionParam
      ? api.mdp.genericJourneyDownloadTemplate(props.journeyType, props.actionParam, accessKey.data.contentAccessKey)
      : Promise.reject(),
  );

  return { execute: pdfDownloadCb.execute, loading: router.loading || accessKey.loading || pdfDownloadCb.loading };
};
