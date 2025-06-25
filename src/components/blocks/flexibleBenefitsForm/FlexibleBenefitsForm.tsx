import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DateField, TextField } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { FlexibleBenefitsFormType, flexibleBenefitsFormSchema } from './validation';

interface Props {
  prefix: string;
  defaultValues?: Partial<FlexibleBenefitsFormType>;
  onSubmit(values: FlexibleBenefitsFormType): Promise<void>;
}

const TODAY = new Date();

export const FlexibleBenefitsForm: React.FC<Props> = ({ prefix, defaultValues, onSubmit }) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const validationSchema = flexibleBenefitsFormSchema(prefix);
  const form = useForm<FlexibleBenefitsFormType>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: { ...validationSchema.getDefault(), ...defaultValues },
  });
  useFormSubmissionBindingHooks({
    key: prefix,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    cb: () => form.handleSubmit(onSubmit)(),
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({ ...validationSchema.getDefault(), ...defaultValues });
    }
  }, [defaultValues]);

  return (
    <Grid
      container
      spacing={6}
      component="form"
      data-testid={prefix}
      sx={{ '& .MuiOutlinedInput-root': { maxWidth: 372 } }}
    >
      <Grid item xs={12}>
        <TextField
          name="nameOfPlan"
          control={form.control}
          label={labelByKey(`${prefix}_name_of_plan`)}
          errorTooltip={tooltipByKey(`${prefix}_name_of_plan_error_tooltip`)}
          tooltip={tooltipByKey(`${prefix}_name_of_plan_tooltip`)}
          onBlur={() => form.clearErrors()}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="typeOfPayment"
          control={form.control}
          label={labelByKey(`${prefix}_type_of_payment`)}
          errorTooltip={tooltipByKey(`${prefix}_type_of_payment_error_tooltip`)}
          tooltip={tooltipByKey(`${prefix}_type_of_payment_tooltip`)}
          onBlur={() => form.clearErrors()}
        />
      </Grid>
      <Grid item xs={12}>
        <DateField
          name="dateOfPayment"
          control={form.control}
          label={labelByKey(`${prefix}_date_of_payment`)}
          errorTooltip={tooltipByKey(`${prefix}_date_of_payment_error_tooltip`)}
          tooltip={tooltipByKey(`${prefix}_date_of_payment_tooltip`)}
          onBlur={() => form.clearErrors()}
          maxDate={TODAY}
        />
      </Grid>
    </Grid>
  );
};
