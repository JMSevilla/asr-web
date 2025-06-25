import { Api } from '../api/api';
import { CmsGlobals } from '../api/content/types/globals';
import { CmsPage, JourneyTypeSelection } from '../api/content/types/page';
import { extractClassifierItemValueFromGlobals } from '../business/globals';
import { BereavementFormStatus } from './contexts/persistentAppState/hooks/bereavement/form';
import { PersistentAppState } from './contexts/persistentAppState/PersistentAppStateContext';
import { useRouter } from './router';

export async function validateJourneyIntegrity(
  api: Api,
  page: CmsPage | null,
  globals: CmsGlobals | null,
  router: ReturnType<typeof useRouter>,
  persistentAppState: PersistentAppState,
) {
  const journeyType = page?.journeyType?.value?.selection.toLowerCase() as JourneyTypeSelection | undefined;
  if (!page || !journeyType) {
    return;
  }

  if (
    journeyType === 'bereavement' &&
    persistentAppState.bereavement.form.status === BereavementFormStatus.NotStarted
  ) {
    return await router.push(extractClassifierItemValueFromGlobals('global_routes', 'bereavement_start', globals!)!);
  }

  try {
    const integrity = await integrityByJourneyType(api, journeyType, page.pageKey.value);
    if (integrity && page.pageKey.value !== integrity.data.redirectStepPageKey) {
      const nextPageUrl = await api.content.urlFromKey(integrity.data.redirectStepPageKey);
      if (router.asPath !== nextPageUrl.data.url) {
        await router.push(nextPageUrl.data.url);
      }
    }
  } catch {
    await router.push(extractClassifierItemValueFromGlobals('global_routes', 'page_not_found', globals!)!);
  }
}

const integrityByJourneyType = async (api: Api, journeyType: JourneyTypeSelection, pageKey: string) => {
  switch (journeyType) {
    case 'retirement':
      return await api.mdp.journeyIntegrityResponse(pageKey);
    case 'bereavement':
      return await api.mdp.bereavementJourneyIntegrity(pageKey);
    case 'quoteselection':
      return await api.mdp.quoteSelectionJourneyIntegrity(pageKey);
    case 'transfer2':
      return await api.mdp.transferJourneyIntegrity(pageKey);
    default: {
      if (!!journeyType) {
        return await api.mdp.genericJourneyIntegrity(journeyType, pageKey);
      }
      return null;
    }
  }
};
