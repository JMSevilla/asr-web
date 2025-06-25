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

export const LumpSumPensionInfo: React.FC<Props> = ({ quotes, loading, summaryBlock }) => {
  const { labelByKey } = useGlobalsContext();

  if (loading) {
    return <TwoColumnBlockLoader />;
  }

  if (!quotes || !summaryBlock) {
    return null;
  }

  return (
    <>
      {summaryBlock.elements.header.value && (
        <Grid item xs={12} mb={6}>
          <Typography component="h2" variant="h5" fontWeight="bold">
            {summaryBlock.elements.header.value}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} sm={6} height={{ xs: 'auto', sm: '100%' }}>
        <DetailsContainer fullHeight noBorder bgcolor="appColors.support60.transparentLight">
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <Typography variant="body1">
                {summaryBlock.elements.summaryItems.values[0].elements.header.value}
              </Typography>
              {summaryBlock.elements.summaryItems.values[0].elements.description.value && (
                <Typography variant="body2">
                  {summaryBlock.elements.summaryItems.values[0].elements.description.value}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography color="primary" variant="secondLevelValue" component="span" data-testid="total-pension">
                {summaryItemValue(summaryBlock.elements.summaryItems.values[0])}
              </Typography>
            </Grid>
          </Grid>
        </DetailsContainer>
      </Grid>
      <Grid item xs={12} sm={6}>
        <DetailsContainer noBorder fullHeight bgcolor="appColors.support80.transparentLight">
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <Typography variant="body1">
                {summaryBlock.elements.summaryItems.values[1].elements.header.value}
              </Typography>
              {summaryBlock.elements.summaryItems.values[1].elements.description.value && (
                <Typography variant="body2">
                  {summaryBlock.elements.summaryItems.values[1].elements.description.value}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography color="primary" variant="secondLevelValue" component="span" data-testid="total-lump-sum">
                {summaryItemValue(summaryBlock.elements.summaryItems.values[1])}
              </Typography>
            </Grid>
          </Grid>

          {summaryBlock.elements.summaryItems.values[1].elements.explanationSummaryItems.values?.map(
            (subItem, idx) =>
              summaryItemValue(subItem) && (
                <Grid
                  key={idx}
                  item
                  xs={12}
                  container
                  columnSpacing={2}
                  alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                  flexDirection={{ xs: 'column', sm: 'row' }}
                >
                  <Grid item xs={6}>
                    <Typography variant="body1">{subItem.elements.header.value}</Typography>
                    {subItem.elements.description.value && (
                      <Typography variant="body2">{subItem.elements.header.value}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      color="primary"
                      variant="secondLevelValue"
                      component="span"
                      data-testid={`lump-sum-from-${idx === 0 ? 'DB' : 'DC'}`}
                    >
                      {summaryItemValue(subItem)}
                    </Typography>
                  </Grid>
                </Grid>
              ),
          )}
        </DetailsContainer>
      </Grid>
    </>
  );

  function summaryItemValue(item: SummaryItemValue) {
    return parseRetirementSummaryItemValue(item, labelByKey, quotes);
  }
};
