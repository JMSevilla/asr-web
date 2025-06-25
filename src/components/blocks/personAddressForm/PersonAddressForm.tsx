import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AddressLookupField, CountrySelectField, TextField } from '../..';
import { Address, AddressSummary, SearchAddressParams } from '../../../api/mdp/types';
import { countryByCode } from '../../../business/country';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { PersonAddressFormType, personAddressFormSchema } from './validation';

interface Props {
  prefix: string;
  defaultValues?: PersonAddressFormType;
  exitPageKey?: string;
  isOptional?: boolean;
  onSubmit(values: PersonAddressFormType): Promise<void>;
  onAddressDetailsLookup(addressId: string): Promise<Address[]>;
  onAddressSummaryLookup(params: SearchAddressParams): Promise<AddressSummary[]>;
}

export const PersonAddressForm: React.FC<Props> = ({
  prefix,
  defaultValues,
  isOptional = false,
  onSubmit,
  onAddressDetailsLookup,
  onAddressSummaryLookup,
}) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const validationSchema = personAddressFormSchema(prefix, isOptional);
  const form = useForm<PersonAddressFormType>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: { ...validationSchema.getDefault(), ...defaultValues },
    criteriaMode: 'all',
  });
  const countryCode = form.watch('address.countryCode');

  useFormFocusOnError<PersonAddressFormType>(form.formState.errors, form.setFocus);
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

  useEffect(() => {
    form.setValue('address.countryName', countryByCode(countryCode));
  }, [countryCode]);

  return (
    <Grid component="form" data-testid={`${prefix}_form`} container spacing={6}>
      <Grid item xs={12}>
        <AddressLookupField
          id="address-lookup-field"
          label={labelByKey(`${prefix}_lookup`)}
          placeholder={labelByKey(`${prefix}_lookup_ph`)}
          onAddressChanged={handleLookupChange}
          onAddressDetailsLookup={onAddressDetailsLookup}
          onAddressSummaryLookup={onAddressSummaryLookup}
          country={form.watch('address.countryCode')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="address.line1"
          control={form.control}
          label={labelByKey(`${prefix}_addressLine1`)}
          placeholder={labelByKey(`${prefix}_addressLine1_ph`)}
          errorTooltip={tooltipByKey(`${prefix}_addressLine1_error_tooltip`)}
          onBlur={() => form.clearErrors()}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="address.line2"
          control={form.control}
          label={labelByKey(`${prefix}_addressLine2`)}
          errorTooltip={tooltipByKey(`${prefix}_addressLine2_error_tooltip`)}
          onBlur={() => form.clearErrors()}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="address.line3"
          control={form.control}
          label={labelByKey(`${prefix}_addressLine3`)}
          errorTooltip={tooltipByKey(`${prefix}_addressLine3_error_tooltip`)}
          onBlur={() => form.clearErrors()}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="address.line4"
          control={form.control}
          label={labelByKey(`${prefix}_addressLine4`)}
          errorTooltip={tooltipByKey(`${prefix}_addressLine4_error_tooltip`)}
          onBlur={() => form.clearErrors()}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="address.line5"
          control={form.control}
          label={labelByKey(`${prefix}_addressLine5`)}
          errorTooltip={tooltipByKey(`${prefix}_addressLine5_error_tooltip`)}
          onBlur={() => form.clearErrors()}
        />
      </Grid>
      <Grid item xs={12}>
        <CountrySelectField
          name="address.countryCode"
          control={form.control}
          label={labelByKey(`${prefix}_countryCode`)}
          optional
          displayEmpty
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="address.postCode"
          control={form.control}
          label={labelByKey(`${prefix}_postCode`)}
          errorTooltip={tooltipByKey(`${prefix}_postCode_error_tooltip`)}
          onBlur={() => form.clearErrors()}
        />
      </Grid>
    </Grid>
  );

  function handleLookupChange(address: Address) {
    const secondLine = [address.line2, address.line3, address.line4, address.line5].filter(Boolean);

    form.reset({
      address: {
        line1: address.line1,
        line2: secondLine.length ? secondLine.join(' ') : address.city,
        line3: secondLine.length ? address.city : '',
        line4: '',
        line5: '',
        countryCode: address.countryIso2,
        countryName: countryByCode(address.countryIso2),
        postCode: address.postalCode,
      },
    });

    form.trigger();
  }
};
