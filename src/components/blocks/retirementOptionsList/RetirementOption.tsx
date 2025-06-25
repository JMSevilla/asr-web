import { Add, ChevronRight } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { ContentButtonBlock, Tooltip } from '../..';
import { RetirementOptionsListItem, SummaryItemValue } from '../../../api/content/types/retirement';
import { currencyValue } from '../../../business/currency';
import { retirementValuePathToKeys } from '../../../business/retirement';
import { parseButtonProps } from '../../../cms/parse-cms';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useResolution } from '../../../core/hooks/useResolution';
import { ParsedHtml } from '../../ParsedHtml';
import { PrimaryButton } from '../../buttons';

interface Props {
  index: number;
  pageKey?: string;
  loading?: boolean;
  option: RetirementOptionsListItem;
  onItemActionClicked: AsyncFunction<unknown, void>;
  findSummaryItemValue(keys: string[]): string | number | null;
  quoteExpiryDate?: string | null;
  customProtectedQuoteHtmlKey?: string | null;
  hideADVProtectedQuotesBadge?: boolean;
}

export const RetirementOption: React.FC<Props> = ({
  index,
  option,
  pageKey,
  loading,
  onItemActionClicked,
  findSummaryItemValue,
  quoteExpiryDate,
  customProtectedQuoteHtmlKey,
  hideADVProtectedQuotesBadge,
}) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();
  const { isMobile } = useResolution();

  return (
    <Box
      position="relative"
      pt={16}
      pb={10}
      pl={{ xs: 8, md: 25 }}
      pr={8}
      id={`option-${option.elements.orderNo.value}`}
      data-testid={`option-${option.elements.orderNo.value}`}
      sx={{ backgroundColor: 'appColors.support80.transparentLight' }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md={11} display="flex" alignItems="center" component="header">
          <Typography variant="h4" component="h3">
            <Typography
              variant="h3"
              fontWeight="bold"
              aria-hidden="true"
              component="span"
              sx={{ backgroundColor: 'appColors.tertiary.dark' }}
              color="common.white"
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
              top={-24}
              left={0}
              height={60}
              minWidth={140}
              px={4}
            >
              {labelByKey('options_option')} {index}
            </Typography>
            {option.elements.header.value}
          </Typography>
          {option.elements.headerTooltip?.value?.elements && (
            <Tooltip
              header={option.elements.headerTooltip.value.elements.headerText?.value}
              html={option.elements.headerTooltip.value.elements.contentText?.value}
            />
          )}
        </Grid>
        {option.elements.description.value && (
          <Grid item xs={12} md={11}>
            <Typography variant="body1" component="div">
              <ParsedHtml html={option.elements.description.value} />
            </Typography>
          </Grid>
        )}
        <Grid container item md={11} flexWrap={{ xs: 'wrap', md: 'nowrap' }}>
          {option.elements.summaryItems.values
            ?.map<React.ReactNode>((item, idx) => (
              <Grid
                item
                key={idx}
                maxWidth="100%"
                flex={option.elements?.distributedLayoutOfSummaryItems?.value ? 1 : 'unset'}
                sx={{
                  '&:not(:last-child)': {
                    borderBottom: theme => (isMobile ? `1px solid ${theme.palette.divider}` : ''),
                  },
                }}
              >
                <Grid container height="100%" wrap="nowrap">
                  {isMobile && idx > 0 && (
                    <Grid key={`plus-mobile-${idx}`} item mt={3}>
                      <Add
                        titleAccess="plus-icon"
                        color="primary"
                        fontSize="large"
                        aria-label={labelByKey('aria-plus-icon.svg')}
                      />
                    </Grid>
                  )}
                  <Grid
                    flex={option.elements?.distributedLayoutOfSummaryItems?.value ? 1 : 'unset'}
                    item
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    pt={{ xs: !idx ? 0 : 4, md: 6 }}
                    pr={{ xs: 0, md: 12 }}
                    pb={{ xs: 0, md: 6 }}
                    pl={{ xs: !idx ? 13 : 4, md: 6 }}
                    bgcolor={{
                      xs: 'unset',
                      md: summaryItemValue(item) === '£0' ? 'appColors.incidental.035' : 'background.default',
                    }}
                    alignItems="flex-start"
                  >
                    {!isMobile && <Typography variant="body1">{item.elements.header.value}</Typography>}
                    <Typography
                      color={summaryItemValue(item) === '£0' ? 'disabled' : 'primary'}
                      variant="firstLevelValue"
                      component="span"
                    >
                      {summaryItemValue(item)}
                    </Typography>
                    {item.elements.description.value && (
                      <Typography variant="body1" component="div" mb={{ xs: 2, md: 0 }}>
                        <ParsedHtml html={item.elements.description.value} fontSize="inherit" />
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))
            .reduce(
              (prev, curr, idx) => [
                prev,
                !isMobile && prev && (
                  <Grid key={`plus-${idx}`} item xs={12} md="auto" m={2} display="flex" alignItems="center">
                    <Add
                      titleAccess="plus-icon"
                      color="primary"
                      fontSize="medium"
                      aria-label={labelByKey('aria-plus-icon.svg')}
                    />
                  </Grid>
                ),
                curr,
              ],
              null,
            )}
        </Grid>
        <Grid item xs={11} display="flex" flexDirection="row" alignItems="flex-end" gap={2}>
          <Box width="100%" display="flex" flexDirection="column" gap={2}>
            {quoteExpiryDate && !hideADVProtectedQuotesBadge && (
              <Typography variant="body1" component="div">
                {htmlByKey('ADV_protected_quotes_badge', { quote_expiry_date: quoteExpiryDate })}
              </Typography>
            )}
            {option.elements.bottomInformation?.value && <ParsedHtml html={option.elements.bottomInformation.value} />}
            {!!customProtectedQuoteHtmlKey && htmlByKey(customProtectedQuoteHtmlKey)}
          </Box>
          {option.elements.callToAction?.value && (
            <Box display="flex" justifyContent="flex-end">
              <ContentButtonBlock
                {...parseButtonProps(option.elements?.callToAction?.value?.elements)}
                pageKey={pageKey}
                loading={loading}
                onAsyncCallback={onItemActionClicked}
              />
            </Box>
          )}
          {!option.elements.callToAction?.value && option.elements.link.value && option.elements.linkText.value && (
            <Box display="flex" justifyContent="flex-end">
              <PrimaryButton
                loading={loading}
                onClick={onItemActionClicked}
                data-testid={`view-option-${index}-btn`}
                aria-label={`Explore ${labelByKey('options_option')} ${index} - ${
                  option?.elements?.header?.value ?? ''
                }`}
              >
                {option.elements.linkText.value} <ChevronRight sx={{ ml: 2 }} fontSize="medium" />
              </PrimaryButton>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  function summaryItemValue(item: SummaryItemValue) {
    const {
      elements: {
        format: { value: { selection: valueFormat } = { selection: undefined } },
        value: { value: itemValue },
      },
    } = item;
    if (valueFormat === 'Text' || !itemValue) {
      return itemValue;
    }

    const value = findSummaryItemValue(retirementValuePathToKeys(item));

    if (!value && value !== 0) {
      return `-`;
    }
    if (value === 0 || value === '0') {
      return valueFormat === 'Currency' ? `${labelByKey('currency:GBP')}${value}` : value;
    }
    if (valueFormat === 'Currency') {
      return `${labelByKey('currency:GBP')}${currencyValue(value)}`;
    }
    if (valueFormat === 'Currency per year') {
      return `${labelByKey('currency:GBP')}${currencyValue(value)}/${labelByKey('year')}`;
    }
    return '';
  }
};
