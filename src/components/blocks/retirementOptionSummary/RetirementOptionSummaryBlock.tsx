import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { DetailsContainer, ListLoader, ParsedHtml } from '../..';
import { SummaryItemValue } from '../../../api/content/types/retirement';
import { JourneyStepParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { parseRetirementSummaryItemFormatAndValue } from '../../../business/retirement';
import { useTokenEnrichedValue } from '../../../cms/inject-tokens';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { RetirementOptionSummaryItem } from './RetirementOptionSummaryItem';

interface Props {
  id: string;
  pageKey: string;
  parameters: {
    key: string;
    value: string;
  }[];
}

export const RetirementOptionSummaryBlock: React.FC<Props> = ({ id, pageKey, parameters }) => {
  const router = useRouter();
  const accessKey = useCachedAccessKey();
  const { labelByKey } = useGlobalsContext();
  const postfix = findValueByKey('postfix', parameters);
  const submitStepCb = useApiCallback((api, p: JourneyStepParams) => api.mdp.quoteSelectionJourneySubmitStep(p));
  const summary = useApi(
    async api => {
      const selectedQuote = await api.mdp.quoteSelectionJourneySelections();
      const summary = await api.content.retirementOptionSummary(
        selectedQuote.data.selectedQuoteName + (postfix || ''),
        accessKey.data?.contentAccessKey,
      );
      return { selectedQuoteName: selectedQuote.data.selectedQuoteName, ...summary };
    },
    [postfix],
  );
  const enrichedSummary = useTokenEnrichedValue(summary.result?.data);
  const description = enrichedSummary?.elements.description?.value?.elements?.content?.value;
  const { quotesOptions, refreshQuotesOptions, quotesOptionsLoading } = useRetirementContext();

  useEffect(() => {
    refreshQuotesOptions();
  }, []);

  if (summary.loading) {
    return <ListLoader id={id} loadersCount={2} data-testid="option-summary-loader" />;
  }

  return (
    <Grid id={id} container spacing={12} data-testid="option-summary">
      {description && (
        <Grid item xs={12}>
          <ParsedHtml html={description} />
        </Grid>
      )}
      {enrichedSummary?.elements.summaryBlocks.values.map((block, blockIndex) => (
        <Grid key={blockIndex} item xs={12}>
          <DetailsContainer
            title={block.elements.header.value}
            bgcolor={block.elements.highlightedBackground.value ? 'appColors.support80.transparentLight' : undefined}
          >
            {block.elements.summaryItems.values
              .map((item, itemIndex) => (
                <RetirementOptionSummaryItem
                  key={itemIndex}
                  item={item}
                  itemIndex={itemIndex}
                  blockIndex={blockIndex}
                  parseItemValue={summaryItemValue}
                  valueLoading={quotesOptionsLoading}
                  loading={router.loading || router.parsing}
                  onActionClicked={handleItemActionClick(item.elements.link.value!)}
                />
              ))
              .filter(Boolean)}
          </DetailsContainer>
        </Grid>
      ))}
    </Grid>
  );

  function handleItemActionClick(linkKey: string) {
    return async () => {
      if (summary.result) {
        await submitStepCb.execute({
          currentPageKey: pageKey,
          nextPageKey: linkKey,
          selectedQuoteName: summary.result?.selectedQuoteName,
        });
        await router.parseUrlAndPush(linkKey);
      }
    };
  }

  function summaryItemValue(item: SummaryItemValue) {
    return parseRetirementSummaryItemFormatAndValue(item, labelByKey, quotesOptions?.quotes);
  }
};
