import { parseContentAccessKey } from '../../../../business/access-key';
import { addIsoTimeToDate, getUTCDate } from '../../../../business/dates';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useGuaranteedQuoteAction: CustomActionHook = props => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const { cmsTokens } = useContentDataContext();

  const guaranteedQuoteCb = useApiCallback(async api => {
    const date = (await api.mdp.retirementDate()).data?.retirementDate;
    const parsedDate = getUTCDate(date);
    const guaranteedQuoteResponse = await api.mdp.retirementQuotesV3(parsedDate, true);
    return guaranteedQuoteResponse.data;
  });

  const parsedContentAccessKey = parseContentAccessKey(cachedAccessKey.data?.contentAccessKey);

  async function executeGuaranteedQuoteAction() {
    if (
      !cmsTokens?.selectedRetirementDate ||
      !parsedContentAccessKey?.hasProtectedQuote ||
      cachedAccessKey.data?.schemeType !== 'DB'
    ) {
      return;
    }

    const currentDate = new Date();
    const threeMonthsLater = addIsoTimeToDate(currentDate, '3M');

    const retirementDateObj = new Date(cmsTokens?.selectedRetirementDate);
    const isWithinThreeMonths = retirementDateObj >= currentDate && retirementDateObj <= threeMonthsLater;

    if (!isWithinThreeMonths) {
      return;
    }

    const result = await guaranteedQuoteCb.execute();

    if (!result.isCalculationSuccessful) {
      return;
    }

    await cachedAccessKey.refresh();

    if (props?.linkKey) {
      await router.parseUrlAndPush(props.linkKey);
    }
  }

  return {
    execute: executeGuaranteedQuoteAction,
    loading: router.loading || guaranteedQuoteCb.loading || cachedAccessKey.loading,
  };
};
