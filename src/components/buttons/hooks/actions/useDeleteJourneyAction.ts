import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useDeleteJourneyAction: CustomActionHook = props => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const deleteCb = useApiCallback(async api => {
    if (props?.journeyType) {
      await api.mdp.genericJourneyDelete(props.journeyType);
    }
    await cachedAccessKey.refresh();
    props?.linkKey && (await router.parseUrlAndPush(props.linkKey));
  });

  return {
    execute: deleteCb.execute,
    loading: router.parsing || router.loading || deleteCb.loading || cachedAccessKey.loading,
    disableFurtherActions: true,
  };
};
