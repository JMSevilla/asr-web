import { addYears, differenceInYears, endOfDay, startOfDay } from 'date-fns';
import { useEffect } from 'react';
import { ListLoader } from '../../';
import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { getMinMaxDate, zonedDate } from '../../../business/dates';
import { findValueByKey } from '../../../business/find-in-array';
import { useCachedCmsTokens } from '../../../core/contexts/contentData/useCachedCmsTokens';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import {
  RetirementOptionsFilterCheckboxesType,
  RetirementOptionsFilterForm,
  RetirementOptionsFilterType,
} from './RetirementOptionsFilterForm';

interface Props {
  id: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  panel?: '';
  journeyType: JourneyTypeSelection;
  panelList?: PanelListItem[];
}

type Filter = {
  retirementDate?: Date | string;
  retirementAge?: number;
  checkboxes?: Partial<RetirementOptionsFilterCheckboxesType>;
};

const INITIAL_RETIREMENT_OPTION_CHECKBOXES = {
  additional: true,
  cash: true,
  early: true,
  invested: true,
} as RetirementOptionsFilterCheckboxesType;

export const RetirementOptionsFilterBlock: React.FC<Props> = ({ id, pageKey, parameters, journeyType, panelList }) => {
  const minDateISO = findValueByKey('min_date_offset_iso', parameters);
  const maxDateISO = findValueByKey('max_date_offset_iso', parameters);
  const checkboxList = parseCheckboxList(panelList);
  const retirement = useRetirementContext();
  const cmsTokens = useCachedCmsTokens();
  const cachedAccessKey = useCachedAccessKey();
  const stepData = useJourneyStepData<Filter>({
    pageKey,
    formKey: id,
    journeyType,
    personType: 'retirement_date',
    parseFormToValues: formToValues,
  });

  useFormSubmissionBindingHooks({
    cb: submitDate,
    key: id,
    isValid: true,
    initDependencies: [stepData.values?.retirementDate],
  });

  useEffect(() => {
    return () => {
      retirement.resetFilters();
    };
  }, []);

  if (!stepData.values && stepData.loading) {
    return <ListLoader id={id} data-testid="retirement-options-filter-loader" loadersCount={1} />;
  }

  const savedDate = stepData.values?.retirementDate ? zonedDate(stepData.values.retirementDate) : undefined;

  return (
    <RetirementOptionsFilterForm
      prefix={id}
      onSubmit={handleSubmit}
      isSubmitLoading={retirement.quotesOptionsLoading || retirement.filtersUpdating || stepData.loading}
      minDate={minDate()}
      maxDate={maxDate()}
      savedDate={savedDate}
      savedCheckboxes={INITIAL_RETIREMENT_OPTION_CHECKBOXES}
      checkboxList={checkboxList}
    />
  );

  async function handleSubmit(values: RetirementOptionsFilterType) {
    retirement.onFilterUpdateStart();
    retirement.applyFilters();
    try {
      await stepData.save({
        retirementDate: values.date || stepData.values?.retirementDate,
        retirementAge: values.date ? calculateSelectedAge(values.date) : stepData.values?.retirementAge,
        checkboxes: values.checkboxes ? values.checkboxes : stepData.values?.checkboxes,
      });

      if (values.date) {
        await retirement.onRetirementDateChanged(values.date, true);
      } else {
        await retirement.refreshQuotesOptions();
      }

      await cmsTokens.refresh();
    } finally {
      retirement.onFilterUpdateEnd();
    }
  }

  async function submitDate() {
    if (!stepData.values?.retirementDate) {
      const date = maxDate();
      await stepData.save({ retirementDate: date, retirementAge: calculateSelectedAge(date) });

      if (cachedAccessKey.data?.schemeType !== 'DC') {
        await cmsTokens.refresh();
      }
    }
  }

  function minDate(): Date {
    return startOfDay(
      getMinMaxDate({
        condition: 'max',
        baseDate: new Date(),
        addIsoTime: minDateISO || '0D',
        comparisonDate: cmsTokens?.data?.earliestRetirementDate
          ? new Date(cmsTokens.data.earliestRetirementDate)
          : null,
      }),
    );
  }

  function maxDate(): Date {
    return endOfDay(
      getMinMaxDate({
        condition: 'min',
        baseDate: new Date(),
        addIsoTime: maxDateISO || '0D',
        comparisonDate: cmsTokens?.data?.dateOfBirth ? addYears(new Date(cmsTokens.data.dateOfBirth), +75) : null,
      }),
    );
  }

  function parseCheckboxList(panelList?: PanelListItem[]) {
    const panel = Array.isArray(panelList) ? panelList[0] : null;
    const column =
      panel && Array.isArray(panel?.elements?.columns?.values) ? panel?.elements?.columns?.values[0] : null;
    const contentBlock =
      column && Array.isArray(column?.contentBlocks?.values) ? column?.contentBlocks?.values[0] : null;

    return contentBlock && Array.isArray(contentBlock?.elements?.checkbox?.values)
      ? contentBlock?.elements?.checkbox?.values
      : [];
  }

  function calculateSelectedAge(date?: Date | string) {
    const dob = cmsTokens.data?.dateOfBirth;

    if (date && dob) {
      return differenceInYears(new Date(date), new Date(dob));
    }

    return undefined;
  }
};

function formToValues(values: Filter) {
  return {
    ...values,
    retirementDate: values.retirementDate ? values.retirementDate : undefined,
  };
}
