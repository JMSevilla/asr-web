import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CloseAppButton, ContentButtonBlock, PhoneField, PrimaryButton, SecondaryButton } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { PhoneFormType, phoneFormSchema } from './validation';

interface Props {
  id?: string;
  submitLoading: boolean;
  initialData: PhoneFormType;
  isCloseButtonHidden: boolean;
  saveAndExitButtonKey?: string;
  countryCode: string;
  isLoading?: boolean;
  isStandAlone?: boolean;
  isDirty?: boolean;
  onClosed(): void;
  onSubmit(values: PhoneFormType, isDirty: boolean): void;
  onCountryCodeChanged(code: string): void;
  submitError?: Error;
}

export const PhoneForm: React.FC<Props> = ({
  id,
  submitLoading,
  initialData,
  isCloseButtonHidden,
  saveAndExitButtonKey,
  countryCode,
  isLoading,
  isStandAlone,
  isDirty,
  onClosed,
  onSubmit,
  onCountryCodeChanged,
  submitError,
}) => {
  const { labelByKey, tooltipByKey, messageByKey, htmlByKey, buttonByKey } = useGlobalsContext();
  const { handleSubmit, control, formState, setFocus, clearErrors, trigger, setError } = useForm<PhoneFormType>({
    resolver: yupResolver(phoneFormSchema(countryCode)),
    mode: 'all',
    defaultValues: initialData,
    criteriaMode: 'all',
  });
  const saveAndExitButton = saveAndExitButtonKey ? buttonByKey(saveAndExitButtonKey) : null;

  useEffect(() => {
    trigger('phone');
  }, [countryCode]);

  useEffect(() => {
    if (submitError) {
      setError('phone', { type: 'custom', message: 'phone_field_submit_error' });
    }
  }, [submitError]);

  useFormFocusOnError<PhoneFormType>(formState.errors, setFocus);

  const formIsDirty = isDirty || formState.isDirty;

  return (
    <Grid id={id} container spacing={8}>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          {htmlByKey(`phone_confirmation_form_description`)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form data-testid="phone_form">
          <Grid container spacing={12}>
            <Grid item>
              <PhoneField
                name="phone"
                control={control}
                label={labelByKey('phone_confirmation_form_label')}
                placeholder={labelByKey('phone_confirmation_form_placeholder')}
                errorTooltip={
                  countryCode === 'GB'
                    ? tooltipByKey('phone_form_gb_error_tooltip')
                    : tooltipByKey('phone_form_error_tooltip')
                }
                tooltip={tooltipByKey('phone_confirmation_form_tooltip')}
                defaultValue={initialData.phone}
                countryCode={countryCode}
                onCountryCodeChanged={onCountryCodeChanged}
                isLoading={isLoading}
                onBlur={() => clearErrors()}
                onFocus={() => trigger()}
              />
            </Grid>
            <Grid item xs={12}>
              {messageByKey('phone_confirmation_form_note')}
            </Grid>
            <Grid item xs={12} container spacing={4}>
              <Grid item>
                <PrimaryButton
                  onClick={handleSubmit(handleFormSubmit)}
                  loading={submitLoading}
                  disabled={(isStandAlone && !formIsDirty) || !formState.isValid}
                  data-testid="phone-form-continue"
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
                  <ContentButtonBlock {...saveAndExitButton} disabled={formIsDirty} />
                </Grid>
              )}
              {!isStandAlone && !isCloseButtonHidden && !saveAndExitButton && (
                <Grid item>
                  <CloseAppButton disabled={formIsDirty} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );

  function handleFormSubmit(values: PhoneFormType) {
    onSubmit(values, formIsDirty);
  }
};
