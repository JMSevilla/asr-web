import { Grid, Typography } from '@mui/material';
import { DetailsContainer, TwoColumnBlockLoader } from '../..';
import { SummaryBlocksValue, SummaryItemValue } from '../../../api/content/types/retirement';
import { RetirementQuotesV3Option } from '../../../api/mdp/types';
import { parseRetirementSummaryItemValue } from '../../../business/retirement';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';

interface Props {
  loading: boolean;
  summaryBlock?: SummaryBlocksValue;
  quotes?: RetirementQuotesV3Option;
}

export const LumpSumRangeInfo: React.FC<Props> = ({ quotes, loading, summaryBlock }) => {
  const { labelByKey } = useGlobalsContext();

  if (loading) {
    return <TwoColumnBlockLoader />;
  }

  if (!quotes || !summaryBlock) {
    return null;
  }

  return (
    <DetailsContainer bgcolor="appColors.support80.transparentLight" title={summaryBlock.elements.header.value}>
      {summaryBlock.elements.summaryItems.values.map((item, idx) => (
        <Grid item xs={12} columnSpacing={12} container key={idx}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">{item.elements.header.value}</Typography>
            {item.elements.description.value && (
              <Typography variant="body2">{item.elements.description.value}</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="primary" variant="secondLevelValue" component="span" data-testid="max-lump-sum">
              {summaryItemValue(item)}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </DetailsContainer>
  );

  function summaryItemValue(item: SummaryItemValue) {
    return parseRetirementSummaryItemValue(item, labelByKey, quotes);
  }
};
