import { Grid } from '@mui/material';
import { addDays, addYears } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { Tooltip } from '../..';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { RetirementDate } from '../../../api/mdp/types';
import { isTrue } from '../../../business/boolean';
import { RetirementConstants as RC } from '../../../business/constants';
import { normalizeDate } from '../../../business/dates';
import { findValueByKey } from '../../../business/find-in-array';
import { normalizeRetirementDate } from '../../../business/retirement';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useCachedCmsTokens } from '../../../core/contexts/contentData/useCachedCmsTokens';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi } from '../../../core/hooks/useApi';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { RetirementAgeInput } from './retirementDate/RetirementAgeInput';
import { RetirementDateInput } from './retirementDate/RetirementDateInput';
import { useDateCalculations } from './retirementDate/useDateCalculations';

interface Props {
  id: string;
  parameters: { key: string; value: string }[];
  journeyType: JourneyTypeSelection;
  pageKey: string;
}

type DatePickerWithAgeType = { selectedDate?: Date | string; selectedAge?: number };

export const FormBoundRetirementDateBlock: React.FC<Props> = ({ id, parameters, journeyType, pageKey }) => {
  const eventType = findValueByKey('event_type', parameters);
  const personType = findValueByKey('person_type', parameters) ?? '';
  const isMaxDateAsDefault = isTrue(findValueByKey('use_available_retirement_date_range_to_as_default', parameters));
  const cmsTokens = useCachedCmsTokens();
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const { quotesOptions, quotesOptionsLoading } = useRetirementContext();
  const retirementDateData = useApi(async api =>
    normalizeRetirementDate((await api.mdp.retirementDate(eventType)).data),
  );
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const stepData = useJourneyStepData<DatePickerWithAgeType>({
    pageKey,
    formKey: id,
    journeyType,
    personType,
    parseFormToValues: formToValues,
  });
  const customMaxDateMonths = findValueByKey('max_date_months', parameters);
  const dateInfoTooltip = tooltipByKey('explore_retirement_options_date_tooltip');
  const loading = quotesOptionsLoading || retirementDateData.loading || submitStepCb.loading;
  const prefix = `${id}_${personType}`;

  const defaultDate = useMemo(() => {
    const earliestDate = earliestRetirementDate().toUTCString();
    const defaultRetirementDate: RetirementDate = {
      isCalculationSuccessful: false,
      retirementDate: earliestDate,
      dateOfBirth: cmsTokens?.data?.dateOfBirth ?? '',
      availableRetirementDateRange: {
        from: earliestDate,
        to: latestRetirementDate()?.toUTCString() ?? '',
      },
      guaranteedQuoteEffectiveDateList: [],
    };

    if (stepData.values?.selectedDate) {
      return { ...defaultRetirementDate, retirementDate: new Date(stepData.values.selectedDate).toUTCString() };
    }

    if (!!retirementDateData.result?.retirementDate) {
      return retirementDateData.result;
    }

    return defaultRetirementDate;
  }, [retirementDateData.result?.retirementDate, stepData.values?.selectedDate]);
  const dateCalc = useDateCalculations(
    defaultDate,
    customMaxDateMonths,
    isMaxDateAsDefault && !stepData.values?.selectedDate,
  );

  useApi(
    async api => {
      if (!dateCalc.selectedDate && !dateCalc.selectedAge) {
        return;
      }

      return await api.mdp.genericJourneySubmitStepData<DatePickerWithAgeType>(journeyType, pageKey, id, {
        selectedDate: dateCalc.selectedDate,
        selectedAge: dateCalc.selectedAge,
      });
    },
    [dateCalc.selectedDate, dateCalc.selectedAge],
  );

  useFormSubmissionBindingHooks({
    key: prefix,
    isValid: !!dateCalc.lastValidDate,
    isDirty: dateCalc.selectedDate?.toUTCString() !== defaultDate.retirementDate,
    cb: handleSubmit,
    initDependencies: [dateCalc.lastValidDate, dateCalc.selectedDate],
  });

  useEffect(() => {
    if (quotesOptions?.isCalculationSuccessful) {
      dateCalc.confirmSelectedDateIsValid();
    }
  }, [quotesOptions?.isCalculationSuccessful]);

  const dateRange = retirementDateData.result?.availableRetirementDateRange;
  const minDate = eventType && dateRange?.from ? new Date(dateRange.from) : dateCalc.dateFrom;
  const maxDate = eventType && dateRange?.to ? new Date(dateRange.to) : dateCalc.dateTo;

  return (
    <Grid
      component="form"
      data-testid={`${prefix}_form`}
      container
      item
      xs={12}
      spacing={6}
      id={id}
      alignItems="flex-end"
    >
      <Grid item data-testid="date-picker">
        <RetirementDateInput
          loading={retirementDateData.loading}
          selectedDate={dateCalc.selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          onChanged={handleDateChange}
        />
      </Grid>
      {!customMaxDateMonths && (
        <Grid item data-testid="age-picker">
          <RetirementAgeInput
            loading={retirementDateData.loading}
            selectedAge={dateCalc.selectedAge}
            options={dateCalc.ageOptions}
            onChanged={handleAgeChange}
          />
        </Grid>
      )}

      <span data-testid="hidden-text" className="visually-hidden" aria-live="assertive" {...assertiveMessageProps()} />
      {dateInfoTooltip?.text && (
        <Grid item xs={12}>
          <Tooltip header={dateInfoTooltip.header} html={dateInfoTooltip.html} underlinedText>
            {dateInfoTooltip.text}
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );

  async function handleSubmit() {
    await stepData.save({ selectedDate: dateCalc.selectedDate, selectedAge: dateCalc.selectedAge });
  }

  function handleAgeChange(age: number) {
    dateCalc.changeAge(age);
  }

  function handleDateChange(date: Date) {
    dateCalc.changeDate(date);
  }

  function assertiveMessageProps() {
    if (loading) {
      return { 'data-loading-msg': labelByKey('explore_retirement_options_date_loading') };
    }
    return {};
  }

  function earliestRetirementDate(): Date {
    const processingPeriod = addDays(new Date(), RC.DB_RET_PROC_PERIOD_IN_DAYS);
    const computedEarliestRetirementDate = cmsTokens?.data?.dateOfBirth
      ? addYears(new Date(cmsTokens?.data?.dateOfBirth), +RC.EARLIEST_RET_AGE_IN_YEARS)
      : processingPeriod;
    const earliestRetirementDate = cmsTokens?.data?.earliestRetirementDate
      ? new Date(cmsTokens.data.earliestRetirementDate)
      : computedEarliestRetirementDate;

    return new Date(Math.max(earliestRetirementDate.getTime(), processingPeriod.getTime()));
  }

  function latestRetirementDate(): Date | null {
    return cmsTokens?.data?.dateOfBirth
      ? addYears(new Date(cmsTokens?.data?.dateOfBirth), +RC.LATEST_RET_AGE_IN_YEARS)
      : null;
  }
};

function formToValues(values: DatePickerWithAgeType) {
  return {
    ...values,
    selectedDate: values.selectedDate ? normalizeDate(new Date(values.selectedDate)).toISOString() : undefined,
  };
}
