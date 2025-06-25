import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useDeleteTAAction: CustomActionHook = () => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const submitCb = useApiCallback(async api => {
    await api.mdp.transferJourneyDelete();
    await cachedAccessKey.refresh();
    router.reload();
  });

  return { execute: submitCb.execute, loading: router.loading || submitCb.loading, disableFurtherActions: true };
};
