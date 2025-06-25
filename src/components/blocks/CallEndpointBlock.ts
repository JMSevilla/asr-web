import React, { memo, useEffect, useMemo } from 'react';
import { findValueByKey } from '../../business/find-in-array';
import { formatUrl } from '../../business/url';
import { useApiCallback } from '../../core/hooks/useApi';

interface Props {
  id?: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
}

const Component: React.FC<Props> = ({ pageKey, parameters }) => {
  const url = findValueByKey('url', parameters);
  const { apiUrl, relativeUrl } = useMemo(() => {
    if (!url) return { apiUrl: '', relativeUrl: '' };
    const urlObject = formatUrl(url);
    const pathnameSegments = urlObject.pathname.split('/').filter(Boolean);
    const apiUrl = pathnameSegments[0];
    const relativeUrl = `/${pathnameSegments.join('/')}`;
    return { apiUrl, relativeUrl };
  }, [url]);

  const urlCb = useApiCallback(api => api.mdp.getByUrl(relativeUrl));

  useEffect(() => {
    urlCb.execute();
  }, []);

  return null;
};

export const CallEndpointBlock = memo(Component);
