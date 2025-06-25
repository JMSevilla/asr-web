import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AddIcon, PrimaryButton, RadioButtonFieldOption, RadioButtonsField, TextField, Tooltip } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { ButtonsType } from './types';
import { personIdentificationFormSchema, PersonIdentificationFormType } from './validation';

interface Props {
  prefix: string;
  submitLoading: boolean;
  initialData: PersonIdentificationFormType;
  isStandAlone?: boolean;
  onSubmit(values: PersonIdentificationFormType): void;
  panel: JSX.Element | null;
}

export const PersonIdentificationForm: React.FC<Props> = ({
  submitLoading,
  initialData,
  isStandAlone,
  onSubmit,
  panel,
  prefix,
}) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const [refNumbersCount, setRefNumbersCount] = useState(
    initialData.identification?.pensionReferenceNumbers?.filter(filterReferenceNumbers).length || 1,
  );
  const { handleSubmit, control, formState, setFocus, watch, clearErrors } = useForm<PersonIdentificationFormType>({
    resolver: yupResolver(personIdentificationFormSchema(prefix)),
    mode: 'onChange',
    defaultValues: initialData,
    criteriaMode: 'all',
  });
  const insuranceNumberTooltip = tooltipByKey(`${prefix}_insurance_number_label_tooltip`);
  const tooltip = tooltipByKey(`${prefix}_service_number_label_tooltip`);
  const selectedOption = watch('identification.type') as ButtonsType;

  useFormFocusOnError<PersonIdentificationFormType>(formState.errors, setFocus);

  return (
    <Grid component="form" data-testid={`${prefix}_form`} container lg={isStandAlone ? 12 : 6} spacing={12}>
      <Grid item xs={12} container spacing={4}>
        <Grid item xs={12}>
          <Typography>{labelByKey(`${prefix}_radio_buttons_label`)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <RadioButtonsField
            name="identification.type"
            control={control}
            buttons={createRadioButtonOptions()}
            defaultValue={selectedOption}
          />
        </Grid>
      </Grid>
      <Grid container spacing={6} item xs={12}>
        {Array.from(Array(refNumbersCount).keys()).map(index => (
          <Grid item xs={12} key={index}>
            <TextField
              name={`identification.pensionReferenceNumbers.${index}`}
              control={control}
              label={labelByKey(`${prefix}_reference_number${index + 1}_label`)}
              placeholder={labelByKey(`${prefix}_reference_number${index + 1}_ph`)}
              tooltip={tooltipByKey(`${prefix}_reference_number${index + 1}_tooltip`)}
              onBlur={() => clearErrors()}
            />
          </Grid>
        ))}
      </Grid>
      {refNumbersCount < 3 && (
        <Grid
          item
          xs={12}
          container
          sx={{ cursor: 'pointer', '& path': { fill: theme => theme.palette.appColors.primary } }}
          flexWrap="nowrap"
          onClick={() => setRefNumbersCount(count => count + 1)}
        >
          <Grid item mr={4}>
            <AddIcon />
          </Grid>
          <Typography color="primary"> {labelByKey(`${prefix}_add_pension_scheme`)}</Typography>
        </Grid>
      )}
      {panel && (
        <Grid item xs={12}>
          {panel}
        </Grid>
      )}
      <Grid item xs={12}>
        <PrimaryButton
          onClick={handleSubmit(onSubmit)}
          loading={submitLoading}
          disabled={!formState.isValid}
          data-testid={`${prefix}_continue`}
        >
          {labelByKey(`${prefix}_continue`)}
        </PrimaryButton>
      </Grid>
    </Grid>
  );

  function createRadioButtonOptions(): RadioButtonFieldOption[] {
    return [
      {
        value: 'INSURANCE_NUMBER',
        label: (
          <Grid container flexWrap="nowrap">
            {labelByKey(`${prefix}_insurance_number_r_label`)}
            <Tooltip header={insuranceNumberTooltip?.header} html={insuranceNumberTooltip?.html} underlinedText>
              {insuranceNumberTooltip?.text}
            </Tooltip>
          </Grid>
        ),
        inputField:
          selectedOption === 'INSURANCE_NUMBER' ? (
            <Grid item xs={12}>
              <TextField
                name="identification.nationalInsuranceNumber"
                control={control}
                label={null}
                placeholder={labelByKey(`${prefix}_insurance_number_ph`)}
                tooltip={tooltipByKey(`${prefix}_insurance_number_tooltip`)}
                errorTooltip={tooltipByKey(`${prefix}_insurance_number_error_tooltip`)}
                onBlur={() => clearErrors()}
              />
            </Grid>
          ) : undefined,
      },
      {
        value: 'SERVICE_NUMBER',
        label: (
          <Grid container flexWrap="nowrap">
            {labelByKey(`${prefix}_service_number_r_label`)}
            <Tooltip header={tooltip?.header} html={tooltip?.html} underlinedText>
              {tooltip?.text}
            </Tooltip>
          </Grid>
        ),
        inputField:
          selectedOption === 'SERVICE_NUMBER' ? (
            <Grid item xs={12}>
              <TextField
                name="identification.personalPublicServiceNumber"
                control={control}
                label={null}
                placeholder={labelByKey(`${prefix}_service_number_ph`)}
                tooltip={tooltipByKey(`${prefix}_service_number_tooltip`)}
                errorTooltip={tooltipByKey(`${prefix}_service_number_error_tooltip`)}
                onBlur={() => clearErrors()}
              />
            </Grid>
          ) : undefined,
      },
      { value: 'NOT_KNOWN', label: labelByKey(`${prefix}_not_known_label`) },
    ];
  }
};

function filterReferenceNumbers(value: string, index: number, array: string[]) {
  return array.slice(index + 1).filter(Boolean).length || value ? true : false;
}
