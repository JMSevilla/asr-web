import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGlobalsContext } from '../../../../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../../../../core/contexts/JourneyIndicatorContext';
import { useModal } from '../../../../../../core/hooks/useModal';
import { PrimaryButton } from '../../../../../buttons';
import { NumberField, TextAreaField } from '../../../../../form';
import { BeneficiaryNoteModal } from '../../../modals/BeneficiaryNoteModal';
import { useBeneficiaryWizardFormContext } from '../../BeneficiaryWizardFormContext';
import { BeneficiaryFormType, CharityBeneficiaryLumpSumType } from '../../types';
import { charityBeneficiaryLumpSumSchema } from '../../validation';

interface Props {
  nextStep(values: Partial<BeneficiaryFormType>, filter?: boolean, isDirty?: boolean): void;
  previousStep(): void;
  values: Partial<BeneficiaryFormType>;
}

export const CharityBeneficiaryLumpSumStep: FC<Props> = ({ nextStep, previousStep, values }) => {
  const { panelByKey, form } = useBeneficiaryWizardFormContext();
  const { labelByKey } = useGlobalsContext();
  const { setCustomHeader } = useJourneyIndicatorContext();
  const noteConfirmationModal = useModal();
  const { control, formState, handleSubmit, watch, reset } = useForm<CharityBeneficiaryLumpSumType>({
    resolver: yupResolver(charityBeneficiaryLumpSumSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: charityBeneficiaryLumpSumSchema.getDefault(),
  });

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
      notes: values?.notes,
    });
  }, [values]);

  const [panel1, panel2] = [panelByKey('beneficiary_lump_sum_panel_1'), panelByKey('beneficiary_lump_sum_charity_1')];

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
          <Grid item xs={12} mt={-8}>
            {panel2}
          </Grid>
        )}
        <Grid item xs={12} mt={-8}>
          <TextAreaField
            placeholder={labelByKey('beneficiary_payment_instructions')}
            name="notes"
            control={control}
            data-testid="additional-instructions-input"
          />
        </Grid>
        <Grid item xs={12}>
          <PrimaryButton disabled={!isValid} onClick={handleSubmit(onSubmit)}>
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

  function toNextStep(values: CharityBeneficiaryLumpSumType) {
    nextStep(
      {
        lumpSumPercentage: values.lumpSumPercentage,
        isPensionBeneficiary: values.isPensionBeneficiary,
        notes: values.notes,
      },
      false,
      isDirty,
    );
  }

  function onSubmit(values: CharityBeneficiaryLumpSumType) {
    noteConfirmationModal.open();
  }
};
