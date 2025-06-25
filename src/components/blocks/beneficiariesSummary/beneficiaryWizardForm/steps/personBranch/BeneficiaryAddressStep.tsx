import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AddressLookupField, CountrySelectField, PrimaryButton, TextField } from '../../../../..';
import { Address, SearchAddressParams } from '../../../../../../api/mdp/types';
import { COUNTRY_LIST, DEFAULT_PHONE_COUNTRY_CODE } from '../../../../../../business/constants';
import { useGlobalsContext } from '../../../../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../../../../core/contexts/JourneyIndicatorContext';
import { useApiCallback } from '../../../../../../core/hooks/useApi';
import { useBeneficiaryWizardFormContext } from '../../BeneficiaryWizardFormContext';
import { BeneficiaryAddressFormType, BeneficiaryFormType } from '../../types';
import { beneficiaryAddressSchema } from '../../validation';

interface Props {
  nextStep(values: Partial<BeneficiaryFormType>, filter?: boolean, isDirty?: boolean): void;
  previousStep(): void;
  values: Partial<BeneficiaryFormType>;
}

export const BeneficiaryAddressStep: FC<Props> = ({ nextStep, previousStep, values }) => {
  const { panelByKey } = useBeneficiaryWizardFormContext();
  const [lookup, setLookup] = useState<Address | null>(null);
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const { setCustomHeader } = useJourneyIndicatorContext();
  const addressDetailsCb = useApiCallback((api, id: string) => api.mdp.addressDetails(id));
  const addressSummaryCb = useApiCallback((api, params: SearchAddressParams) => api.mdp.addressSummary(params));
  const { handleSubmit, reset, formState, control, clearErrors, watch } = useForm<BeneficiaryAddressFormType>({
    resolver: yupResolver(beneficiaryAddressSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: beneficiaryAddressSchema.getDefault(),
  });

  const countryCode = watch('countryCode', DEFAULT_PHONE_COUNTRY_CODE);
  const { isDirty } = formState;

  useEffect(() => {
    setCustomHeader({
      title: labelByKey('benef_address_header'),
      action: previousStep,
    });

    return () => setCustomHeader({ title: null, action: null, icon: null });
  }, []);

  useEffect(() => {
    if (!lookup) return;

    reset({
      line1: lookup.line1,
      line2: lookup.line2,
      line3: lookup.line3,
      line4: lookup.line4,
      line5: lookup.line5 || lookup.city,
      countryCode: lookup.countryIso2,
      postCode: lookup.postalCode,
    });
  }, [lookup]);

  useEffect(() => {
    if (!values) return;

    reset({
      line1: values?.address?.line1 ?? '',
      line2: values?.address?.line2 ?? '',
      line3: values?.address?.line3 ?? '',
      line4: values?.address?.line4 ?? '',
      line5: values?.address?.line5 ?? '',
      countryCode: values?.address?.countryCode,
      postCode: values?.address?.postCode,
    });
  }, [values]);

  const [panel1, panel2] = [panelByKey('beneficiary_address_panel_1'), panelByKey('beneficiary_address_panel_2')];

  return (
    <Grid mb={12}>
      <form data-testid="address_form">
        <Grid container spacing={12}>
          {panel1 && (
            <Grid item xs={12}>
              {panel1}
            </Grid>
          )}
          <Grid item container xs={8} spacing={12} mt={-12}>
            <Grid item xs={12}>
              <AddressLookupField
                id="address-lookup-field"
                label={labelByKey('lookup_field_title')}
                placeholder={labelByKey('address_lookup_placeholder')}
                country={countryCode}
                onAddressChanged={setLookup}
                onAddressDetailsLookup={handleAddressDetailsLookup}
                onAddressSummaryLookup={handleAddressSummaryLookup}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="line1"
                control={control}
                label={labelByKey('address_line_1')}
                placeholder={labelByKey('address_line_1_placeholder')}
                errorTooltip={tooltipByKey('address_line_1_error_tooltip')}
                onBlur={() => clearErrors()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="line2"
                control={control}
                label={labelByKey('address_line_2')}
                errorTooltip={tooltipByKey('address_line_2_error_tooltip')}
                onBlur={() => clearErrors()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="line3"
                control={control}
                label={labelByKey('address_line_3')}
                errorTooltip={tooltipByKey('address_line_3_error_tooltip')}
                onBlur={() => clearErrors()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="line4"
                control={control}
                label={labelByKey('address_line_4')}
                errorTooltip={tooltipByKey('address_line_4_error_tooltip')}
                onBlur={() => clearErrors()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="line5"
                control={control}
                label={labelByKey('address_line_5')}
                errorTooltip={tooltipByKey('address_line_5_error_tooltip')}
                onBlur={() => clearErrors()}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="postCode"
                control={control}
                label={labelByKey('address_postCode_2')}
                errorTooltip={tooltipByKey('address_postCode_error_tooltip')}
                onBlur={() => clearErrors()}
              />
            </Grid>
            <Grid item xs={12}>
              <CountrySelectField name="countryCode" control={control} />
            </Grid>
          </Grid>
          {panel2 && (
            <Grid item xs={12}>
              {panel2}
            </Grid>
          )}
          <Grid item xs={12}>
            <PrimaryButton onClick={handleSubmit(onSubmit)} data-testid="continue-btn">
              {labelByKey('continue')}
            </PrimaryButton>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );

  async function handleAddressDetailsLookup(addressId: string) {
    const result = await addressDetailsCb.execute(addressId);
    return result?.data;
  }

  async function handleAddressSummaryLookup(params: SearchAddressParams) {
    const result = await addressSummaryCb.execute(params);
    return result?.data;
  }

  function onSubmit(formValues: BeneficiaryAddressFormType) {
    const countryName = COUNTRY_LIST.find(flag => flag.countryCode === formValues.countryCode)?.countryName;

    nextStep(
      {
        address: {
          ...formValues,
          country: countryName,
        },
      },
      false,
      isDirty,
    );
  }
};
