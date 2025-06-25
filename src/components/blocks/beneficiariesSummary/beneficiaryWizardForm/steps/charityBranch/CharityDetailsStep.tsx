import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Link } from '@mui/material';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGlobalsContext } from '../../../../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../../../../core/contexts/JourneyIndicatorContext';
import { PrimaryButton } from '../../../../../buttons';
import { NumberField, TextField } from '../../../../../form';
import { useBeneficiaryWizardFormContext } from '../../BeneficiaryWizardFormContext';

import { BeneficiaryCharityDetailsFormType, BeneficiaryFormType } from '../../types';
import { beneficiaryCharityDetailsSchema } from '../../validation';

interface Props {
  nextStep(values: Partial<BeneficiaryFormType>, filter?: boolean, isDirty?: boolean): void;
  previousStep(): void;
  values: Partial<BeneficiaryFormType>;
}

export const CharityDetailsStep: FC<Props> = ({ nextStep, previousStep, values }) => {
  const { panelByKey } = useBeneficiaryWizardFormContext();
  const { labelByKey, buttonByKey } = useGlobalsContext();

  const { setCustomHeader } = useJourneyIndicatorContext();
  const { handleSubmit, reset, formState, control, clearErrors } = useForm<BeneficiaryCharityDetailsFormType>({
    resolver: yupResolver(beneficiaryCharityDetailsSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: beneficiaryCharityDetailsSchema.getDefault() as BeneficiaryCharityDetailsFormType,
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
      charityName: values?.charityName ? values.charityName : null,
      charityNumber: values?.charityNumber ? values.charityNumber : null,
    } as BeneficiaryCharityDetailsFormType);
  }, [values]);

  const button = buttonByKey('benef_charity_link');
  const [panel1, panel2] = [
    panelByKey('beneficiary_charity_details_panel_1'),
    panelByKey('beneficiary_charity_details_panel_2'),
  ];

  return (
    <form>
      <Grid container spacing={12}>
        {panel1 && (
          <Grid item xs={12}>
            {panel1}
          </Grid>
        )}
        <Grid container item spacing={12} xs={8}>
          <Grid xs={12} item>
            <TextField
              data-testid="charity-name"
              name="charityName"
              control={control}
              label={labelByKey('benef_charity_name')}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid xs={12} item>
            <NumberField
              onBlur={() => clearErrors()}
              data-testid="charity-number"
              name="charityNumber"
              control={control}
              label={labelByKey('benef_charity_number')}
              asStringValue={false}
              decimalScale={0}
            />
            <Box mt={2}>
              <Link
                sx={{
                  textDecoration: 'underline',
                  textUnderlineOffset: 6,
                  transition: theme => theme.transitions.create('all'),
                }}
                href={button?.link}
                target={button?.openInTheNewTab ? '_blank' : '_self'}
              >
                {button?.text}
              </Link>
            </Box>
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

  function onSubmit(formValues: BeneficiaryCharityDetailsFormType) {
    nextStep(
      {
        ...formValues,
        relationship: 'Charity',
      },
      false,
      isDirty,
    );
  }
};
