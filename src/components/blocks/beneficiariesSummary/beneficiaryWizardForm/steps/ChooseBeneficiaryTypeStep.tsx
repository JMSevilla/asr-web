import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useGlobalsContext } from '../../../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../../../core/contexts/JourneyIndicatorContext';
import { PrimaryButton } from '../../../../buttons';
import { RadioButtonsField } from '../../../../form';
import { useBeneficiaryWizardFormContext } from '../BeneficiaryWizardFormContext';
import { BeneficiaryChooseType, BeneficiaryFormType } from '../types';

interface Props {
  nextStep(values: Partial<BeneficiaryFormType>): void;
  previousStep(): void;
  values: Partial<BeneficiaryFormType>;
}

const chooseBeneficiaryTypeStepFormSchema = yup.object({
  type: yup.mixed<BeneficiaryChooseType>().oneOf(['PERSON', 'CHARITY']).required(),
});

type ChooseBeneficiaryTypeStepFormType = yup.InferType<typeof chooseBeneficiaryTypeStepFormSchema>;

export const ChooseBeneficiaryTypeStep: FC<Props> = ({ nextStep, previousStep, values }) => {
  const { panelByKey } = useBeneficiaryWizardFormContext();

  const { labelByKey } = useGlobalsContext();
  const { setCustomHeader } = useJourneyIndicatorContext();
  const { control, formState, handleSubmit, reset } = useForm<ChooseBeneficiaryTypeStepFormType>({
    resolver: yupResolver(chooseBeneficiaryTypeStepFormSchema),
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const radioButtons = [
    {
      value: 'PERSON',
      label: labelByKey('benef_person'),
    },
    {
      value: 'CHARITY',
      label: labelByKey('benef_charity'),
    },
  ];

  useEffect(() => {
    setCustomHeader({
      title: labelByKey('benef_choose_type_header'),
      action: previousStep,
    });

    return () => setCustomHeader({ title: null, action: null, icon: null });
  }, []);

  useEffect(() => {
    reset({
      type: values.type,
    });
  }, [values.type]);

  const [panel1, panel2] = [panelByKey('beneficiary_type_panel_1'), panelByKey('beneficiary_type_panel_2')];

  return (
    <form>
      <Grid container spacing={12}>
        {panel1 && <Grid item>{panel1}</Grid>}
        <Grid xs={12} item>
          <RadioButtonsField name="type" control={control} buttons={radioButtons} />
        </Grid>
        {panel2 && <Grid item>{panel2}</Grid>}
        <Grid item xs={12}>
          <PrimaryButton disabled={!formState.isValid} onClick={handleSubmit(onSubmit)} data-testid="continue-btn">
            {labelByKey('continue')}
          </PrimaryButton>
        </Grid>
      </Grid>
    </form>
  );

  function onSubmit(values: ChooseBeneficiaryTypeStepFormType) {
    nextStep({ type: values.type });
  }
};
