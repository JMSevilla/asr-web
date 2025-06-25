import { JourneyTypeSelection } from '../../../api/content/types/page';
import { useApiCallback } from '../../../core/hooks/useApi';

export const useSubmitGBGScanId = (journeyType?: JourneyTypeSelection) => {
  const { execute, loading, error, status } = useApiCallback((api, args: string) => {
    switch (journeyType) {
      case 'retirement':
      case 'dcretirementapplication':
      case 'dbcoreretirementapplication':
        return api.mdp.saveRetirementGBGScanId(args);
      case 'transfer2':
        return api.mdp.saveTransferGBGScanId(args);
      default:
        return Promise.reject();
    }
  });

  return { execute, loading, error, status };
};
