import { addMonths, addYears, compareDesc, differenceInYears, min as minDate } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { RetirementDate } from '../../../../api/mdp/types';
import { getUTCDate } from '../../../../business/dates';
import { useCachedCmsTokens } from '../../../../core/contexts/contentData/useCachedCmsTokens';

export const useDateCalculations = (
  savedRetirementDate?: RetirementDate,
  customMaxDateMonths?: string,
  isMaxDateAsDefault?: boolean,
  quotesRetirementDate?: Date,
) => {
  const cmsTokens = useCachedCmsTokens();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [lastValidDate, setLastValidDate] = useState<Date>();
  const dateFrom = savedRetirementDate
    ? getUTCDate(new Date(savedRetirementDate.availableRetirementDateRange.from))
    : undefined;
  const returnedDateTo = savedRetirementDate
    ? getUTCDate(new Date(savedRetirementDate.availableRetirementDateRange.to))
    : undefined;
  const dateTo = minDate(
    [returnedDateTo, customMaxDateMonths && addMonths(getUTCDate(new Date()), +customMaxDateMonths)].filter(
      Boolean,
    ) as Date[],
  );
  const dateOfBirth = savedRetirementDate ? getUTCDate(new Date(savedRetirementDate.dateOfBirth)) : undefined;
  const selectedAge = selectedDate && dateOfBirth ? differenceInYears(selectedDate, dateOfBirth) : undefined;

  useEffect(() => {
    if (!savedRetirementDate) return;

    const dateValue = isMaxDateAsDefault
      ? getUTCDate(new Date(savedRetirementDate.availableRetirementDateRange.to))
      : getUTCDate(new Date(savedRetirementDate.retirementDate));
    const savedDate = quotesRetirementDate || dateValue;
    setSelectedDate(savedDate);
    setLastValidDate(savedDate);
  }, [savedRetirementDate?.retirementDate, isMaxDateAsDefault, quotesRetirementDate]);

  useEffect(() => {
    if (selectedAge) {
      cmsTokens.update('selectedRetirementAge', selectedAge);
    }
  }, [selectedAge]);

  return {
    dateFrom,
    dateTo,
    dateOfBirth,
    selectedAge,
    selectedDate,
    lastValidDate,
    ageOptions: ageOptions(dateFrom, dateTo, dateOfBirth),
    calculateDateByAge: (age: number) =>
      !!dateFrom && !!dateOfBirth && [addYears(dateOfBirth, age), dateFrom].sort(compareDesc)[0],
    changeAge: useCallback(
      (age: number) =>
        !!dateFrom && !!dateOfBirth && setSelectedDate([addYears(dateOfBirth, age), dateFrom].sort(compareDesc)[0]),
      [dateFrom, dateOfBirth],
    ),
    changeDate: useCallback(
      (date: Date) => {
        if (date === selectedDate) return;
        setSelectedDate(date);
      },
      [dateFrom, dateOfBirth],
    ),
    confirmSelectedDateIsValid: () => setLastValidDate(selectedDate),
  };
};

function ageOptions(dateFrom?: Date, dateTo?: Date, dateOfBirth?: Date) {
  if (!dateFrom || !dateTo || !dateOfBirth) return [];

  const minAge = differenceInYears(dateFrom, dateOfBirth);
  const maxAge = differenceInYears(dateTo, dateOfBirth);

  return Array.from(Array(maxAge + 1).keys()).slice(minAge);
}
