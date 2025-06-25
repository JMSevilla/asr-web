import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useSubmitStartedTAAction: CustomActionHook = props => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const submitCb = useApiCallback(async api => {
    props?.pageKey &&
      props?.linkKey &&
      (await api.mdp.transferJourneySubmitStep({ currentPageKey: props.pageKey, nextPageKey: props.linkKey }));
    await api.mdp.transferJourneyChangeStatus('SubmitStarted');
    await cachedAccessKey.refresh();
    props?.linkKey && (await router.parseUrlAndPush(props.linkKey));
  });

  return {
    execute: submitCb.execute,
    loading: router.parsing || router.loading || submitCb.loading,
    disableFurtherActions: true,
  };
};
