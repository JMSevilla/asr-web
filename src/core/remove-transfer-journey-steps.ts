import { Api } from '../api/api';
import { CmsPage, JourneyTypeSelection } from '../api/content/types/page';

export async function removeTransferJourneySteps(api: Api, page: CmsPage | null) {
  const journeyType = page?.journeyType?.value?.selection.toLowerCase() as JourneyTypeSelection | undefined;
  const removeFromJourneySteps = page?.removeFromJourneySteps?.value;
  const pageKey = page?.pageKey?.value;

  if (!page || !journeyType || !pageKey || !removeFromJourneySteps) {
    return;
  }

  try {
    await integrityByJourneyType(api, journeyType, pageKey);
  } catch {}
}

const integrityByJourneyType = async (api: Api, journeyType: JourneyTypeSelection, pageKey: string) => {
  switch (journeyType) {
    case 'transfer2':
      return await api.mdp.transferJourneyRemoveStepFrom(pageKey);
    default:
      return null;
  }
};
