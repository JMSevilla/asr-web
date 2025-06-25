import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { NumberField } from '../../form';
import { LSAQuestionForm, lsaQuestionSchema } from './validation';

interface Props {
  id: string;
  journeyType: JourneyTypeSelection;
  pageKey: string;
}

interface LumpSumAllowanceFormValues {
  paidLSACashAmount: number;
  paidLSDBACashAmount: number;
}

export const LSAQuestionFormBlock: React.FC<Props> = ({ id, journeyType, pageKey }) => {
  const { labelByKey } = useGlobalsContext();
  const validationSchema = lsaQuestionSchema(id);
  const stepData = useJourneyStepData<LumpSumAllowanceFormValues>({
    pageKey,
    formKey: id,
    journeyType,
    personType: 'cash_amounts',
  });
  const { control, reset, clearErrors, handleSubmit, formState } = useForm<LSAQuestionForm>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: { ...validationSchema.getDefault(), ...stepData.values },
  });

  useFormSubmissionBindingHooks({
    key: id,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    cb: () => handleSubmit(onSubmit)(),
  });

  useEffect(() => {
    if (stepData.values) {
      reset({ ...validationSchema.getDefault(), ...stepData.values });
    }
  }, [stepData.values]);

  return (
    <Stack gap={12} flexDirection="column" flexWrap="nowrap" data-testid={id}>
      <Stack
        gap={6}
        component="form"
        sx={{ '& .MuiOutlinedInput-root': { width: theme => theme.sizes.numberFieldWidth } }}
      >
        <NumberField
          prefix={`${labelByKey('currency:GBP')}`}
          name="paidLSACashAmount"
          control={control}
          label={labelByKey(`${id}_LSA_amount`)}
          onBlur={() => clearErrors()}
          asStringValue={false}
          decimalScale={2}
          thousandSeparator
          fixedDecimalScale
        />
        <NumberField
          prefix={`${labelByKey('currency:GBP')}`}
          name="paidLSDBACashAmount"
          control={control}
          label={labelByKey(`${id}_LSDBA_amount`)}
          onBlur={() => clearErrors()}
          asStringValue={false}
          decimalScale={2}
          thousandSeparator
          fixedDecimalScale
        />
      </Stack>
    </Stack>
  );

  async function onSubmit(values: LSAQuestionForm) {
    await stepData.save({
      paidLSACashAmount: values.paidLSACashAmount,
      paidLSDBACashAmount: values.paidLSDBACashAmount,
    });
  }
};
