import { Stack } from '@mui/material';
import { findValueByKey } from '../../../../business/find-in-array';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useAlerts } from '../../../../core/contexts/alerts/AlertsContext';
import { Message } from '../../messages';
import { AlertsPriorityListLoader } from './AlertsPriorityListLoader';

interface Props {
  id: string;
  parameters: { key: string; value: string }[];
}

export const AlertsPriorityListBlock: React.FC<Props> = ({ id, parameters }) => {
  const alerts = useAlerts();
  const { messageByKey } = useGlobalsContext();
  const emptyMessageKey = findValueByKey('empty_list_message_key', parameters);
  const errorMessageKey = findValueByKey('error_list_message_key', parameters);

  if (alerts.loading) {
    return <AlertsPriorityListLoader id={id} />;
  }

  if (alerts.error) {
    return errorMessageKey ? <>{messageByKey(errorMessageKey)}</> : null;
  }

  if (alerts.isEmpty && emptyMessageKey) {
    return <>{messageByKey(emptyMessageKey)}</>;
  }

  if (!alerts.list.priority.length) {
    return null;
  }

  return (
    <Stack id={id} data-testid="alerts-priority-list" gap={6}>
      {alerts.list.priority.map(alert => (
        <Message key={alert.alertID} type={alert.type} html={alert.messageText} section />
      ))}
    </Stack>
  );
};
