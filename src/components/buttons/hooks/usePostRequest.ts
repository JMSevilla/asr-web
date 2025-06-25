import { useEffect } from 'react';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { MessageType } from '../../topAlertMessages';

type Props = {
  url?: string;
};

/**
 * Enables execution of post request from CMS button via "postToEndpoint" property.
 * @param url Url to post to
 * @example
 * const { execute, loading } = usePostRequest({ url: postToEndpoint });
 * <Button onClick={execute} loading={loading} />
 */
export const usePostRequest = ({ url }: Props) => {
  const cachedAccessKey = useCachedAccessKey();
  const { errorByKey } = useGlobalsContext();
  const requestCb = useApiCallback(api =>
    url && cachedAccessKey.data?.contentAccessKey
      ? api.mdp.buttonCustomRequest(url, cachedAccessKey.data?.contentAccessKey)
      : Promise.reject(),
  );
  const { showNotifications, hideNotifications } = useNotificationsContext();

  useEffect(() => {
    if (!url) return;

    const errors = requestCb.error as string[] | undefined;
    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }

    return () => hideNotifications();
  }, [url, requestCb.error]);

  if (url) {
    return { execute: requestCb.execute, loading: requestCb.loading };
  }

  return undefined;
};
