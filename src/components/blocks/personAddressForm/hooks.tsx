import { JourneyTypeSelection } from '../../../api/content/types/page';
import { SearchAddressParams } from '../../../api/mdp/types';
import { useApiCallback } from '../../../core/hooks/useApi';

export const usePersonAddressLookup = (journeyType: JourneyTypeSelection) => {
  const addressDetailsCb = useApiCallback((api, id: string) =>
    journeyType === 'bereavement' ? api.mdp.bereavementAddressDetails(id) : api.mdp.addressDetails(id),
  );
  const addressSummaryCb = useApiCallback((api, params: SearchAddressParams) =>
    journeyType === 'bereavement' ? api.mdp.bereavementAddressSummary(params) : api.mdp.addressSummary(params),
  );

  return {
    loadDetails: addressDetailsCb.execute,
    loadSummary: addressSummaryCb.execute,
  };
};
