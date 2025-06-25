import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { PrimaryButton, RadioButtonFieldOption, RadioButtonsField } from '../../../../..';
import { DEFAULT_PHONE_COUNTRY_CODE } from '../../../../../../business/constants';
import { useGlobalsContext } from '../../../../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../../../../core/contexts/JourneyIndicatorContext';
import { useBeneficiaryWizardFormContext } from '../../BeneficiaryWizardFormContext';
import { BeneficiaryAddressFormType, BeneficiaryFormType } from '../../types';
interface Props {
  values: Partial<BeneficiaryFormType>;
  nextStep(values: Partial<BeneficiaryFormType>, filter?: boolean, isDirty?: boolean): void;
  previousStep(): void;
  resetValues(): void;
}

const beneficiaryChooseOrAddNewFormSchema = yup.object({
  optionId: yup.string().required(),
});

type BeneficiaryChooseOrAddNewFormType = yup.InferType<typeof beneficiaryChooseOrAddNewFormSchema>;

export const ChoosePersonBeneficiaryOrAddNewStep: FC<Props> = ({ nextStep, previousStep, values, resetValues }) => {
  const { panelByKey, dependants } = useBeneficiaryWizardFormContext();
  const { labelByKey } = useGlobalsContext();
  const { setCustomHeader } = useJourneyIndicatorContext();
  const { control, formState, handleSubmit, reset } = useForm<BeneficiaryChooseOrAddNewFormType>({
    resolver: yupResolver(beneficiaryChooseOrAddNewFormSchema),
    mode: 'onChange',
    criteriaMode: 'all',
  });

  useEffect(() => {
    setCustomHeader({
      title: labelByKey('benef_choose_existing_or_add_new_header'),
      action: previousStep,
    });

    return () => setCustomHeader({ title: null, action: null, icon: null });
  }, []);

  useEffect(() => {
    reset({
      optionId: values?.optionId?.toString() ?? undefined,
    });
  }, [values]);

  const buttons = useMemo(() => {
    const radioButtons = (dependants ?? [])
      .filter(x => !!x.optionId && x.relationship !== 'Charity')
      .map(value => ({
        value: value.optionId,
        label: `${value.forenames ?? ''} ${value.surname ?? ''} (${value.relationship})`,
      }));

    return [
      ...radioButtons,
      {
        value: '1',
        label: labelByKey('choose_beneficiary_someone_new'),
      } as RadioButtonFieldOption,
    ];
  }, [dependants]);

  const [panel1, panel2] = [panelByKey('dependants_panel_1'), panelByKey('dependants_panel_2')];

  return (
    <form>
      <Grid container spacing={12}>
        {panel1 && <Grid item>{panel1}</Grid>}
        <Grid xs={12} item mt={-6}>
          <RadioButtonsField name="optionId" control={control} buttons={buttons} />
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

  function onSubmit(values: BeneficiaryChooseOrAddNewFormType) {
    const existingDependant = dependants?.find(x => x.optionId === values.optionId);

    if (values.optionId && existingDependant) {
      nextStep(
        {
          ...existingDependant,
          address: {
            ...(existingDependant?.address ?? {}),
          } as BeneficiaryAddressFormType,
        },
        true,
        true,
      );
      return;
    }

    resetValues();
    nextStep(
      {
        type: 'PERSON',
        relationship: null,
        forenames: '',
        surname: '',
        dateOfBirth: null,
        address: {
          city: '',
          country: DEFAULT_PHONE_COUNTRY_CODE,
          countryCode: '',
          line1: '',
          line2: '',
          line3: '',
          line4: '',
          line5: '',
          postCode: '',
        },
      },
      true,
      true,
    );
  }
};
