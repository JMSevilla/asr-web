import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { Button, InputLoader, NumberField, PercentageField, Tooltip } from '../..';
import { SummaryBlocksValue } from '../../../api/content/types/retirement';
import { RetirementQuotesV3Option } from '../../../api/mdp/types';
import { findRetirementOptionValueByKey, retirementValuePathToKeys } from '../../../business/retirement';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { ChangeLumpSumForm, changeLumpSumSchema } from './validation';
import { calculatePercentage } from '../../../business/currency';

interface Props {
  loading?: boolean;
  summaryBlock?: SummaryBlocksValue;
  quotes?: RetirementQuotesV3Option;
  isCalculationSuccessful?: boolean;
  onCalculatedValueReset: VoidFunction;
  onNewLumpSumRecalculation: VoidFunction;
  onLumpSumApplicabilityChange(applicable: boolean): void;
  onSubmit(taxFreeLumpSum: number): void;
  prefix: string;
}

export const DcRetirementLumpSumForm: React.FC<Props> = ({
  quotes,
  loading,
  summaryBlock,
  isCalculationSuccessful,
  onCalculatedValueReset,
  onNewLumpSumRecalculation,
  onLumpSumApplicabilityChange,
  onSubmit,
  prefix,
}) => {
  const { labelByKey } = useGlobalsContext();
  const [lastSuccessfullyCalculatedLumpSum, setLastSuccessfullyCalculatedLumpSum] = useState<number>();
  const minLumpSum = findRetirementOptionValueByKey(quotes ?? {}, 'minimumPermittedTotalLumpSum');
  const maxLumpSum = findRetirementOptionValueByKey(quotes ?? {}, 'maximumPermittedTotalLumpSum');
  const totalFundValue = findRetirementOptionValueByKey(quotes ?? {}, 'totalFundValue');
  const requestedLumpSum = findRetirementOptionValueByKey(
    quotes ?? {},
    ...retirementValuePathToKeys(summaryBlock?.elements.summaryItems.values[0]),
  );
  const validationSchema = changeLumpSumSchema(+(minLumpSum ?? 0), +(maxLumpSum ?? 1));
  const { handleSubmit, control, watch, setFocus, setValue } = useForm<ChangeLumpSumForm>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: requestedLumpSum ? { taxFreeLumpSum: +requestedLumpSum } : validationSchema.getDefault(),
  });
  const { isDirty, isValid, errors } = useFormState({ control });
  const tooltip = summaryBlock?.elements.summaryItems.values[0].elements.tooltip.value?.elements;
  const requestedLumpSumInputValue = Number(watch('taxFreeLumpSum'));
  const lumpSumApplicable =
    isValid &&
    isDirty &&
    !!requestedLumpSum &&
    !!requestedLumpSumInputValue &&
    requestedLumpSumInputValue === requestedLumpSum;

  useFormFocusOnError<ChangeLumpSumForm>(errors, setFocus);

  useEffect(() => {
    onLumpSumApplicabilityChange(lumpSumApplicable);
  }, [lumpSumApplicable]);

  useEffect(() => {
    if (!loading && requestedLumpSum && requestedLumpSum !== requestedLumpSumInputValue) {
      setValue('taxFreeLumpSum', +requestedLumpSum);
    }
  }, [requestedLumpSum, loading]);

  useEffect(() => {
    if (isCalculationSuccessful) {
      setLastSuccessfullyCalculatedLumpSum(requestedLumpSumInputValue);
      return;
    }
    if (isCalculationSuccessful === false && lastSuccessfullyCalculatedLumpSum !== undefined) {
      onCalculatedValueReset();
      setValue('taxFreeLumpSum', lastSuccessfullyCalculatedLumpSum);
      handleRecalculate({
        taxFreeLumpSum: lastSuccessfullyCalculatedLumpSum,
        percentage: `${calculatePercentage(+(maxLumpSum ?? 1), +requestedLumpSumInputValue)}%`,
      });
    }
  }, [isCalculationSuccessful]);

  useEffect(() => {
    setValue('percentage', `${calculatePercentage(+(totalFundValue ?? 1), +requestedLumpSumInputValue)}%`);
  }, [requestedLumpSumInputValue]);

  if (loading) {
    return <InputLoader />;
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(handleRecalculate)}
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
        onEnter={handleSubmit(handleRecalculate)}
        label={
          <Typography display="flex">
            {summaryBlock?.elements.header.value}
            {tooltip && <Tooltip header={tooltip.headerText.value} html={tooltip.contentText.value} />}
          </Typography>
        }
      />
      <Box component="p" width={{ xs: '100%', sm: 'unset' }}>
        {labelByKey(`${prefix}_or`)}
      </Box>
      <PercentageField name="percentage" control={control} disabled label="" />
      <Box width={{ xs: '100%', sm: 'unset' }}>
        <Button
          type="Primary"
          buttonActionType="submit"
          loading={loading}
          disabled={!isValid || !isDirty || (!!requestedLumpSum && requestedLumpSumInputValue === requestedLumpSum)}
          data-testid="recalculate-button"
        >
          {labelByKey(`${prefix}_recalculate`)}
        </Button>
      </Box>
    </Stack>
  );

  async function handleRecalculate(formValue: ChangeLumpSumForm) {
    if (formValue.taxFreeLumpSum !== lastSuccessfullyCalculatedLumpSum) {
      onNewLumpSumRecalculation();
    }
    onSubmit(formValue.taxFreeLumpSum);
  }
};
