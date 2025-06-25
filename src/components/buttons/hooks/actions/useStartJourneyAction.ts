import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useStartJourneyAction: CustomActionHook = props => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const startCb = useApiCallback(async api => {
    if (props?.pageKey && props?.linkKey && props?.journeyType) {
      await api.mdp.genericJourneyStart(props.journeyType, {
        currentPageKey: props.pageKey,
        nextPageKey: props.linkKey,
        removeOnLogin: true,
      });
    }
    await cachedAccessKey.refresh();
    props?.linkKey && (await router.parseUrlAndPush(props.linkKey));
  });

  return {
    execute: startCb.execute,
    loading: router.parsing || router.loading || startCb.loading || cachedAccessKey.loading,
    disableFurtherActions: true,
  };
};
