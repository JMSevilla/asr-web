import React, { memo, useRef } from 'react';
import { findValueByKey } from '../../business/find-in-array';
import { useApi } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
}

const Component: React.FC<Props> = ({ pageKey, parameters }) => {
  const router = useRouter();
  const deletedOnce = useRef(false);
  const cachedAccessKey = useCachedAccessKey();
  const url = useApi(api => api.content.urlFromKey(pageKey), [pageKey]);
  const shouldDeleteOnCurrentPage = router.asPath === url.result?.data.url;

  useApi(
    async api => {
      if (deletedOnce.current || !shouldDeleteOnCurrentPage) {
        return;
      }

      deletedOnce.current = true;
      const journeyTypes = findValueByKey('journeys', parameters)?.split(';').filter(Boolean) ?? [];

      await Promise.allSettled(
        journeyTypes.map(journeyType => {
          switch (journeyType) {
            case 'retirement':
              return api.mdp.retirementJourneyDelete();
            case 'bereavement':
              return api.mdp.bereavementEnd();
            case 'transfer2':
              return api.mdp.transferJourneyDelete();
            default:
              return api.mdp.genericJourneyDelete(journeyType);
          }
        }),
      );
      await cachedAccessKey.refresh();
    },
    [shouldDeleteOnCurrentPage],
  );

  return null;
};

export const DeleteJourneysBlock = memo(Component);
