import { isSameDay } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  RetirementOptionsFilterCheckboxesType,
  RetirementOptionsFilterType,
  retirementOptionsFilterCheckboxKeys,
} from './RetirementOptionsFilterForm';

export const useRetirementOptionsFilterState = (
  savedDate: Date,
  initialCheckboxes: RetirementOptionsFilterCheckboxesType,
) => {
  const [date, setDate] = useState<Date>(savedDate);
  const [checkboxes, setCheckboxes] = useState<RetirementOptionsFilterCheckboxesType>(initialCheckboxes);
  const [lastSubmittedValues, setLastSubmittedValues] = useState<RetirementOptionsFilterType>({
    date: savedDate,
    checkboxes: initialCheckboxes,
  });

  const isDateFilterDirty = lastSubmittedValues.date ? !isSameDay(date, lastSubmittedValues.date) : true;
  const isAnyCheckboxDirty = retirementOptionsFilterCheckboxKeys.some(
    key => !!checkboxes[key] !== !!lastSubmittedValues.checkboxes?.[key],
  );
  const isDirty = isDateFilterDirty || isAnyCheckboxDirty;

  useEffect(() => {
    if (savedDate) {
      setDate(savedDate);
    }
  }, [savedDate.toUTCString()]);

  useEffect(() => {
    if (getEnabledCheckboxes(initialCheckboxes) !== getEnabledCheckboxes(checkboxes)) {
      setCheckboxes(initialCheckboxes);
    }
  }, [getEnabledCheckboxes(initialCheckboxes)]);

  return {
    date,
    checkboxes,
    isDirty,
    isDateFilterDirty,
    isAnyCheckboxDirty,
    updateDate: setDate,
    updateCheckbox: (key: keyof RetirementOptionsFilterCheckboxesType, value: boolean) =>
      setCheckboxes(prev => ({ ...prev, [key]: value })),
    saveLastSubmittedValues: () => setLastSubmittedValues({ date, checkboxes }),
  };
};

const getEnabledCheckboxes = (checkboxes: RetirementOptionsFilterCheckboxesType) =>
  Object.entries(checkboxes)
    .filter(([, value]) => !!value)
    .map(([key]) => key)
    .join(',');
