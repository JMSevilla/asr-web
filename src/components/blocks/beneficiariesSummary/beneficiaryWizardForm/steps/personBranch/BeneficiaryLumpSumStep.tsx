import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NumberField, PrimaryButton, RadioButtonsField, TextAreaField } from '../../../../..';
import { useGlobalsContext } from '../../../../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../../../../core/contexts/JourneyIndicatorContext';
import { useModal } from '../../../../../../core/hooks/useModal';
import { BeneficiaryNoteModal } from '../../../modals/BeneficiaryNoteModal';
import { useBeneficiaryWizardFormContext } from '../../BeneficiaryWizardFormContext';
import { BeneficiaryFormType, BeneficiaryLumpSumType } from '../../types';
import { beneficiaryLumpSumSchema } from '../../validation';

interface Props {
  nextStep(values: Partial<BeneficiaryFormType>, filter?: boolean, isDirty?: boolean): void;
  previousStep(): void;
  values: Partial<BeneficiaryFormType>;
}

export const BeneficiaryLumpSumStep: FC<Props> = ({ nextStep, previousStep, values }) => {
  const { panelByKey, form } = useBeneficiaryWizardFormContext();
  const { labelByKey, messageByKey } = useGlobalsContext();
  const { setCustomHeader } = useJourneyIndicatorContext();
  const noteConfirmationModal = useModal();
  const { control, formState, handleSubmit, watch, reset } = useForm<BeneficiaryLumpSumType>({
    resolver: yupResolver(beneficiaryLumpSumSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: beneficiaryLumpSumSchema.getDefault(),
  });
  const pensionBeneficiary = watch('isPensionBeneficiary');
  const { isDirty, isValid } = formState;

  useEffect(() => {
    setCustomHeader({
      title: labelByKey('benef_lump_sum_header'),
      action: previousStep,
    });

    return () => setCustomHeader({ title: null, action: null, icon: null });
  }, []);

  useEffect(() => {
    if (!values) return;

    reset({
      lumpSumPercentage: values?.lumpSumPercentage,
      isPensionBeneficiary: values?.isPensionBeneficiary,
      notes: values?.notes,
    });
  }, [values]);

  const radioButtons = [
    {
      value: true,
      label: labelByKey('Yes'),
    },
    {
      value: false,
      label: labelByKey('No'),
    },
  ];

  const [panel1, panel2, panel3, panel4] = [
    panelByKey('beneficiary_lump_sum_panel_1'),
    panelByKey('beneficiary_lump_sum_panel_2'),
    panelByKey('beneficiary_lump_sum_panel_3'),
    panelByKey('beneficiary_lump_sum_panel_4'),
  ];

  return (
    <form>
      <Grid container spacing={12}>
        {panel1 && (
          <Grid item xs={12}>
            {panel1}
          </Grid>
        )}
        <Grid xs={4} item mt={-8}>
          <NumberField
            suffix="%"
            placeholder="%"
            name="lumpSumPercentage"
            control={control}
            hideLabel
            asStringValue={false}
            isAllowed={({ floatValue }) => (0 <= floatValue! && floatValue! <= 100) || floatValue === undefined}
            decimalScale={2}
          />
        </Grid>
        {panel2 && (
          <Grid item xs={12} mt={-6}>
            {panel2}
          </Grid>
        )}
        <Grid xs={12} item mt={-8}>
          <RadioButtonsField
            name="isPensionBeneficiary"
            control={control}
            buttons={radioButtons}
            withBorder={false}
            valueParser={value => value === 'true'}
            defaultValue={false}
          />
        </Grid>
        {panel3 && (
          <Grid item xs={12} mt={-8}>
            {panel3}
          </Grid>
        )}
        {pensionBeneficiary && (
          <Grid xs={12} item mt={-6}>
            {messageByKey('beneficiary_payment_non_spouse_partner')}
          </Grid>
        )}
        {panel4 && (
          <Grid item xs={12}>
            {panel4}
          </Grid>
        )}
        <Grid item xs={12} mt={-6}>
          <TextAreaField
            placeholder={labelByKey('beneficiary_payment_instructions')}
            name="notes"
            control={control}
            data-testid="additional-instructions-input"
          />
        </Grid>
        <Grid item xs={12}>
          <PrimaryButton disabled={!isValid} onClick={handleSubmit(onSubmit)} data-testid="continue-btn">
            {labelByKey('continue')}
          </PrimaryButton>
        </Grid>
      </Grid>
      <BeneficiaryNoteModal
        onContinue={handleSubmit(toNextStep)}
        onClose={noteConfirmationModal.close}
        {...noteConfirmationModal.props}
      />
    </form>
  );

  function toNextStep(values: BeneficiaryLumpSumType) {
    nextStep(
      {
        lumpSumPercentage: values.lumpSumPercentage,
        isPensionBeneficiary: values.isPensionBeneficiary ? true : false,
        notes: values.notes,
      },
      false,
      isDirty,
    );
  }

  function onSubmit(values: BeneficiaryLumpSumType) {
    noteConfirmationModal.open();
  }
};
