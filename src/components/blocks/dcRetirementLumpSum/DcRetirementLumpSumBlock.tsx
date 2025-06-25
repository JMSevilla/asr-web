import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { MessageType, Tooltip } from '../..';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { findValueByKey } from '../../../business/find-in-array';
import { findRetirementOptionValueByKey } from '../../../business/retirement';
import { useTokenEnrichedValue } from '../../../cms/inject-tokens';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { logger } from '../../../core/datadog-logs';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { useRouter } from '../../../core/router';
import { DcRetirementLumpSumForm } from './DcRetirementLumpSumForm';
import { LumpSumInfo } from './LumpSumInfo';
interface Props {
  id: string;
  pageKey: string;
  journeyType: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}

const PREFIX = 'dc_lump_sum';

export const DcRetirementLumpSumBlock: React.FC<Props> = ({ id, parameters, journeyType, pageKey }) => {
  const router = useRouter();
  const accessKey = useCachedAccessKey();
  const nextPageKey = findValueByKey('success_next_page', parameters);
  const { quotesOptions, quotesOptionsLoading, refreshQuotesOptions } = useRetirementContext();
  const { tooltipByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const genericData = useJourneyStepData<{ taxFreeLumpSum: number }>({
    pageKey,
    formKey: id,
    journeyType,
    personType: 'dc_lump_sum_recalculate',
  });
  const recalculateLumpSumCb = useApiCallback((api, lumpSum: number) => api.mdp.retirementRecalculateLumpSum(lumpSum));
  const submitRecalculatedLumpSumCb = useApiCallback((api, lumpSum: number) =>
    api.mdp.retirementSubmitRecalculatedLumpSum(lumpSum),
  );
  const summary = useApi(async api => {
    const result = await api.mdp.quoteSelectionJourneySelections();
    await refreshQuotesOptions();
    return await api.content.retirementOptionSummary(
      `${result.data?.selectedQuoteName}.lumpsum`,
      accessKey.data?.contentAccessKey,
    );
  });
  const optionNotFoundTooltip = tooltipByKey(`${PREFIX}_view_option_not_found`);
  const enrichedSummary = useTokenEnrichedValue(summary.result?.data);
  const [lumpSumApplicable, setLumpSumApplicable] = useState(false);
  const lumpSum =
    recalculateLumpSumCb.currentParams?.[0] ??
    findRetirementOptionValueByKey(
      quotesOptions?.quotes ?? {},
      ...(enrichedSummary?.elements.summaryBlocks.values[1].elements.summaryItems.values[0].elements.value.value?.split(
        '.',
      ) ?? []),
    );

  useFormSubmissionBindingHooks({
    key: id,
    isValid: lumpSumApplicable,
    cb: submitRecalculatedLumpSum,
    initDependencies: [lumpSum],
  });

  useEffect(() => {
    const errors = recalculateLumpSumCb.error as string[] | undefined;
    if (!errors?.length) {
      hideNotifications();
    }
    errors && showNotifications(errors.map(error => ({ type: MessageType.Problem, message: errorByKey(error) })));
    return () => hideNotifications();
  }, [showNotifications, errorByKey, hideNotifications, recalculateLumpSumCb.error]);

  return (
    <Stack id={id} spacing={18} data-testid="quote-lump-sum-details-block">
      <LumpSumInfo
        quotes={recalculateLumpSumCb.result?.data.quotes ?? quotesOptions?.quotes}
        loading={recalculateLumpSumCb.loading || quotesOptionsLoading || summary.loading}
        summaryBlock={enrichedSummary?.elements.summaryBlocks.values[0]}
      />
      <DcRetirementLumpSumForm
        prefix={PREFIX}
        quotes={recalculateLumpSumCb.result?.data.quotes ?? quotesOptions?.quotes}
        loading={recalculateLumpSumCb.loading || quotesOptionsLoading || summary.loading}
        summaryBlock={enrichedSummary?.elements.summaryBlocks.values[1]}
        onSubmit={handleRecalculate}
        onNewLumpSumRecalculation={hideNotifications}
        onLumpSumApplicabilityChange={setLumpSumApplicable}
        isCalculationSuccessful={recalculateLumpSumCb.result?.data.isCalculationSuccessful}
        onCalculatedValueReset={() =>
          showNotifications([
            { type: MessageType.Problem, message: errorByKey(`${PREFIX}_unsuccessful_calculation_error`) },
          ])
        }
      />
      <LumpSumInfo
        quotes={recalculateLumpSumCb.result?.data.quotes ?? quotesOptions?.quotes}
        loading={recalculateLumpSumCb.loading || quotesOptionsLoading || summary.loading}
        summaryBlock={enrichedSummary?.elements.summaryBlocks.values[2]}
      />
      {optionNotFoundTooltip && (
        <Tooltip header={optionNotFoundTooltip.header} html={optionNotFoundTooltip.html} underlinedText>
          {optionNotFoundTooltip.text}
        </Tooltip>
      )}
    </Stack>
  );

  async function handleRecalculate(taxFreeLumpSum: number) {
    await recalculateLumpSumCb.execute(taxFreeLumpSum);
    await genericData.save({ taxFreeLumpSum });
  }

  async function submitRecalculatedLumpSum() {
    if (!nextPageKey || !lumpSum) {
      return;
    }
    try {
      await submitRecalculatedLumpSumCb.execute(+lumpSum);
      await accessKey.refresh();
      await refreshQuotesOptions();
      await router.parseUrlAndPush(nextPageKey);
    } catch (error) {
      logger.error('Failed to submit recalculated lump sum value');
    }
  }
};
