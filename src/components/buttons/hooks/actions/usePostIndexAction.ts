import { JourneyTypes } from '../../../../api/content/types/page';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const usePostIndexAction: CustomActionHook = args => {
  const router = useRouter();
  const postIndexCb = useApiCallback(api => {
    if (!args?.journeyType) {
      return Promise.reject();
    }

    if (args.journeyType === JourneyTypes.RETIREMENT) {
      return api.mdp.retirementJourneyPostDocumentsSubmission();
    }

    return api.mdp.postDocumentsSubmission(args.journeyType);
  });

  return { execute: postIndexCb.execute, loading: router.loading || postIndexCb.loading };
};
