import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import {
  CloseAppButton,
  ContentButtonBlock,
  ListLoader,
  NumberField,
  PrimaryButton,
  SelectField,
  TextField,
} from '../..';
import { DEFAULT_BANK_ACCOUNT_CURRENCY, DEFAULT_PHONE_COUNTRY_CODE } from '../../../business/constants';
import { countryCurrencyByCode, isIbanMandatoryByCountryCode } from '../../../business/country';
import { constructBankAccountCurriencies } from '../../../business/currency';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { CountrySelectField } from '../../form/CountrySelectField';
import { BankDetailsFormType, bankDetailsFormSchema } from './validation';

interface Props {
  id?: string;
  submitLoading: boolean;
  initialData: BankDetailsFormType;
  currentData: BankDetailsFormType;
  saveAndExitButtonKey?: string;
  isValidating: boolean;
  pageKey: string;
  isCloseButtonHidden: boolean;
  isLoading?: boolean;
  onSubmit: (values: BankDetailsFormType, isDirty: boolean) => void;
}

export const BankDetailsForm: React.FC<Props> = ({
  id,
  submitLoading,
  initialData,
  currentData,
  isValidating,
  isCloseButtonHidden,
  saveAndExitButtonKey,
  isLoading,
  onSubmit,
}) => {
  const { labelByKey, tooltipByKey, messageByKey, htmlByKey, buttonByKey } = useGlobalsContext();
  const { handleSubmit, control, watch, getValues, setFocus, clearErrors, reset, resetField, setValue } =
    useForm<BankDetailsFormType>({
      resolver: yupResolver(bankDetailsFormSchema),
      mode: 'onChange',
      defaultValues: initialData || bankDetailsFormSchema.getDefault(),
      criteriaMode: 'all',
    });
  const country = watch('bankCountryCode');
  const isUk = country === DEFAULT_PHONE_COUNTRY_CODE;
  const isIbanMandatory = useMemo(() => isIbanMandatoryByCountryCode(country), [country]);
  const [accountCurrencyOptions, setAccountCurrencyOptions] = useState(currencyOptionsByCountry(country).options);
  const bankCountryTooltip = tooltipByKey('bank_country_tooltip');
  const saveAndExitButton = saveAndExitButtonKey ? buttonByKey(saveAndExitButtonKey) : null;
  const { errors, isDirty, dirtyFields, isValid } = useFormState({ control });

  useFormFocusOnError<BankDetailsFormType>(errors, setFocus);

  useEffect(() => {
    if (JSON.stringify(initialData) !== JSON.stringify(getValues())) {
      reset(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (currentData) {
      reset(currentData);
    }
  }, [reset, currentData]);

  useEffect(() => {
    resetFieldsFn();
    const { currency, options } = currencyOptionsByCountry(country);
    setAccountCurrencyOptions(options);
    setValue('accountCurrency', currency ?? DEFAULT_BANK_ACCOUNT_CURRENCY);
  }, [country]);

  return (
    <Grid id={id} container spacing={8}>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          {htmlByKey(`bank_form_description`)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {isValidating ? (
          <ListLoader loadersCount={3} />
        ) : (
          <form data-testid="bank_form">
            <Grid container gap={12}>
              <Grid container lg={6} gap={12}>
                <Grid item xs={8}>
                  <CountrySelectField
                    name="bankCountryCode"
                    control={control}
                    tooltip={bankCountryTooltip}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item container gap={6}>
                  <Grid item xs={12}>
                    <TextField
                      name="accountName"
                      control={control}
                      label={labelByKey('bank_account_name')}
                      placeholder={labelByKey('bank_account_name_placeholder')}
                      errorTooltip={tooltipByKey('bank_account_name_error_tooltip')}
                      tooltip={tooltipByKey('bank_account_name_tooltip')}
                      isLoading={isLoading}
                      onBlur={() => clearErrors()}
                    />
                  </Grid>
                  {!isUk && (
                    <Grid item xs={12}>
                      <SelectField
                        name="accountCurrency"
                        control={control}
                        options={accountCurrencyOptions}
                        label={labelByKey('bank_bank_account_currency')}
                        placeholder={labelByKey('bank_bank_account_currency_placeholder')}
                        tooltip={tooltipByKey('bank_bank_account_currency_tooltip')}
                      />
                    </Grid>
                  )}
                  {!isIbanMandatory && (
                    <Grid item xs={12}>
                      <NumberField
                        name="accountNumber"
                        control={control}
                        label={labelByKey('bank_account_number')}
                        tooltip={tooltipByKey('bank_account_number_tooltip')}
                        placeholder={labelByKey('bank_account_number_placeholder')}
                        errorTooltip={tooltipByKey('bank_account_number_error_tooltip')}
                        defaultValue={initialData?.accountNumber}
                        allowLeadingZeros
                      />
                    </Grid>
                  )}
                  {isUk && (
                    <Grid item xs={12}>
                      <NumberField
                        name="sortCode"
                        control={control}
                        label={labelByKey('bank_sort_code')}
                        placeholder={labelByKey('bank_sort_code_placeholder')}
                        errorTooltip={tooltipByKey('bank_sort_code_error_tooltip')}
                        defaultValue={initialData.sortCode}
                        isLoading={isLoading}
                        allowLeadingZeros
                        onBlur={() => clearErrors()}
                        format="##-##-##"
                      />
                    </Grid>
                  )}
                  {isIbanMandatory && (
                    <Grid item xs={12}>
                      <TextField
                        name="iban"
                        control={control}
                        label={labelByKey('bank_iban')}
                        tooltip={tooltipByKey('bank_iban_tooltip')}
                        placeholder={labelByKey('bank_iban_placeholder')}
                        errorTooltip={tooltipByKey('bank_iban_error_tooltip')}
                      />
                    </Grid>
                  )}
                  {!isUk && !isIbanMandatory && (
                    <Grid item xs={12}>
                      <TextField
                        name="clearingCode"
                        control={control}
                        label={labelByKey('bank_clearing_code')}
                        placeholder={labelByKey('bank_clearing_code_placeholder')}
                        tooltip={tooltipByKey('bank_clearing_code_tooltip')}
                        errorTooltip={tooltipByKey('bank_clearing_code_error_tooltip')}
                        isLoading={isLoading}
                        onBlur={() => clearErrors()}
                      />
                    </Grid>
                  )}
                  {!isUk && (
                    <Grid item xs={12}>
                      <TextField
                        name="bic"
                        control={control}
                        label={labelByKey('bank_bic')}
                        placeholder={labelByKey('bank_bic_placeholder')}
                        tooltip={tooltipByKey('bank_bic_notes')}
                        errorTooltip={tooltipByKey('bank_bic_error_tooltip')}
                        isLoading={isLoading}
                        onBlur={() => clearErrors()}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {!isUk && (
                <Grid item xs={12}>
                  {messageByKey('bank_details_form_note_sterling')}
                </Grid>
              )}
              <Grid item xs={12} container spacing={4}>
                <Grid item>
                  <PrimaryButton
                    onClick={handleSubmit(handleFormSubmit)}
                    loading={submitLoading}
                    data-testid="continue"
                    disabled={!isValid}
                  >
                    {labelByKey('continue')}
                  </PrimaryButton>
                </Grid>
                {saveAndExitButton && (
                  <Grid item>
                    <ContentButtonBlock {...saveAndExitButton} disabled={isDirty} />
                  </Grid>
                )}
                {!isCloseButtonHidden && !saveAndExitButton && (
                  <Grid item>
                    <CloseAppButton disabled={isDirty} />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      </Grid>
    </Grid>
  );

  function currencyOptionsByCountry(country: string) {
    const currency = countryCurrencyByCode(country);
    const options = constructBankAccountCurriencies(currency);

    return { options, currency };
  }

  function handleFormSubmit(values: BankDetailsFormType) {
    onSubmit(values, isDirty);
  }

  function resetFieldsFn() {
    resetField('accountNumber', { defaultValue: !!dirtyFields.bankCountryCode ? '' : initialData?.accountNumber });
    resetField('sortCode', { defaultValue: !!dirtyFields.bankCountryCode ? '' : initialData?.sortCode });
    resetField('bic', { defaultValue: !!dirtyFields.bankCountryCode ? '' : initialData?.bic });
    resetField('clearingCode', { defaultValue: !!dirtyFields.bankCountryCode ? '' : initialData?.clearingCode });
    resetField('iban', { defaultValue: !!dirtyFields.bankCountryCode ? '' : initialData?.iban });
  }
};
