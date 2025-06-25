import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { MessageType, PrimaryButton, Tooltip } from '../..';
import { findValueByKey } from '../../../business/find-in-array';
import { findRetirementOptionValueByKey } from '../../../business/retirement';
import { useTokenEnrichedValue } from '../../../cms/inject-tokens';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { LumpSumPensionInfo } from './LumpSumPensionInfo';
import { LumpSumRangeInfo } from './LumpSumRangeInfo';
import { RetirementLumpSumForm } from './RetirementLumpSumForm';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
}

export const RetirementLumpSumBlock: React.FC<Props> = ({ id, parameters }) => {
  const router = useRouter();
  const accessKey = useCachedAccessKey();
  const nextPageKey = findValueByKey('success_next_page', parameters);
  const { quotesOptions, quotesOptionsLoading, refreshQuotesOptions } = useRetirementContext();
  const { labelByKey, tooltipByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const recalculateLumpSumCb = useApiCallback((api, lumpSum: number) => api.mdp.retirementRecalculateLumpSum(lumpSum));
  const submitRecalculatedLumpSumCb = useApiCallback((api, lumpSum: number) =>
    api.mdp.retirementSubmitRecalculatedLumpSum(lumpSum),
  );
  const summary = useApi(async api => {
    const result = await api.mdp.quoteSelectionJourneySelections();
    return await api.content.retirementOptionSummary(
      `${result.data.selectedQuoteName}.lumpsum`,
      accessKey.data?.contentAccessKey,
    );
  });
  const enrichedSummary = useTokenEnrichedValue(summary.result?.data);
  const [lumpSumApplicable, setLumpSumApplicable] = useState(false);

  useEffect(() => {
    const errors = recalculateLumpSumCb.error as string[] | undefined;
    errors && showNotifications(errors.map(error => ({ type: MessageType.Problem, message: errorByKey(error) })));
    return () => hideNotifications();
  }, [showNotifications, errorByKey, hideNotifications, recalculateLumpSumCb.error]);

  const optionNotFoundTooltip = tooltipByKey('view_option_not_found');

  return (
    <Grid id={id} container spacing={18} data-testid="quote-lump-sum-details-block">
      <Grid item xs={12}>
        <LumpSumRangeInfo
          quotes={recalculateLumpSumCb.result?.data.quotes ?? quotesOptions?.quotes}
          loading={recalculateLumpSumCb.loading || quotesOptionsLoading || summary.loading}
          summaryBlock={enrichedSummary?.elements.summaryBlocks.values[0]}
        />
      </Grid>

      <Grid item xs={12} container alignItems="flex-end" spacing={4}>
        <RetirementLumpSumForm
          quotes={recalculateLumpSumCb.result?.data.quotes ?? quotesOptions?.quotes}
          loading={recalculateLumpSumCb.loading || quotesOptionsLoading || summary.loading}
          summaryBlock={enrichedSummary?.elements.summaryBlocks.values[1]}
          onSubmit={recalculateLumpSumCb.execute}
          onNewLumpSumRecalculation={hideNotifications}
          onLumpSumApplicabilityChange={setLumpSumApplicable}
          isCalculationSuccessful={recalculateLumpSumCb.result?.data.isCalculationSuccessful}
          onCalculatedValueReset={() =>
            showNotifications([{ type: MessageType.Problem, message: errorByKey('unsuccessful_calculation_error') }])
          }
        />
      </Grid>

      <Grid item xs={12} container>
        <LumpSumPensionInfo
          quotes={recalculateLumpSumCb.result?.data.quotes ?? quotesOptions?.quotes}
          loading={recalculateLumpSumCb.loading || quotesOptionsLoading || summary.loading}
          summaryBlock={enrichedSummary?.elements.summaryBlocks.values[2]}
        />
      </Grid>

      {optionNotFoundTooltip && (
        <Grid item xs={12}>
          <Tooltip header={optionNotFoundTooltip.header} html={optionNotFoundTooltip.html} underlinedText>
            {optionNotFoundTooltip.text}
          </Tooltip>
        </Grid>
      )}

      <Grid item xs={12} display="flex" gap={4}>
        <PrimaryButton data-testid="apply-button" onClick={submitRecalculatedLumpSum} disabled={!lumpSumApplicable}>
          {labelByKey('use_changed_lump_sum')}
        </PrimaryButton>
      </Grid>
    </Grid>
  );

  async function submitRecalculatedLumpSum() {
    const lumpSum =
      recalculateLumpSumCb.currentParams?.[0] ??
      findRetirementOptionValueByKey(
        quotesOptions?.quotes ?? {},
        ...(enrichedSummary?.elements.summaryBlocks.values[1].elements.summaryItems.values[0].elements.value.value?.split(
          '.',
        ) ?? []),
      );
    if (!nextPageKey || !lumpSum) {
      return;
    }
    try {
      await submitRecalculatedLumpSumCb.execute(+lumpSum);
      await refreshQuotesOptions();
      await router.parseUrlAndPush(nextPageKey);
    } catch {}
  }
};
