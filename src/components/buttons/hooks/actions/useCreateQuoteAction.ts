import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useCreateQuoteAction =
  (caseType: string): CustomActionHook =>
  props => {
    const router = useRouter();
    const cachedAccessKey = useCachedAccessKey();
    const submitCb = useApiCallback(async api => {
      if (props?.pageKey && props?.linkKey && props?.journeyType) {
        await api.mdp.genericJourneySubmitStep(props.journeyType, {
          currentPageKey: props.pageKey,
          nextPageKey: props.linkKey,
        });
      }
      if (cachedAccessKey.data?.contentAccessKey) {
        await api.mdp.genericJourneySubmitCase(caseType, cachedAccessKey.data?.contentAccessKey);
        await cachedAccessKey.refresh();
      }
      props?.linkKey && (await router.parseUrlAndPush(props.linkKey));
    });

    return {
      execute: submitCb.execute,
      loading: router.parsing || router.loading || submitCb.loading || cachedAccessKey.loading,
      disableFurtherActions: true,
    };
  };
