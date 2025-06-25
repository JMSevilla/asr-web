import { Box, Grid } from '@mui/material';
import { DetailsContainer, ListLoader, TextBlock } from '../..';
import { DataSummaryBlocksValue, DataSummaryItemValue } from '../../../api/content/types/data-summary';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { parseDataSummaryItemFormatAndValue, parseSummaryBlocksVisibility } from '../../../business/data-summary';
import { parseBackgroundColor, parseButtonProps } from '../../../cms/parse-cms';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useTenantContext } from '../../../core/contexts/TenantContext';
import { useApi } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';
import { DataSummaryValue } from './DataSummaryValue/DataSummaryValue';

interface Props {
  id: string;
  sourceUrl?: string;
  summaryBlocks?: DataSummaryBlocksValue[];
  journeyType?: JourneyTypeSelection;
  pageKey: string;
}

export const DataSummaryBlock: React.FC<Props> = ({ id, sourceUrl, summaryBlocks, journeyType, pageKey }) => {
  const router = useRouter();
  const { labelByKey } = useGlobalsContext();
  const { tenant } = useTenantContext();
  const summary = useApi<
    { data: Record<string, string>; blocks?: DataSummaryBlocksValue[] },
    [sourceUrl: string | undefined]
  >(
    async api => {
      if (!sourceUrl) {
        return { data: {}, blocks: parseSummaryBlocksVisibility(summaryBlocks) };
      }

      const dataUrls = sourceUrl
        .split(';')
        .map(url => api.mdp.dataSummary<Record<string, string>>(url, { tenantUrl: tenant.tenantUrl.value }));
      const results = await Promise.all(dataUrls);
      const data = results.reduce((acc, response) => ({ ...acc, ...response.data }), {}) || {};
      return { data, blocks: parseSummaryBlocksVisibility(summaryBlocks, data) };
    },
    [sourceUrl],
  );

  if (summary.loading) {
    return <ListLoader id={id} loadersCount={2} data-testid="data-summary-loader" />;
  }

  if (!summary.result?.blocks?.length) {
    return null;
  }

  return (
    <Grid id={id} container spacing={12} data-testid="data-summary">
      {summary.result.blocks.map((block, blockIndex) => (
        <Grid key={blockIndex} item xs={12}>
          <DetailsContainer
            title={block.elements.header.value}
            bgcolor={block.elements.highlightedBackground.value ? 'appColors.support80.transparentLight' : undefined}
          >
            {block.elements.summaryItems?.values
              .map((item, itemIndex) => (
                <DataSummaryValue
                  key={itemIndex}
                  item={item}
                  pageKey={pageKey}
                  itemIndex={itemIndex}
                  blockIndex={blockIndex}
                  parseItemValue={summaryItemValue}
                  loading={router.loading || router.parsing}
                  isButtonColumnHidden={block.elements?.hideButtonColumn?.value}
                  button={
                    item.elements?.callToAction?.value?.elements
                      ? parseButtonProps(item.elements?.callToAction?.value?.elements, journeyType)
                      : null
                  }
                />
              ))
              .filter(Boolean)}
            {block.elements?.bottomInformation?.values?.map((textBlock, blockIndex) => (
              <Box key={blockIndex} mt={6}>
                <TextBlock
                  id={textBlock.elements?.contentBlockKey?.value}
                  header={textBlock.elements?.header?.value}
                  blockHeader={textBlock.elements?.blockHeader}
                  subHeader={textBlock.elements?.subHeader?.value}
                  html={textBlock.elements?.content?.value}
                  sourceUrl={textBlock.elements?.dataSourceUrl?.value}
                  backgroundColor={parseBackgroundColor(tenant, textBlock.elements?.themeColorForBackround)}
                  showInAccordion={textBlock.elements?.showInAccordion?.value}
                />
              </Box>
            ))}
          </DetailsContainer>
        </Grid>
      ))}
    </Grid>
  );

  function summaryItemValue(item: DataSummaryItemValue) {
    return parseDataSummaryItemFormatAndValue(item, labelByKey, summary.result?.data);
  }
};
