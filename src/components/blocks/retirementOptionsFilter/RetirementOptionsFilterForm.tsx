import { Grid, Stack } from '@mui/material';
import { isBefore, startOfDay } from 'date-fns';
import { FieldValues } from 'react-hook-form';
import { Checkbox } from '../../../api/content/types/page';
import { normalizeDate } from '../../../business/dates';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { ParsedHtml } from '../../ParsedHtml';
import { Button } from '../../buttons';
import { CheckboxComponent } from '../../form';
import { RetirementDateInput } from '../datePicker/retirementDate/RetirementDateInput';
import { useRetirementOptionsFilterState } from './hooks';

interface Props {
  prefix: string;
  savedDate?: Date;
  savedCheckboxes?: RetirementOptionsFilterCheckboxesType;
  isSubmitLoading: boolean;
  minDate: Date;
  maxDate: Date;
  onSubmit(data: RetirementOptionsFilterType): Promise<void>;
  checkboxList?: Checkbox[];
}

export const retirementOptionsFilterCheckboxKeys = ['early', 'invested', 'cash', 'additional'] as const;
export type RetirementOptionsFilterCheckboxesType = {
  [key in (typeof retirementOptionsFilterCheckboxKeys)[number]]: boolean;
};
export type RetirementOptionsFilterType = { date?: Date; checkboxes?: RetirementOptionsFilterCheckboxesType };

export const RetirementOptionsFilterForm: React.FC<Props> = ({
  prefix,
  savedDate,
  savedCheckboxes,
  isSubmitLoading,
  minDate,
  maxDate,
  onSubmit,
  checkboxList,
}) => {
  const { buttonByKey } = useGlobalsContext();
  const submitButton = buttonByKey(`${prefix}_button`);
  const filters = useRetirementOptionsFilterState(
    startOfDay(savedDate && isBefore(savedDate, maxDate) ? savedDate : maxDate),
    savedCheckboxes ||
      (checkboxList?.reduce(
        (acc, checkbox) => ({ ...acc, [checkbox?.checkboxKey?.value]: !!checkbox?.defaultState?.value }),
        {},
      ) as RetirementOptionsFilterCheckboxesType),
  );

  return (
    <Grid container item xs={12} spacing={6} id={prefix} data-testid="retirement-options-filter-form">
      <Grid item xs={12}>
        <RetirementDateInput
          loading={isSubmitLoading}
          selectedDate={filters.date}
          minDate={minDate}
          maxDate={maxDate}
          onChanged={handleDateChanged}
        />
      </Grid>
      <Grid item xs={12} container spacing={4} alignItems="center">
        <Grid item xs container>
          <Stack
            component="form"
            data-testid={prefix}
            gap={4}
            direction={{ xs: 'column', md: 'row' }}
            sx={{
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: theme => theme.palette.primary.main,
              width: '100%',
              padding: 4,
            }}
          >
            {checkboxList?.map(checkbox => (
              <CheckboxComponent<FieldValues>
                key={checkbox.checkboxKey?.value}
                name={checkbox.checkboxKey?.value}
                disabled={isSubmitLoading}
                value={!!filters.checkboxes[checkbox.checkboxKey?.value as keyof RetirementOptionsFilterCheckboxesType]}
                onChange={handleCheckboxChanged(
                  checkbox.checkboxKey?.value as keyof RetirementOptionsFilterCheckboxesType,
                )}
                onBlur={() => {}}
                label={<ParsedHtml html={checkbox.checkboxText?.value} />}
              />
            ))}
          </Stack>
        </Grid>
        <Grid item xs="auto">
          <Button {...submitButton} onClick={handleSubmit} loading={isSubmitLoading} disabled={!filters.isDirty} />
        </Grid>
      </Grid>
    </Grid>
  );

  function handleSubmit() {
    if (filters.isDirty) {
      onSubmit({
        date: filters.isDateFilterDirty ? filters.date : undefined,
        checkboxes: filters.isAnyCheckboxDirty ? filters.checkboxes : undefined,
      });
      filters.saveLastSubmittedValues();
    }
  }

  function handleDateChanged(date: Date) {
    filters.updateDate(normalizeDate(date));
  }

  function handleCheckboxChanged(name: keyof RetirementOptionsFilterCheckboxesType) {
    return (value: boolean) => filters.updateCheckbox(name, value);
  }
};
