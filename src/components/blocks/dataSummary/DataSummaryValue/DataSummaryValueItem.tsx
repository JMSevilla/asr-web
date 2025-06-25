import { Box, Divider, Grid, Typography } from '@mui/material';
import { ContentButtonBlock, ParsedHtml, SecondaryButton, Tooltip } from '../../..';
import { ValueFormatType } from '../../../../api/content/types/common';
import { DataSummaryItemValue } from '../../../../api/content/types/data-summary';
import { ParsedButtonProps } from '../../../../cms/parse-cms';
import { usePersistentAppState } from '../../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useRouter } from '../../../../core/router';
import { ExpandableBreakdown } from '../../../ExpandableBreakdown';
import { DataSummaryValueItemFiles } from './DataSummaryValueItemFiles';
import { DataSummaryValueItemText } from './DataSummaryValueItemText';
import { DataSummaryItemEnrichedText } from './DataSummaryItemEnrichedText';

interface Props {
  loading: boolean;
  itemIndex: number;
  blockIndex: number;
  item: DataSummaryItemValue;
  parseItemValue(item: DataSummaryItemValue): {
    format?: ValueFormatType;
    value?: string;
    isHidden?: boolean;
  };
  button?: ParsedButtonProps | null;
  pageKey: string;
  isButtonColumnHidden?: boolean;
}

export const DataSummaryValueItem: React.FC<Props> = ({
  pageKey,
  loading,
  itemIndex,
  blockIndex,
  item,
  button,
  isButtonColumnHidden,
  parseItemValue,
}) => {
  const router = useRouter();
  const itemValue = parseItemValue(item);
  const values = Array.isArray(itemValue.value) ? itemValue.value : [itemValue.value];
  const subItemsValues = item.elements.explanationSummaryItems.values?.map(parseItemValue);
  const { fastForward } = usePersistentAppState();
  const valueFontWeight = item.elements?.boldValue?.value ? 'bold' : 'normal';
  const isFileList = item.elements?.format?.value?.selection === 'File list';
  const isLabel = itemValue.format === 'Label';

  if (itemValue.isHidden) {
    return null;
  }

  return (
    <Grid
      key={itemIndex}
      item
      xs={12}
      container
      columnSpacing={11}
      data-testid={`data-summary-block-${blockIndex}-item-${itemIndex}`}
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
      <Grid item xs={12} md={isButtonColumnHidden ? 7 : 4}>
        {isFileList && !values.length ? <DataSummaryValueItemText key={0} fontWeight={valueFontWeight} value={"-"} /> : values
          .map((value, index) =>
            isFileList
              ? <DataSummaryValueItemFiles key={index} index={index} value={value} />
              : renderItemText(index, value)
          )
        }
      </Grid>
      {!isButtonColumnHidden && (
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
                onClick={handleItemActionClick(item.elements.link.value)}
                data-testid={`summary-block-${blockIndex}-item-${itemIndex}-action-btn`}
              >
                {item.elements.linkText.value}
              </SecondaryButton>
            </Box>
          )}
          {button && (
            <ContentButtonBlock
              pageKey={pageKey}
              {...button}
              onAsyncCallback={handleChangeButtonClick(button)}
              text={<Typography component="span">{button.text}</Typography>}
            />
          )}
        </Grid>
      )}
      {!!subItemsValues?.filter(v => !v.isHidden).length && (
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
                    data-testid={`data-summary-block-${blockIndex}-item-${itemIndex}-explanation-${idx}`}
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
                      textAlign={{ xs: 'left', md: 'right' }}
                    >
                      <Typography variant="secondLevelValue" component="span">
                        {subItemsValues[idx].value}
                      </Typography>
                    </Grid>
                  </Grid>
                ))
                .filter((_, idx) => !subItemsValues[idx].isHidden)}
            </Grid>
          </ExpandableBreakdown>
        </Grid>
      )}
    </Grid>
  );

  function renderItemText(index: number, value: any) {
    return isLabel ? <DataSummaryItemEnrichedText key={index} fontWeight={valueFontWeight} value={value} /> : <DataSummaryValueItemText key={index} fontWeight={valueFontWeight} value={value} />
  }

  function handleItemActionClick(linkKey: string) {
    return async () => {
      await router.parseUrlAndPush(linkKey);
    };
  }

  function handleChangeButtonClick(button: ParsedButtonProps) {
    return async () => {
      button.fastForwardComparisonPageKey &&
        button.journeyType &&
        fastForward.init({
          journeyType: button.journeyType,
          nextPageKey: button.fastForwardComparisonPageKey,
          summaryPageKey: button.fastForwardRedirectPageKey!,
        });
      button.linkKey && (await router.parseUrlAndPush(button.linkKey));
    };
  }
};
