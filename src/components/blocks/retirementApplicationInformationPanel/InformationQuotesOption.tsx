import { Add, ChevronRight } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { SystemProps } from '@mui/system';
import { useMemo } from 'react';
import { QuotesOption } from '../../../api/mdp/types';
import { currencyValue } from '../../../business/currency';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useResolution } from '../../../core/hooks/useResolution';
import { ParsedHtml } from '../../ParsedHtml';
import { PrimaryButton } from '../../buttons/PrimaryButton';

interface Props extends SystemProps {
  index?: number;
  colored?: boolean;
  option: QuotesOption;
  withTitle?: boolean;
  loading?: boolean;
  onView?(index: number, type: QuotesOption['label']): void;
}

export type OptionSums = { name: string | JSX.Element; sum: number | string; description?: string | JSX.Element };

export const InformationQuotesOption: React.FC<Props> = ({
  index,
  option,
  colored,
  withTitle,
  loading,
  onView,
  ...props
}) => {
  const { labelByKey } = useGlobalsContext();
  const { isMobile } = useResolution();

  const optionSums = useMemo<OptionSums[]>(
    () =>
      option.summaryFigures?.map(figure => ({
        name: figure?.label ? <ParsedHtml html={figure?.label} /> : figure?.label,
        sum: `${labelByKey('currency:GBP')}${currencyValue(figure.value)}`,
        description: figure?.description ? <ParsedHtml html={figure?.description} /> : figure?.description,
      })) ?? ([] as OptionSums[]),
    [[option, labelByKey]],
  );
  return (
    <Box
      position="relative"
      pt={16}
      pr={8}
      tabIndex={0}
      bgcolor={colored ? 'appColors.support80.transparentLight' : 'transparent'}
      {...props}
    >
      <Grid container spacing={6}>
        {withTitle && (
          <Grid item xs={12}>
            <Typography variant={isMobile ? 'body1' : 'h4'}>
              {labelByKey(`options_${option.label}_description`)}
            </Typography>
          </Grid>
        )}
        <Grid
          container
          item
          md={11}
          flexWrap={{ xs: 'wrap', md: 'nowrap' }}
          flexDirection={isMobile ? 'column' : 'row'}
        >
          {optionSums.length > 0
            ? optionSums
                .map<React.ReactNode>((optionSum, idx) => (
                  <Grid
                    item
                    key={idx}
                    maxWidth="100%"
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
                        item
                        display="flex"
                        flexDirection="column"
                        gap={2}
                        pt={{ xs: !idx ? 0 : 4, md: 6 }}
                        pr={{ xs: 0, md: 12 }}
                        pb={{ xs: 0, md: 6 }}
                        pl={{ xs: !idx ? 13 : 4, md: 6 }}
                        bgcolor={isMobile ? '' : 'background.default'}
                        alignItems="flex-start"
                      >
                        {!isMobile && (
                          <Typography variant="body1" component="div">
                            {optionSum.name}
                          </Typography>
                        )}
                        <Typography color="primary" variant="firstLevelValue" component="span">
                          {optionSum.sum}
                        </Typography>
                        <Typography variant="body1" component="div" mb={{ xs: optionSum.description ? 2 : 0, md: 0 }}>
                          {optionSum.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))
                .reduce((prev, curr, idx) => [
                  prev,
                  !isMobile && (
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
                ])
            : null}
        </Grid>
        {onView && index && (
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <PrimaryButton
              loading={loading}
              onClick={() => onView(index, option.label)}
              data-testid={`view-option-${index}-btn`}
            >
              {labelByKey('options_view_button')} <ChevronRight sx={{ ml: 2 }} fontSize="medium" />
            </PrimaryButton>
          </Grid>
        )}
      </Grid>
      {index && (
        <Box
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
          <Typography variant="h3" fontWeight="bold">
            {labelByKey('options_option')} {index}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
