import { Stack } from '@mui/material';
import { useState } from 'react';
import { findRetirementOptionValueByKey } from '../../../business/retirement';
import { useTokenEnrichedValue } from '../../../cms/inject-tokens';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { DCRetirementOptionC2SLumpSumForm } from './DCRetirementOptionC2SLumpSumForm';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { LumpSumInfo } from '../dcRetirementLumpSum/LumpSumInfo';

interface Props {
  id: string;
  parameters: { key: string; value: string }[];
  pageKey?: string;
  journeyType?: JourneyTypeSelection;
}

export const DCRetirementOptionC2SLumpSumBlock: React.FC<Props> = ({ id, parameters, pageKey, journeyType }) => {
  const accessKey = useCachedAccessKey();
  const { quotesOptions, quotesOptionsLoading, refreshQuotesOptions } = useRetirementContext();
  const genericData = useJourneyStepData<{ taxFreeLumpSum: number }>({
    pageKey: pageKey || '',
    formKey: id,
    journeyType: journeyType || 'retirement',
    personType: 'lump_sum_recalculate',
  });
  const summary = useApi(async api => {
    const result = await api.mdp.quoteSelectionJourneySelections();
    await refreshQuotesOptions();
    return await api.content.retirementOptionSummary(
      `${result.data?.selectedQuoteName}.lumpsum`,
      accessKey.data?.contentAccessKey,
    );
  });
  
  const enrichedSummary = useTokenEnrichedValue(summary.result?.data);

  const [lumpSumApplicable, setLumpSumApplicable] = useState(false);
  const [requestedLumpSumValue, setRequestedLumpSumValue] = useState(
    genericData.values?.taxFreeLumpSum || 0
  );

  useFormSubmissionBindingHooks({
    key: id,
    isValid: lumpSumApplicable,
    cb: () => handleSubmit(requestedLumpSumValue),
    initDependencies: [requestedLumpSumValue],
  });

  return (
    <Stack id={id} spacing={18} data-testid="quote-lump-sum-details-block">
      <LumpSumInfo
        quotes={quotesOptions?.quotes}
        loading={quotesOptionsLoading || summary.loading}
        summaryBlock={enrichedSummary?.elements.summaryBlocks.values[0]}
      />
      <DCRetirementOptionC2SLumpSumForm
        quotes={quotesOptions?.quotes}
        loading={quotesOptionsLoading || summary.loading}
        summaryBlock={enrichedSummary?.elements.summaryBlocks.values[1]}
        onLumpSumApplicabilityChange={setLumpSumApplicable}
        onRequestedLumpSumChange={setRequestedLumpSumValue}
        initialValue={genericData.values?.taxFreeLumpSum}
      />
    </Stack>
  );

  async function handleSubmit(taxFreeLumpSum: number) {
    await genericData.save({ taxFreeLumpSum });
  }
}; 


