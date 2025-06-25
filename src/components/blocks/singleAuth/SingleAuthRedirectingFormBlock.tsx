import { useEffect } from 'react';
import { findValueByKey } from '../../../business/find-in-array';
import { isValidUrl } from '../../../business/url';
import { useTokenEnrichedValue } from '../../../cms/inject-tokens';
import { useRouter } from '../../../core/router';

interface Props {
  id: string;
  parameters: { key: string; value: string }[];
}

export const SingleAuthRedirectingFormBlock: React.FC<Props> = ({ id, parameters }) => {
  const { parseUrlAndPush, push } = useRouter();
  const nextPage = findValueByKey('success_next_page', parameters);
  const enrichedNextPage = useTokenEnrichedValue(nextPage);

  useEffect(() => {
    if (!enrichedNextPage) return;

    const redirect = async () => {
      if (isValidUrl(enrichedNextPage)) {
        await push(enrichedNextPage);
      } else {
        await parseUrlAndPush(enrichedNextPage);
      }
    };

    redirect();
  }, []);

  return null;
};
