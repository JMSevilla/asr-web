import { CmsPage } from '../api/content/types/page';
import { useNotificationsContext } from '../core/contexts/NotificationsContext';
import { AlertMessage, TimerMessage, TopAlertMessages } from './topAlertMessages';

interface Props {
  page: CmsPage | null;
}

export const NotificationsConsumer: React.FC<Props> = ({ page }) => {
  const { notification, loading } = useNotificationsContext();

  if (loading) {
    return null;
  }

  if (!notification) {
    return <TopAlertMessages page={page} />;
  }

  if (notification.timer) {
    return <TimerMessage type={notification.type}>{notification.children}</TimerMessage>;
  }

  return <AlertMessage type={notification.type} html={notification.message} buttons={notification.buttons} />;
};
