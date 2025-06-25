import { JourneyTypeSelection } from '../../api/content/types/page';
import { logger } from '../../core/datadog-logs';
import { usePersistentAppState } from '../contexts/persistentAppState/PersistentAppStateContext';
import { useRouter } from '../router';

/**
 * Navigates to the next page in the journey.
 * @param journeyType The journey type to navigate for.
 * @param nextPageKey The page key to navigate to.
 * @returns The navigate function.
 * @example
 * const journeyNavigation = useJourneyNavigation('transfer2', 'pageKey');
 * journeyNavigation.navigate(); // should be awaited
 */
export const useJourneyNavigation = (journeyType?: JourneyTypeSelection | undefined, nextPageKey?: string) => {
  const router = useRouter();
  const { fastForward } = usePersistentAppState();

  const goNext = async () => {
    if (!journeyType || !nextPageKey) {
      logger.error('journeyType and nextPageKey must be provided');
      return;
    }

    if (journeyType && fastForward.shouldGoToSummary(journeyType, nextPageKey)) {
      await router.parseUrlAndPush(fastForward.state[journeyType].summaryPageKey as string);
      fastForward.reset(journeyType);
      return;
    }

    await router.parseUrlAndPush(nextPageKey);
  };

  return { goNext, loading: router.loading || router.parsing };
};
