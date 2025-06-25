import { Stack } from '@mui/material';
import { useState } from 'react';
import { findValueByKey } from '../../../../business/find-in-array';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useAlerts } from '../../../../core/contexts/alerts/AlertsContext';
import { AlertsNonPriorityListItem } from './AlertsNonPriorityListItem';
import { AlertsNonPriorityListLoader } from './AlertsNonPriorityListLoader';

interface Props {
  id: string;
  parameters: { key: string; value: string }[];
}

export const AlertsNonPriorityListBlock: React.FC<Props> = ({ id, parameters }) => {
  const alerts = useAlerts();
  const { messageByKey } = useGlobalsContext();
  const [openAlertId, setOpenAlertId] = useState<number | null>(null);
  const emptyMessageKey = findValueByKey('empty_list_message_key', parameters);
  const errorMessageKey = findValueByKey('error_list_message_key', parameters);

  if (alerts.loading) {
    return <AlertsNonPriorityListLoader id={id} />;
  }

  if (alerts.error) {
    return errorMessageKey ? <>{messageByKey(errorMessageKey)}</> : null;
  }

  if (alerts.isEmpty && emptyMessageKey) {
    return <>{messageByKey(emptyMessageKey)}</>;
  }

  if (!alerts.list.nonPriority.length) {
    return null;
  }

  return (
    <Stack
      id={id}
      data-testid="alerts-non-priority-list"
      gap={{ xs: 2, md: 4 }}
      px={{ xs: 5, md: 12 }}
      py={{ xs: 6, md: 12 }}
      mx={{ xs: -5, md: 0 }}
      bgcolor="appColors.support60.transparentLight"
    >
      {alerts.list.nonPriority.map(alert => (
        <AlertsNonPriorityListItem
          key={alert.alertID}
          alert={alert}
          isOpen={openAlertId === alert.alertID}
          onToggle={handleToggleAlert(alert.alertID)}
        />
      ))}
    </Stack>
  );

  function handleToggleAlert(alertId: number) {
    return () => {
      if (openAlertId === alertId) {
        setOpenAlertId(null);
      } else {
        setOpenAlertId(alertId);
      }
    };
  }
};
