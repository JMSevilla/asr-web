import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CmsPage } from '../../../api/content/types/page';
import { useApiCallback } from '../../hooks/useApi';
import { useFormSubmissionBindingHooks } from '../../hooks/useFormSubmissionBindingHooks';
import { areAlertsListsEmpty, parseAlerts } from './alerts-parser';
import { AlertsLists, IncludedAlertsBlocks } from './types';

interface Props {
  page: CmsPage | null;
}

interface AlertsState {
  list: AlertsLists;
  loading: boolean;
  error: boolean;
  isEmpty: boolean;
}

const context = createContext<AlertsState>({
  list: { priority: [], nonPriority: [] },
  loading: true,
  error: false,
  isEmpty: false,
});

export const AlertsProvider: React.FC<React.PropsWithChildren<Props>> = ({ children, page }) => {
  const alertsCb = useApiCallback(async api => {
    const alerts = await api.mdp.alerts();
    return parseAlerts(alerts.data.alerts);
  });
  const [blocksInPage, setBlocksInPage] = useState<IncludedAlertsBlocks>({ priority: false, nonPriority: false });
  const notInitiated = alertsCb.status === 'not-requested';

  useFormSubmissionBindingHooks({
    key: 'alerts',
    isValid: !alertsCb.loading,
    cb: () => Promise.resolve({}),
    initDependencies: [alertsCb.loading],
  });

  useEffect(() => {
    if (!page || !notInitiated) {
      return;
    }

    const stringifiedPage = JSON.stringify(page);
    const priorityBlockIncluded = stringifiedPage.includes('alerts_priority_list');
    const nonPriorityBlockIncluded = stringifiedPage.includes('alerts_nonpriority_list');
    if (priorityBlockIncluded || nonPriorityBlockIncluded) {
      setBlocksInPage({ priority: priorityBlockIncluded, nonPriority: nonPriorityBlockIncluded });
      alertsCb.execute();
    }
  }, [notInitiated, page]);

  return (
    <context.Provider
      value={useMemo(
        () => ({
          list: alertsCb.result ?? { priority: [], nonPriority: [] },
          loading: alertsCb.loading || notInitiated,
          error: !!alertsCb.error,
          isEmpty: areAlertsListsEmpty(alertsCb.result, blocksInPage),
        }),
        [alertsCb.result, alertsCb.loading, alertsCb.error, notInitiated, blocksInPage],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useAlerts = () => {
  if (!context) {
    throw new Error('AlertsProvider should be used');
  }
  return useContext(context);
};
