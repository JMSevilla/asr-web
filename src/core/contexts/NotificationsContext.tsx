import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CmsButton } from '../../cms/types';
import { MessageType } from '../../components';
import { useScroll } from '../hooks/useScroll';
import { useRouter } from '../router';
import { usePageLoaderContext } from './PageLoaderContext';
import { useRetirementContext } from './retirement/RetirementContext';

interface NotificationsContextValue {
  notification?: Notification;
  loading?: boolean;
  showNotifications: (notifications: Notification[]) => void;
  hideNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  showNotifications: () => null,
  hideNotifications: () => null,
});

interface Notification {
  timer?: boolean;
  type: MessageType;
  message?: string;
  buttons?: CmsButton[];
  children?: JSX.Element;
}

export const useNotificationsContext = () => useContext(NotificationsContext);

export const NotificationsContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const scroll = useScroll();
  const { isLoading, isCalculationsLoaded } = usePageLoaderContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { quotesOptionsLoading, retirementCalculationLoading } = useRetirementContext();
  const isDataLoading =
    isLoading ||
    (router.asPath === router.staticRoutes.hub &&
      (quotesOptionsLoading || retirementCalculationLoading) &&
      !isCalculationsLoaded);

  const hideNotifications = useCallback(() => setNotifications([]), []);

  const showNotifications = useCallback(
    (notifications: Notification[]) => {
      setNotifications(notifications);
      scroll.scrollTop();
    },
    [scroll],
  );

  useEffect(() => {
    router.events.on('routeChangeComplete', hideNotifications);
    router.events.on('routeChangeError', hideNotifications);
    return () => {
      router.events.off('routeChangeComplete', hideNotifications);
      router.events.off('routeChangeError', hideNotifications);
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={useMemo(
        () => ({
          notification: notifications?.[0],
          loading: isDataLoading,
          showNotifications,
          hideNotifications,
        }),
        [notifications, isDataLoading, showNotifications, hideNotifications],
      )}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const DEFAULT_ERROR_NOTIFICATION = 'something_went_wrong';
