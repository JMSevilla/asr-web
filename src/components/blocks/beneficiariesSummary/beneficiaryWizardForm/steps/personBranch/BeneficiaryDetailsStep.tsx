import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { SelectProps } from '@mui/material/Select/Select';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGlobalsContext } from '../../../../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../../../../core/contexts/JourneyIndicatorContext';
import { useCachedApi } from '../../../../../../core/hooks/useCachedApi';
import { PrimaryButton } from '../../../../../buttons';
import { DateField, SelectField, TextField } from '../../../../../form';
import { useBeneficiaryWizardFormContext } from '../../BeneficiaryWizardFormContext';

import { BeneficiaryDetailsFormType, BeneficiaryFormType } from '../../types';
import { beneficiaryDetailsSchema } from '../../validation';

interface Props {
  nextStep(values: Partial<BeneficiaryFormType>, filter?: boolean, isDirty?: boolean): void;
  previousStep(): void;
  values: Partial<BeneficiaryFormType>;
}

const TODAY = new Date();
export const BeneficiaryDetailsStep: FC<Props> = ({ nextStep, previousStep, values }) => {
  const { panelByKey } = useBeneficiaryWizardFormContext();
  const { labelByKey } = useGlobalsContext();
  const relationshipStatuses = useCachedApi(async api => {
    const statuses = await api.mdp.relationshipStatuses();
    return statuses.data.statuses.map(x => ({ value: x, label: x }));
  }, 'beneficiary-relationship-statuses');

  const { setCustomHeader } = useJourneyIndicatorContext();
  const { handleSubmit, reset, formState, control, clearErrors, trigger } = useForm<BeneficiaryDetailsFormType>({
    resolver: yupResolver(beneficiaryDetailsSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: beneficiaryDetailsSchema.getDefault() as BeneficiaryDetailsFormType,
  });

  const { isValid, isDirty } = formState;

  useEffect(() => {
    setCustomHeader({
      title: labelByKey('benef_details_header'),
      action: previousStep,
    });

    return () => setCustomHeader({ title: null, action: null, icon: null });
  }, []);

  useEffect(() => {
    reset({
      dateOfBirth: values?.dateOfBirth && !isNaN(values?.dateOfBirth?.getTime()) ? values.dateOfBirth : null,
      forenames: values?.forenames ?? '',
      surname: values?.surname ?? '',
      relationship: relationshipStatuses.result?.find(r => r.value === values?.relationship)
        ? values?.relationship
        : '',
    } as BeneficiaryDetailsFormType);
    values?.forenames && values?.surname && trigger('dateOfBirth');
  }, [values, trigger, relationshipStatuses.result]);

  const [panel1, panel2] = [panelByKey('beneficiary_details_panel_1'), panelByKey('beneficiary_details_panel_2')];

  return (
    <form>
      <Grid container spacing={12}>
        {panel1 && (
          <Grid item xs={12}>
            {panel1}
          </Grid>
        )}
        <Grid container item spacing={12} xs={8} mt={-12}>
          <Grid xs={12} item>
            <TextField
              name="forenames"
              control={control}
              label={labelByKey('benef_details_firstname')}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid xs={12} item>
            <TextField
              name="surname"
              control={control}
              label={labelByKey('benef_details_surname')}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid xs={12} item>
            <SelectField
              name="relationship"
              control={control}
              options={relationshipStatuses.result}
              label={labelByKey('benef_details_relationship')}
              onBlur={() => clearErrors()}
              isLoading={relationshipStatuses.loading}
              displayEmpty
              renderValue={
                (val =>
                  val ? (
                    val
                  ) : (
                    <Typography sx={{ color: theme => theme.palette.appColors.essential[300] }}>
                      {labelByKey('benef_details_relationship_placeholder')}
                    </Typography>
                  )) as SelectProps['renderValue']
              }
            />
          </Grid>
          <Grid xs={12} item>
            <DateField
              name="dateOfBirth"
              control={control}
              label={labelByKey('benef_details_dateofbirth')}
              onBlur={() => clearErrors()}
              maxDate={TODAY}
            />
          </Grid>
        </Grid>
        {panel2 && (
          <Grid item xs={12}>
            {panel2}
          </Grid>
        )}
        <Grid item xs={12}>
          <PrimaryButton disabled={!isValid} onClick={handleSubmit(onSubmit)} data-testid="continue-btn">
            {labelByKey('continue')}
          </PrimaryButton>
        </Grid>
      </Grid>
    </form>
  );

  function onSubmit(formValues: BeneficiaryDetailsFormType) {
    nextStep(
      {
        ...formValues,
      },
      false,
      isDirty,
    );
  }
};
