import { Box, Divider, Grid, Typography } from '@mui/material';
import { AnimatedBoxSkeleton, ParsedHtml, SecondaryButton, Tooltip } from '../..';
import { ValueFormatType } from '../../../api/content/types/common';
import { SummaryItemValue } from '../../../api/content/types/retirement';
import { ExpandableBreakdown } from '../../ExpandableBreakdown';

interface Props {
  loading: boolean;
  valueLoading: boolean;
  itemIndex: number;
  blockIndex: number;
  item: SummaryItemValue;
  onActionClicked(): void;
  parseItemValue(item: SummaryItemValue): { format: ValueFormatType | undefined; value: string | undefined };
}

export const RetirementOptionSummaryItem: React.FC<Props> = ({
  loading,
  valueLoading,
  itemIndex,
  blockIndex,
  item,
  onActionClicked,
  parseItemValue,
}) => {
  const itemValue = parseItemValue(item);
  const subItemsValues = item.elements.explanationSummaryItems.values?.map(parseItemValue);

  if (!itemValue.value) {
    return null;
  }

  return (
    <Grid
      key={itemIndex}
      item
      xs={12}
      container
      columnSpacing={11}
      data-testid={`summary-block-${blockIndex}-item-${itemIndex}`}
    >
      {item.elements.divider.value && (
        <Grid item xs={12} mb={8}>
          <Divider />
        </Grid>
      )}
      <Grid item xs={12} md={5} display="flex" flexDirection="column">
        <Typography variant="body1" component="h3" fontWeight="bold" display="flex">
          {item.elements.header.value}
          {item.elements.tooltip.value && <Tooltip html={item.elements.tooltip.value.elements.contentText.value} />}
        </Typography>
        {item.elements.description.value && (
          <Typography variant="body1" component="span">
            <ParsedHtml html={item.elements.description.value} />
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={4} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} display="inline-flex">
        {valueLoading ? (
          <AnimatedBoxSkeleton
            width={100}
            height={24}
            data-testid={`summary-block-${blockIndex}-item-${itemIndex}-loader`}
          />
        ) : (
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            textAlign={{ xs: 'left', md: 'right' }}
          >
            {itemValue.value}
          </Typography>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        display="flex"
        mt={{ xs: 2, md: 0 }}
        justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
      >
        {item.elements.linkText.value && item.elements.link.value && (
          <Box>
            <SecondaryButton
              loading={loading}
              onClick={onActionClicked}
              data-testid={`summary-block-${blockIndex}-item-${itemIndex}-action-btn`}
            >
              {item.elements.linkText.value}
            </SecondaryButton>
          </Box>
        )}
      </Grid>
      {!!subItemsValues?.filter(v => !!v.value).length && (
        <Grid item xs={12}>
          <ExpandableBreakdown id={`block-${blockIndex}-item-${itemIndex}`}>
            <Grid container width="100%" spacing={8} mb={8}>
              {item.elements.explanationSummaryItems.values
                ?.map((explanationItem, idx) => (
                  <Grid
                    key={idx}
                    item
                    xs={12}
                    container
                    columnSpacing={19}
                    data-testid={`summary-block-${blockIndex}-item-${itemIndex}-explanation-${idx}`}
                  >
                    {explanationItem.elements.divider.value && (
                      <Grid item xs={12} mb={8}>
                        <Divider />
                      </Grid>
                    )}
                    <Grid item xs={5} display="flex" flexDirection="column">
                      <Typography variant="body1" lineHeight={theme => theme.typography.h5.lineHeight} component="h4">
                        {explanationItem.elements.header.value}
                      </Typography>
                      {explanationItem.elements.description.value && (
                        <Typography variant="body2" lineHeight={theme => theme.typography.h5.lineHeight}>
                          {explanationItem.elements.description.value}
                        </Typography>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={7}
                      md={4.5}
                      justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                      display="inline-flex"
                    >
                      <Typography variant="secondLevelValue" component="span" textAlign={{ xs: 'left', md: 'right' }}>
                        {subItemsValues[idx].value}
                      </Typography>
                    </Grid>
                  </Grid>
                ))
                .filter((_, idx) => !!subItemsValues[idx].value)}
            </Grid>
          </ExpandableBreakdown>
        </Grid>
      )}
    </Grid>
  );
};
