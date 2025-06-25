import { useEffect } from 'react';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { findValueByKey } from '../../business/find-in-array';
import { parseStringToObject } from '../../business/strings';
import { usePersistentAppState } from '../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';
import { ListLoader } from '../loaders/ListLoader';

interface Props {
  id: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
}

type Values = {
  journey_type: JourneyTypeSelection;
  page_key: string;
};

export const TransferLoaderBlock: React.FC<Props> = ({ id, pageKey, parameters }) => {
  const { transfer } = usePersistentAppState();
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const successString = findValueByKey('success', parameters) ?? '';
  const errorString = findValueByKey('error', parameters) ?? '';
  const successValues = successString ? (parseStringToObject(successString) as Values) : null;
  const errorValues = errorString ? (parseStringToObject(errorString) as Values) : null;

  const startCB = useApiCallback(async api => {
    if (transfer.loader.initialized) return;

    const json = cachedAccessKey.data?.contentAccessKey
      ? JSON.parse(cachedAccessKey.data?.contentAccessKey)
      : undefined;

    if (json?.transferApplicationStatus === 'NotStartedTA' && successValues?.journey_type && successValues?.page_key) {
      transfer.loader.init();
      await api.mdp.genericJourneyStart(successValues.journey_type, {
        currentPageKey: pageKey,
        nextPageKey: successValues.page_key,
        removeOnLogin: true,
      });
      await cachedAccessKey.refresh();
      successValues?.page_key && (await router.parseUrlAndPush(successValues.page_key));
      return;
    }

    if (json?.transferApplicationStatus !== 'Undefined' && errorValues?.journey_type && errorValues?.page_key) {
      transfer.loader.init();
      await api.mdp.genericJourneyStart(errorValues.journey_type, {
        currentPageKey: pageKey,
        nextPageKey: errorValues.page_key,
        removeOnLogin: true,
      });
      await cachedAccessKey.refresh();
      errorValues?.page_key && (await router.parseUrlAndPush(errorValues.page_key));
      return;
    }
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      await cachedAccessKey.refresh();
      startCB.execute();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return <ListLoader id={id} loadersCount={1} />;
};
