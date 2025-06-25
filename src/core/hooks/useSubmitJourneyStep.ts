import { JourneyTypeSelection } from '../../api/content/types/page';
import { SubmitStepParams } from '../../api/mdp/types';
import { useApiCallback } from './useApi';

export const useSubmitJourneyStep = (journeyType?: JourneyTypeSelection) => {
  const { execute, loading, error } = useApiCallback((api, args: SubmitStepParams) => {
    switch (journeyType) {
      case 'retirement':
        return api.mdp.submitJourneyStep(args);
      case 'transfer2':
        return api.mdp.transferJourneySubmitStep(args);
      case 'bereavement':
        return api.mdp.bereavementJourneySubmitStep(args);
      default:
        if (!!journeyType) {
          return api.mdp.genericJourneySubmitStep(journeyType, args);
        }
        return Promise.reject();
    }
  });

  return { execute, loading, error };
};
