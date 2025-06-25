import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { InputLoader, NumberField, PercentageField, Tooltip } from '../..';
import { SummaryBlocksValue } from '../../../api/content/types/retirement';
import { RetirementQuotesV3Option } from '../../../api/mdp/types';
import { findRetirementOptionValueByKey, retirementValuePathToKeys } from '../../../business/retirement';
import { calculatePercentage } from '../../../business/currency';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { ChangeLumpSumForm, changeLumpSumSchema } from '../dcRetirementLumpSum/validation';

interface Props {
  loading?: boolean;
  summaryBlock?: SummaryBlocksValue;
  quotes?: RetirementQuotesV3Option;
  onLumpSumApplicabilityChange(applicable: boolean): void;
  onRequestedLumpSumChange(value: number): void;
  initialValue?: number;
}

export const DCRetirementOptionC2SLumpSumForm: React.FC<Props> = ({
  quotes,
  loading,
  summaryBlock,
  onLumpSumApplicabilityChange,
  onRequestedLumpSumChange,
  initialValue,
}) => {
  const { labelByKey } = useGlobalsContext();
  const minLumpSum = findRetirementOptionValueByKey(quotes ?? {}, 'minimumPermittedTotalLumpSum');
  const maxLumpSum = findRetirementOptionValueByKey(quotes ?? {}, 'maximumPermittedStandardLumpSum');
  const totalFundValue = findRetirementOptionValueByKey(quotes ?? {}, 'totalFundValue');
  const requestedLumpSum = findRetirementOptionValueByKey(
    quotes ?? {},
    ...retirementValuePathToKeys(summaryBlock?.elements.summaryItems.values[0]),
  );
  const validationSchema = changeLumpSumSchema(+(minLumpSum ?? 0), +(maxLumpSum ?? 1000000000));
  const { control, watch, setFocus, setValue } = useForm<ChangeLumpSumForm>({
    resolver: yupResolver(validationSchema) as any,
    mode: 'onChange',
    defaultValues: initialValue !== undefined
      ? { taxFreeLumpSum: initialValue, percentage: '' }
      : requestedLumpSum 
        ? { taxFreeLumpSum: +requestedLumpSum, percentage: '' } 
        : { taxFreeLumpSum: 0, percentage: '' },
  });
  
  const { isValid, errors } = useFormState({ control });
  const tooltip = summaryBlock?.elements.summaryItems.values[0].elements.tooltip.value?.elements;
  const requestedLumpSumInputValue = Number(watch('taxFreeLumpSum'));
  const lumpSumApplicable =
    isValid &&
    !!requestedLumpSum &&
    !!requestedLumpSumInputValue;

  useEffect(() => {
    onLumpSumApplicabilityChange(lumpSumApplicable);
  }, [lumpSumApplicable, onLumpSumApplicabilityChange]);

  useEffect(() => {
    onRequestedLumpSumChange(requestedLumpSumInputValue);
  }, [requestedLumpSumInputValue, onRequestedLumpSumChange]);

  useEffect(() => {
    if (!loading && initialValue !== undefined) {
      setValue('taxFreeLumpSum', initialValue);
    }
  }, [loading, initialValue, setValue]);

  useEffect(() => {
    if (!loading && requestedLumpSum && initialValue === undefined) {
      setValue('taxFreeLumpSum', +requestedLumpSum);
    }
  }, [requestedLumpSum, loading, initialValue, setValue]);

  useEffect(() => {
    setValue('percentage', `${calculatePercentage(+(totalFundValue ?? 1), +requestedLumpSumInputValue)}%`);
  }, [requestedLumpSumInputValue, setValue, totalFundValue]);

  useFormFocusOnError<ChangeLumpSumForm>(errors, setFocus);

  if (loading) {
    return <InputLoader />;
  }

  return (
    <Stack
      component="form"
      direction={{ xs: 'column', sm: 'row' }}
      spacing={4}
      alignItems="flex-end"
      flex={1}
    >
      <NumberField
        decimalScale={2}
        thousandSeparator
        fixedDecimalScale
        control={control}
        name="taxFreeLumpSum"
        label={
          <Typography display="flex">
            {summaryBlock?.elements.header.value}
            {tooltip && <Tooltip header={tooltip.headerText.value} html={tooltip.contentText.value} />}
          </Typography>
        }
      />
      <Box component="p" width={{ xs: '100%', sm: 'unset' }}>
        {labelByKey(`dc_lump_sum_or`)}
      </Box>
      <PercentageField name="percentage" control={control} disabled label="" />
    </Stack>
  );
}; 