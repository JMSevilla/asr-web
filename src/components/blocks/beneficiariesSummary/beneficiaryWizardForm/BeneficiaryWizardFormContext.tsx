import { yupResolver } from '@hookform/resolvers/yup';
import React, { createContext, ReactElement, useContext, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { PanelListItem } from '../../../../api/content/types/page';
import { Beneficiary } from '../../../../api/mdp/types';
import { usePanelBlock } from '../../../../core/hooks/usePanelBlock';
import { useBeneficiariesFormDirtyState } from '../useBeneficiariesFormDirtyState';
import { BeneficiariesFormType, BeneficiaryFormType } from './types';
import { mapBeneficiariesToWizardFormValues } from './utils';
import { beneficiariesSchema } from './validation';

export interface UseBeneficiaryWizardFormContextValue {
  dependants: Partial<BeneficiaryFormType>[];
  form: UseFormReturn<BeneficiariesFormType>;
  isDirty: boolean;
  setIsDirty: (value: boolean) => void;
  onUpdate(values: Partial<BeneficiaryFormType>, filter?: boolean, isDirty?: boolean): void;
  onDelete(valueId: string, shouldDirty?: boolean): void;
  panelByKey(key: string): ReactElement | null;
}

interface BeneficiaryWizardFormContextProviderProps {
  beneficiaries?: Beneficiary[];
  dependants?: Partial<BeneficiaryFormType>[];
  panelList?: PanelListItem[];
  formKey: string;
}

const BeneficiaryWizardFormContext = createContext<UseBeneficiaryWizardFormContextValue>({
  dependants: [] as Partial<BeneficiaryFormType>[],
  form: {} as UseFormReturn<BeneficiariesFormType>,
  onUpdate: () => null,
  onDelete: () => null,
  panelByKey: () => null,
  setIsDirty: () => null,
  isDirty: false,
});

export const useBeneficiaryWizardFormContext = () => useContext(BeneficiaryWizardFormContext);

export const BeneficiaryWizardFormContextProvider: React.FC<
  React.PropsWithChildren<BeneficiaryWizardFormContextProviderProps>
> = ({ children, beneficiaries, dependants, panelList, formKey }) => {
  const { panelByKey } = usePanelBlock(panelList);
  const form = useForm<BeneficiariesFormType>({
    resolver: yupResolver(beneficiariesSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: beneficiariesSchema.getDefault() as BeneficiariesFormType,
  });
  const { isDirty, setIsDirty } = useBeneficiariesFormDirtyState(form.formState);

  useEffect(() => {
    beneficiaries && form.reset({ beneficiaries: mapBeneficiariesToWizardFormValues(beneficiaries) });
  }, [beneficiaries]);

  return (
    <FormProvider {...form}>
      <BeneficiaryWizardFormContext.Provider
        value={useMemo(
          () => ({
            form,
            isDirty,
            dependants: dependants!,
            setIsDirty,
            onDelete: handleBeneficiaryDelete,
            onUpdate: handleBeneficiaryListUpdate,
            panelByKey: (panelKey: string) => panelByKey(`${formKey}_${panelKey}`),
          }),
          [dependants, form, formKey, isDirty, form.watch('beneficiaries')],
        )}
      >
        {children}
      </BeneficiaryWizardFormContext.Provider>
    </FormProvider>
  );

  function handleBeneficiaryListUpdate(values: BeneficiaryFormType, filter?: boolean, isDirty?: boolean) {
    const beneficiaries = form.getValues('beneficiaries');

    if (!beneficiaries) return [values];

    const index = beneficiaries?.findIndex(ben => ben.valueId === values.valueId);
    const valueIdOrValues = filter && !values.valueId ? null : values;
    const updatedBeneficiaries = [
      ...beneficiaries?.map((ben, idx) =>
        index === idx
          ? values
          : { ...ben, isPensionBeneficiary: values.isPensionBeneficiary ? false : ben.isPensionBeneficiary },
      ),
      index < 0 ? valueIdOrValues : null,
    ].filter(Boolean) as BeneficiaryFormType[];

    form.setValue('beneficiaries', updatedBeneficiaries, { shouldDirty: form.formState.isDirty || isDirty });
  }

  function handleBeneficiaryDelete(valueId: string, shouldDirty: boolean = true) {
    const filteredValues = form.getValues('beneficiaries').filter(v => v.valueId !== valueId);
    form.setValue('beneficiaries', filteredValues, { shouldDirty });
  }
};
