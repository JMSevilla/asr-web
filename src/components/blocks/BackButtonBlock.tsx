import { Box } from '@mui/material';
import qs from 'query-string';
import { memo } from 'react';
import { BackButton } from '..';
import { JourneyTypeSelection, JourneyTypes } from '../../api/content/types/page';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../core/contexts/JourneyIndicatorContext';
import { useApi } from '../../core/hooks/useApi';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
  pageKey: string;
  backPageKey?: string;
  isInStickOutPage?: boolean;
  journeyType?: JourneyTypeSelection;
}

export const BackButtonBlock: React.FC<Props> = memo(({ id, pageKey, journeyType, backPageKey, isInStickOutPage }) => {
  const { customHeader } = useJourneyIndicatorContext();
  const { labelByKey } = useGlobalsContext();
  const router = useRouter();
  const isNativeBack = backPageKey === 'native_browser_back';
  const journeyBackPageKeyCb = useApi(
    api => {
      if (journeyType === JourneyTypes.RETIREMENT) return api.mdp.journeyPreviousKey(pageKey);
      if (journeyType === JourneyTypes.BEREAVEMENT) return api.mdp.bereavementJourneyPreviousStep(pageKey);
      if (journeyType === JourneyTypes.QUOTES_SELECTION) return api.mdp.quoteSelectionJourneyPreviousStep(pageKey);
      if (journeyType === JourneyTypes.TRANSFER2) return api.mdp.transferJourneyPreviousStep(pageKey);
      if (!!journeyType) return api.mdp.genericJourneyPreviousStep(journeyType, pageKey);
      return Promise.reject();
    },
    [journeyType, pageKey],
  );
  const previousPageKey = journeyBackPageKeyCb.result?.data.previousPageKey;
  const backUrl = useApi(
    async api => {
      const backKey = backPageKey || previousPageKey;
      if (!backKey || isNativeBack) return Promise.reject();
      const result = await api.content.urlFromKey(backKey);
      return { ...result, data: qs.stringifyUrl({ url: result.data.url, query: router.parsedQuery }) };
    },
    [previousPageKey, backPageKey],
  );

  return (
    <Box id={id} display="flex" alignItems="center" data-testid="back-button" mt={-6}>
      <BackButton
        loading={router.loading || journeyBackPageKeyCb.loading || backUrl.loading}
        isNativeBack={isNativeBack}
        isInStickOutPage={isInStickOutPage}
        label={labelByKey('journey_back')}
        onClick={customHeader?.action ?? undefined}
        link={parsedBackUrl()}
      />
    </Box>
  );

  function parsedBackUrl() {
    if (isNativeBack) return null;
    const errors = Array.isArray(journeyBackPageKeyCb.error) ? (journeyBackPageKeyCb.error as unknown as string[]) : [];
    if (errors?.find(error => error === 'not_found')) return null;
    if (errors?.find(error => error === 'previous_page_key_not_found')) return router.staticRoutes.hub;
    return backUrl.result?.data;
  }
});
