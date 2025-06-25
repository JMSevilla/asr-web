import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { Tooltip } from '../..';
import { findValueByKey } from '../../../business/find-in-array';
import { normalizeRetirementDate, selectableRetirementDateRangeDB } from '../../../business/retirement';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useCachedCmsTokens } from '../../../core/contexts/contentData/useCachedCmsTokens';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi } from '../../../core/hooks/useApi';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { RetirementDateInput } from './retirementDate/RetirementDateInput';

interface Props {
  id: string;
  parameters: { key: string; value: string }[];
}

/**
 * This is a non-journey dependent and non-calc dependent retirement date picker.
 *
 * This component is used in pre-journey pages where the retirement date needs to be specified.
 *
 * - For journey-bound date pickers, use `FormBoundRetirementDateBlock`.
 * - For date pickers used in calculation execution, use `RetirementDateBlock`.
 */
export const RetirementDatePickerBlock: React.FC<Props> = ({ id, parameters }) => {
  const { selectedRetirementDate, setSelectedRetirementDate } = useRetirementContext();
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const eventType = findValueByKey('event_type', parameters);
  const minDateISO = findValueByKey('min_date_offset_iso', parameters) ?? '';
  const maxDateISO = findValueByKey('max_date_offset_iso', parameters) ?? '';
  const dateInfoTooltip = tooltipByKey('explore_retirement_options_date_tooltip');
  const retirementDateRange = useApi(async api => {
    const data = normalizeRetirementDate((await api.mdp.retirementDate(eventType)).data);
    data.retirementDate = '';
    return data;
  });
  const cmsTokens = useCachedCmsTokens();
  const loading = retirementDateRange.loading;

  const { minRetirementDate, maxRetirementDate } = selectableRetirementDateRangeDB({
    dateOfBirth: cmsTokens?.data?.dateOfBirth || '',
    earliestRetirementDate: cmsTokens?.data?.earliestRetirementDate || '',
    minDateOffset: minDateISO,
    maxDateOffset: maxDateISO,
    fetchedMinDate: retirementDateRange.result?.availableRetirementDateRange.from,
    fetchedMaxDate: retirementDateRange.result?.availableRetirementDateRange.to,
  });

  useFormSubmissionBindingHooks({
    key: id,
    isValid: !!selectedRetirementDate && !loading,
    cb: () => Promise.resolve({}),
    initDependencies: [selectedRetirementDate, loading],
  });

  useEffect(() => {
    return () => {
      setSelectedRetirementDate(undefined);
    };
  }, [setSelectedRetirementDate]);

  return (
    <Grid component="form" data-testid={`${id}_form`} container item xs={12} spacing={6} id={id} alignItems="flex-end">
      <Grid item data-testid="date-picker">
        <RetirementDateInput
          loading={loading}
          displayEmpty={true}
          selectedDate={selectedRetirementDate ? new Date(selectedRetirementDate) : undefined}
          minDate={eventType && retirementDateRange.result?.availableRetirementDateRange?.from ? new Date(retirementDateRange.result.availableRetirementDateRange.from) : minRetirementDate}
          maxDate={eventType && retirementDateRange.result?.availableRetirementDateRange?.to ? new Date(retirementDateRange.result.availableRetirementDateRange.to) : maxRetirementDate}
          onChanged={handleDateChange}
        />
      </Grid>

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

  /**
   * Note: Usage of Context is preferred for state management here.
   * If the date needs to be more widely available, use session storage.
   */
  function handleDateChange(date: Date | undefined) {
    setSelectedRetirementDate(date);
  }

  function assertiveMessageProps() {
    if (loading) {
      return { 'data-loading-msg': labelByKey('explore_retirement_options_date_loading') };
    }
    return {};
  }
};
