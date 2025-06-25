import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { PrimaryButton, TextField } from '../..';
import { PanelListItem } from '../../../api/content/types/page';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { emailFormSchema, EmailsFormType } from './validation';

interface Props {
  id?: string;
  submitLoading: boolean;
  initialData: EmailsFormType;
  pageKey: string;
  isLoading?: boolean;
  isStandAlone?: boolean;
  isDisabled: boolean;
  panelList?: PanelListItem[];
  errorTooltipDisabled?: boolean;
  onSubmit(values: EmailsFormType): void;
}

export const EmailVerificationForm: React.FC<Props> = ({
  id,
  submitLoading,
  initialData,
  isLoading,
  onSubmit,
  errorTooltipDisabled,
  panelList,
  isDisabled,
}) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();

  const { panelByKey } = usePanelBlock(panelList);
  const { handleSubmit, control, formState, setFocus, clearErrors } = useForm<EmailsFormType>({
    resolver: yupResolver(emailFormSchema),
    mode: 'onChange',
    defaultValues: initialData,
    criteriaMode: 'all',
  });

  useFormFocusOnError<EmailsFormType>(formState.errors, setFocus);

  const [panel1, panel2] = [panelByKey('email_verification_form_panel1'), panelByKey('email_verification_form_panel2')];
  //Keep this as sometimes validation doesn't work on suggested email select
  const isValid = formState.isValid;

  return (
    <Grid id={id} container spacing={12}>
      {panel1 && (
        <Grid item xs={12}>
          {panel1}
        </Grid>
      )}
      <Grid item xs={12}>
        <form data-testid="email_form">
          <Grid container spacing={12}>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                control={control}
                label={labelByKey('email_verification_form_label')}
                placeholder={labelByKey('email_verification_form_placeholder')}
                errorTooltip={tooltipByKey('email_verification_form_error_tooltip')}
                tooltip={tooltipByKey('email_verification_form_tooltip')}
                isLoading={isLoading}
                errorTooltipDisabled={errorTooltipDisabled}
                onBlur={() => clearErrors()}
                disabled={isDisabled}
              />
            </Grid>
            {panel2 && (
              <Grid item xs={12}>
                {panel2}
              </Grid>
            )}
            <Grid item xs={12}>
              <PrimaryButton
                onClick={handleSubmit(onSubmit)}
                loading={submitLoading}
                disabled={(!initialData.email && !formState.isDirty) || !isValid}
                data-testid="continue"
              >
                {initialData.email
                  ? labelByKey('email_verification_form_next_step')
                  : labelByKey('email_verification_form_submit')}
              </PrimaryButton>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};
