import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumberField, PrimaryButton, Tooltip } from '../..';
import { SummaryBlocksValue } from '../../../api/content/types/retirement';
import { RetirementQuotesV3Option } from '../../../api/mdp/types';
import { findRetirementOptionValueByKey, retirementValuePathToKeys } from '../../../business/retirement';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { ChangeLumpSumForm, changeLumpSumSchema } from './validation';

interface Props {
  loading?: boolean;
  summaryBlock?: SummaryBlocksValue;
  quotes?: RetirementQuotesV3Option;
  isCalculationSuccessful?: boolean;
  onCalculatedValueReset: VoidFunction;
  onNewLumpSumRecalculation: VoidFunction;
  onLumpSumApplicabilityChange(applicable: boolean): void;
  onSubmit(taxFreeLumpSum: number): Promise<AxiosResponse>;
}

export const RetirementLumpSumForm: React.FC<Props> = ({
  quotes,
  loading,
  summaryBlock,
  isCalculationSuccessful,
  onCalculatedValueReset,
  onNewLumpSumRecalculation,
  onLumpSumApplicabilityChange,
  onSubmit,
}) => {
  const { labelByKey } = useGlobalsContext();
  const [lastSuccessfullyCalculatedLumpSum, setLastSuccessfullyCalculatedLumpSum] = useState<number>();
  const minLumpSum = findRetirementOptionValueByKey(
    quotes ?? {},
    ...retirementValuePathToKeys(summaryBlock?.elements.summaryItems.values[2]),
  );
  const maxLumpSum = findRetirementOptionValueByKey(
    quotes ?? {},
    ...retirementValuePathToKeys(summaryBlock?.elements.summaryItems.values[1]),
  );
  const requestedLumpSum = findRetirementOptionValueByKey(
    quotes ?? {},
    ...retirementValuePathToKeys(summaryBlock?.elements.summaryItems.values[0]),
  );
  const validationSchema = changeLumpSumSchema(+(minLumpSum ?? 0), +(maxLumpSum ?? 1));
  const { handleSubmit, control, watch, formState, setFocus, setValue } = useForm<ChangeLumpSumForm>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: requestedLumpSum ? { taxFreeLumpSum: +requestedLumpSum } : validationSchema.getDefault(),
  });
  useFormFocusOnError<ChangeLumpSumForm>(formState.errors, setFocus);
  const tooltip = summaryBlock?.elements.summaryItems.values[0].elements.tooltip.value?.elements;
  const requestedLumpSumInputValue = Number(watch('taxFreeLumpSum'));
  const lumpSumApplicable =
    formState.isValid &&
    formState.isDirty &&
    !!requestedLumpSum &&
    !!requestedLumpSumInputValue &&
    requestedLumpSumInputValue === requestedLumpSum;

  useEffect(() => {
    onLumpSumApplicabilityChange(lumpSumApplicable);
  }, [lumpSumApplicable]);

  useEffect(() => {
    if (!loading && requestedLumpSum && requestedLumpSum !== requestedLumpSumInputValue) {
      setValue('taxFreeLumpSum', +requestedLumpSum);
    }
  }, [requestedLumpSum]);

  useEffect(() => {
    if (isCalculationSuccessful) {
      setLastSuccessfullyCalculatedLumpSum(requestedLumpSumInputValue);
      return;
    }
    if (isCalculationSuccessful === false && lastSuccessfullyCalculatedLumpSum !== undefined) {
      onCalculatedValueReset();
      setValue('taxFreeLumpSum', lastSuccessfullyCalculatedLumpSum);
      handleRecalculate({ taxFreeLumpSum: lastSuccessfullyCalculatedLumpSum });
    }
  }, [isCalculationSuccessful]);

  return (
    <>
      <Grid item xs={12} sm={6}>
        <NumberField
          decimalScale={2}
          thousandSeparator
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
      </Grid>
      <Grid item xs={12} sm={6}>
        <PrimaryButton
          onClick={handleSubmit(handleRecalculate)}
          loading={loading}
          disabled={
            !formState.isValid ||
            !formState.isDirty ||
            (!!requestedLumpSum && requestedLumpSumInputValue === requestedLumpSum)
          }
          data-testid="recalculate-button"
        >
          {labelByKey('recalculate')}
        </PrimaryButton>
      </Grid>
    </>
  );

  async function handleRecalculate(formValue: ChangeLumpSumForm) {
    if (formValue.taxFreeLumpSum !== lastSuccessfullyCalculatedLumpSum) {
      onNewLumpSumRecalculation();
    }
    await onSubmit(formValue.taxFreeLumpSum);
  }
};
