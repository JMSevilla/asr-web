import React from 'react';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';
import { JourneyEnding } from './JourneyEnding';

interface Props {
  id?: string;
}

export const JourneyEndingBlock: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { clearCmsTokens } = useContentDataContext();
  const completeCb = useApiCallback(async api => {
    const result = await api.mdp.retirementJourneyEnd();
    clearCmsTokens();
    return result;
  });

  return (
    <JourneyEnding id={id} onComplete={onComplete} loading={completeCb.loading || router.loading || router.parsing} />
  );

  async function onComplete() {
    const result = await completeCb.execute();
    await router.parseUrlAndPush(result.data.nextPageKey);
  }
};
