import { useEffect } from 'react';
import { SwitchStepParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { ComponentLoader } from '../../loaders/ComponentLoader';

interface Props {
  parameters: { key: string; value: string }[];
  pageKey: string;
}

export const JourneySwitchBlock: React.FC<Props> = ({ parameters, pageKey }) => {
  const router = useRouter();
  const defaultPageKey = findValueByKey('default_next_page', parameters)!;
  const raType = parameters.find(param => param.key.includes('ra_type'));
  const accessKey = useCachedAccessKey();
  const updateStepCb = useApiCallback((api, args: SwitchStepParams) => api.mdp.updateSwitchStep(args));
  const initialApiData = useApiCallback(api =>
    Promise.all([
      api.mdp.retirementApplication(accessKey.data!.contentAccessKey),
      api.content.urlFromKey(raType?.value ?? ''),
      api.content.urlFromKey(defaultPageKey),
    ]),
  );

  useEffect(() => {
    async function setStep() {
      const details = await initialApiData.execute();
      const [retirementApplication, successUrl, defaultUrl] = details ?? [null, null, null];
      const label = retirementApplication?.data?.label;

      const isSuccess = label && validateType(label.toLocaleLowerCase()) && successUrl?.data.url;
      const nextPageKey = isSuccess ? raType?.value : defaultPageKey;
      const url = isSuccess ? successUrl.data.url : defaultUrl?.data.url;

      if (nextPageKey && pageKey) {
        await updateStepCb.execute({
          switchPageKey: pageKey,
          nextPageKey,
        });
        url && router.push(url);
      }
    }
    setStep();
  }, []); // TODO: Remove this unnecessary effect https://metasite.atlassian.net/browse/WTW-1936

  return <ComponentLoader />;

  function validateType(type: string) {
    const types = raType?.key?.toLocaleLowerCase().split('ra_type(')?.[1]?.split(')')?.[0]?.split(',') ?? [];

    return types.includes(type);
  }
};
