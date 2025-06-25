import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import {
  AddressLookupField,
  CloseAppButton,
  ContentButtonBlock,
  CountrySelectField,
  PrimaryButton,
  SecondaryButton,
  TextField,
} from '../..';
import { Address, AddressSummary, SearchAddressParams } from '../../../api/mdp/types';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { AddressFormType, addressFormSchema } from './validation';

interface Props {
  submitLoading: boolean;
  initialData: Partial<AddressFormType>;
  isCloseButtonHidden: boolean;
  saveAndExitButtonKey?: string;
  exitPageKey?: string;
  isLoading?: boolean;
  isStandAlone?: boolean;
  onClosed(): void;
  onSubmit(values: AddressFormType): void;
  onAddressDetailsLookup(addressId: string): Promise<Address[]>;
  onAddressSummaryLookup(params: SearchAddressParams): Promise<AddressSummary[]>;
}

export const AddressForm: React.FC<Props> = ({
  submitLoading,
  initialData,
  isCloseButtonHidden,
  saveAndExitButtonKey,
  isLoading,
  isStandAlone,
  onClosed,
  onSubmit,
  onAddressDetailsLookup,
  onAddressSummaryLookup,
}) => {
  const [lookup, setLookup] = useState<AddressFormType | null>(null);
  const { labelByKey, tooltipByKey, messageByKey, buttonByKey } = useGlobalsContext();
  const { handleSubmit, control, reset, setFocus, watch, clearErrors } = useForm<AddressFormType>({
    resolver: yupResolver(addressFormSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: { ...addressFormSchema.getDefault(), ...initialData },
  });
  const { isValid, isDirty, errors } = useFormState({ control });
  const saveAndExitButton = saveAndExitButtonKey ? buttonByKey(saveAndExitButtonKey) : null;

  useFormFocusOnError<AddressFormType>(errors, setFocus);

  useEffect(() => {
    if (lookup) {
      reset(lookup);
      return;
    }
    reset(initialData);
  }, [lookup]);

  return (
    <form data-testid="address_form">
      <Grid container spacing={12}>
        <Grid item container lg={isStandAlone ? 12 : 5} spacing={6}>
          <Grid item xs={12}>
            <AddressLookupField
              id="address-lookup-field"
              label={labelByKey('lookup_field_title')}
              placeholder={labelByKey('address_lookup_placeholder')}
              country={watch('countryCode')}
              onAddressChanged={handleLookupChange}
              onAddressDetailsLookup={onAddressDetailsLookup}
              onAddressSummaryLookup={onAddressSummaryLookup}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="addressLine1"
              control={control}
              label={labelByKey('address_line_1')}
              placeholder={labelByKey('address_line_1_placeholder')}
              errorTooltip={tooltipByKey('address_line_1_error_tooltip')}
              isLoading={isLoading}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="addressLine2"
              control={control}
              label={labelByKey('address_line_2')}
              errorTooltip={tooltipByKey('address_line_2_error_tooltip')}
              isLoading={isLoading}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="addressLine3"
              control={control}
              label={labelByKey('address_line_3')}
              errorTooltip={tooltipByKey('address_line_3_error_tooltip')}
              isLoading={isLoading}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="addressLine4"
              control={control}
              label={labelByKey('address_line_4')}
              errorTooltip={tooltipByKey('address_line_4_error_tooltip')}
              isLoading={isLoading}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="addressLine5"
              control={control}
              label={labelByKey('address_line_5')}
              errorTooltip={tooltipByKey('address_line_5_error_tooltip')}
              isLoading={isLoading}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="postCode"
              control={control}
              label={labelByKey('address_postCode_2')}
              errorTooltip={tooltipByKey('address_postCode_error_tooltip')}
              isLoading={isLoading}
              onBlur={() => clearErrors()}
            />
          </Grid>
          <Grid item xs={12}>
            <CountrySelectField name="countryCode" control={control} isLoading={isLoading} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {messageByKey('address_form_note')}
        </Grid>
        <Grid item xs={12} container spacing={4}>
          <Grid item>
            <PrimaryButton
              onClick={handleSubmit(handleFormSubmit)}
              loading={submitLoading}
              disabled={isStandAlone && (!isValid || !isDirty) && !lookup}
              data-testid="continue"
            >
              {labelByKey('continue')}
            </PrimaryButton>
          </Grid>
          {isStandAlone && (
            <Grid item>
              <SecondaryButton onClick={onClosed} data-testid="close">
                {labelByKey('close')}
              </SecondaryButton>
            </Grid>
          )}
          {!isStandAlone && saveAndExitButton && (
            <Grid item>
              <ContentButtonBlock {...saveAndExitButton} disabled={isDirty || !!lookup} />
            </Grid>
          )}
          {!isStandAlone && !isCloseButtonHidden && !saveAndExitButton && (
            <Grid item>
              <CloseAppButton disabled={isDirty || !!lookup} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </form>
  );

  function handleFormSubmit(address: AddressFormType) {
    onSubmit(address);
  }

  function handleLookupChange(address: Address) {
    const secondLine = [address.line2, address.line3, address.line4, address.line5].filter(Boolean);

    setLookup({
      addressLine1: address.line1,
      addressLine2: secondLine.length ? secondLine.join(' ') : address.city,
      addressLine3: secondLine.length ? address.city : '',
      addressLine4: '',
      addressLine5: '',
      countryCode: address.countryIso2,
      postCode: address.postalCode,
      city: address.city,
    });
  }
};
