import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { CloseAppButton, ContentButtonBlock, PrimaryButton, SecondaryButton, TextField } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { EmailsFormType, emailFormSchema } from './validation';

interface Props {
  id?: string;
  submitLoading: boolean;
  initialData: EmailsFormType;
  pageKey: string;
  isCloseButtonHidden: boolean;
  saveAndExitButtonKey?: string;
  isLoading?: boolean;
  isStandAlone?: boolean;
  onClosed(): void;
  onSubmit(values: EmailsFormType, isDirty: boolean): void;
  errorTooltipDisabled?: boolean;
}

export const EmailForm: React.FC<Props> = ({
  id,
  submitLoading,
  initialData,
  isCloseButtonHidden,
  saveAndExitButtonKey,
  isStandAlone,
  isLoading,
  errorTooltipDisabled,
  onClosed,
  onSubmit,
}) => {
  const { labelByKey, tooltipByKey, messageByKey, htmlByKey, buttonByKey } = useGlobalsContext();
  const { handleSubmit, control, formState, setFocus, clearErrors } = useForm<EmailsFormType>({
    resolver: yupResolver(emailFormSchema),
    mode: 'onChange',
    defaultValues: initialData,
    criteriaMode: 'all',
  });
  const saveAndExitButton = saveAndExitButtonKey ? buttonByKey(saveAndExitButtonKey) : null;

  useFormFocusOnError<EmailsFormType>(formState.errors, setFocus);

  return (
    <Grid id={id} container spacing={8}>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          {htmlByKey(`email_confirmation_form_description`)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form data-testid="email_form">
          <Grid container spacing={12}>
            <Grid item lg={isStandAlone ? 12 : 5}>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  control={control}
                  label={labelByKey('email_confirmation_form_label')}
                  placeholder={labelByKey('email_confirmation_form_placeholder')}
                  errorTooltip={tooltipByKey('email_confirmation_form_error_tooltip')}
                  tooltip={tooltipByKey('email_confirmation_form_tooltip')}
                  isLoading={isLoading}
                  errorTooltipDisabled={errorTooltipDisabled}
                  onBlur={() => clearErrors()}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {messageByKey('email_confirmation_form_note')}
            </Grid>
            <Grid item xs={12} container spacing={4}>
              <Grid item>
                <PrimaryButton
                  onClick={handleSubmit(handleFormSubmit)}
                  loading={submitLoading}
                  disabled={isStandAlone && !formState.isDirty}
                  data-testid="continue"
                >
                  {labelByKey('continue')}
                </PrimaryButton>
              </Grid>
              {renderSecondaryButton()}
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );

  function renderSecondaryButton() {
    if (isStandAlone) {
      return (
        <Grid item>
          <SecondaryButton onClick={onClosed} data-testid="close">
            {labelByKey('close')}
          </SecondaryButton>
        </Grid>
      );
    }

    if (saveAndExitButton) {
      return (
        <Grid item>
          <ContentButtonBlock {...saveAndExitButton} disabled={formState.isDirty} />
        </Grid>
      );
    }

    if (!isCloseButtonHidden) {
      return (
        <Grid item>
          <CloseAppButton disabled={formState.isDirty} />
        </Grid>
      );
    }

    return null;
  }

  function handleFormSubmit(values: EmailsFormType) {
    onSubmit(values, formState.isDirty || values.email !== initialData.email);
  }
};
