import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { DateField, PhoneField, SelectField, TextField } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { PersonFormType, personFormSchema } from './validation';

interface Props {
  prefix: string;
  fields: string[];
  defaultValues?: PersonFormType;
  isFullWidth?: boolean;
  onSubmit(values: PersonFormType): Promise<void>;
  maxCharacters?: string;
}

const TODAY = new Date();

export const PersonForm: React.FC<Props> = ({
  prefix,
  fields,
  defaultValues: initialValues,
  isFullWidth,
  onSubmit,
  maxCharacters,
}) => {
  const { labelByKey, tooltipByKey, classifierByKey } = useGlobalsContext();
  const validationSchema = personFormSchema(fields, prefix, +(maxCharacters || 180));
  const defaultValues = useMemo(() => {
    const formDefaults = validationSchema.getDefault();
    return { ...formDefaults, ...initialValues, phoneCode: initialValues?.phoneCode || formDefaults.phoneCode };
  }, [initialValues]);
  const form = useForm<PersonFormType>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues,
  });
  useFormSubmissionBindingHooks({
    key: prefix,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    cb: () => form.handleSubmit(onSubmit)(),
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  const dob = form.watch('dateOfBirth');
  const dod = form.watch('dateOfDeath');

  useEffect(() => {
    if (dob && dod) {
      form.trigger(['dateOfDeath', 'dateOfBirth']);
    }
  }, [dob, dod]);

  return (
    <Grid
      container
      spacing={6}
      component="form"
      data-testid={prefix}
      sx={{ ...(isFullWidth ? {} : { '& .MuiOutlinedInput-root': { maxWidth: 372 } }) }}
    >
      {fields.includes('name') && (
        <Grid item xs={12}>
          <TextField
            name="name"
            control={form.control}
            label={labelByKey(`${prefix}_name`)}
            errorTooltip={tooltipByKey(`${prefix}_name_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_name_tooltip`)}
            onBlur={() => form.clearErrors()}
          />
        </Grid>
      )}
      {fields.includes('surname') && (
        <Grid item xs={12}>
          <TextField
            name="surname"
            control={form.control}
            label={labelByKey(`${prefix}_surname`)}
            errorTooltip={tooltipByKey(`${prefix}_surname_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_surname_tooltip`)}
            onBlur={() => form.clearErrors()}
          />
        </Grid>
      )}
      {fields.includes('scheme_name') && (
        <Grid item xs={12}>
          <TextField
            name="schemeName"
            control={form.control}
            label={labelByKey(`${prefix}_scheme_name`)}
            errorTooltip={tooltipByKey(`${prefix}_scheme_name_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_scheme_name_tooltip`)}
            onBlur={() => form.clearErrors()}
          />
        </Grid>
      )}
      {fields.includes('advisor_name') && (
        <Grid item xs={12}>
          <TextField
            name="advisorName"
            control={form.control}
            label={labelByKey(`${prefix}_advisor_name`)}
            errorTooltip={tooltipByKey(`${prefix}_advisor_name_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_advisor_name_tooltip`)}
            onBlur={() => form.clearErrors()}
          />
        </Grid>
      )}
      {fields.includes('company_name') && (
        <Grid item xs={12}>
          <TextField
            name="companyName"
            control={form.control}
            label={labelByKey(`${prefix}_company_name`)}
            errorTooltip={tooltipByKey(`${prefix}_company_name_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_company_name_tooltip`)}
            onBlur={() => form.clearErrors()}
          />
        </Grid>
      )}
      {fields.includes('date_of_birth') && (
        <Grid item xs={12}>
          <DateField
            name="dateOfBirth"
            control={form.control}
            label={labelByKey(`${prefix}_date_of_birth`)}
            errorTooltip={tooltipByKey(`${prefix}_date_of_birth_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_date_of_birth_tooltip`)}
            onBlur={() => form.clearErrors()}
            maxDate={TODAY}
          />
        </Grid>
      )}
      {fields.includes('date_of_death') && (
        <Grid item xs={12}>
          <DateField
            name="dateOfDeath"
            control={form.control}
            label={labelByKey(`${prefix}_date_of_death`)}
            errorTooltip={tooltipByKey(`${prefix}_date_of_death_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_date_of_death_tooltip`)}
            onBlur={() => form.clearErrors()}
            maxDate={TODAY}
          />
        </Grid>
      )}
      {(fields.includes('email') || fields.includes('optional_email')) && (
        <Grid item xs={12}>
          <TextField
            name="email"
            control={form.control}
            label={labelByKey(`${prefix}_email`)}
            errorTooltip={tooltipByKey(`${prefix}_email_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_email_tooltip`)}
            onBlur={() => form.clearErrors()}
          />
        </Grid>
      )}
      {fields.includes('phone') && (
        <Grid item>
          <PhoneField
            name="phoneNumber"
            control={form.control}
            label={labelByKey(`${prefix}_phone`)}
            onBlur={() => form.clearErrors()}
            countryCode={form.watch('phoneCode')}
            defaultValue={form.getValues('phoneNumber')}
            onCountryCodeChanged={code => {
              form.setValue('phoneCode', code);
              form.trigger('phoneNumber');
            }}
            errorTooltip={tooltipByKey(`${prefix}_phone_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_phone_tooltip`)}
          />
        </Grid>
      )}
      {fields.includes('relationship') && (
        <Grid item xs={12}>
          <SelectField
            name="relationship"
            control={form.control}
            label={labelByKey(`${prefix}_relationship`)}
            placeholder={labelByKey(`${prefix}_relationship_placeholder`)}
            options={classifierByKey('bereavement_relationships')}
            tooltip={tooltipByKey(`${prefix}_relationship_tooltip`)}
            onBlur={() => form.clearErrors()}
          />
        </Grid>
      )}
      {(fields.includes('comment') || fields.includes('mandatory_comment')) && (
        <Grid item xs={12}>
          <TextField
            name="comment"
            control={form.control}
            label={labelByKey(`${prefix}_comment`)}
            errorTooltip={tooltipByKey(`${prefix}_comment_error_tooltip`)}
            tooltip={tooltipByKey(`${prefix}_comment_tooltip`)}
            onBlur={() => form.clearErrors()}
            multiline
            rows={4}
          />
        </Grid>
      )}
    </Grid>
  );
};
