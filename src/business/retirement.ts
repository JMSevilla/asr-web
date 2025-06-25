import { addDays, addYears, endOfDay, startOfDay } from 'date-fns';
import { ValueFormatType } from '../api/content/types/common';
import {
  SummaryItemValue,
  selectableRetirementDateRange,
  selectableRetirementDateRangeParams,
} from '../api/content/types/retirement';
import { RetirementDate, RetirementQuotesV3Option, RetirementQuotesV3PensionTranches } from '../api/mdp/types';
import { RetirementConstants as RC } from '../business/constants';
import { currencyValue } from './currency';
import { getMinMaxDate, timelessDateString } from './dates';

export const RETIREMENT_VALUE_PATH_DELIMITER = '.';

export function findRetirementOptionValueByKey(
  quoteOption: RetirementQuotesV3Option,
  ...keys: string[]
): string | number | null {
  const [key, ...restKeys] = keys;
  if (!key) {
    return null;
  }
  if (quoteOption.attributes?.[key] || quoteOption.attributes?.[key] === 0) {
    const isPensionTranche = typeof quoteOption.attributes[key] === 'object';
    const [childKey] = restKeys;
    return (
      (isPensionTranche
        ? (quoteOption.attributes[key] as RetirementQuotesV3PensionTranches)[childKey]
        : (quoteOption.attributes[key] as string)) ?? null
    );
  }
  if (quoteOption.options?.[key] && !!restKeys.length) {
    return findRetirementOptionValueByKey(quoteOption.options[key], ...restKeys);
  }
  if (
    (quoteOption as RetirementQuotesV3PensionTranches)?.[key] ||
    (quoteOption as RetirementQuotesV3PensionTranches)?.[key] === 0
  ) {
    return (quoteOption as RetirementQuotesV3PensionTranches)[key];
  }
  return null;
}

export const retirementValuePathToKeys = (itemValue?: SummaryItemValue) =>
  itemValue?.elements.value.value?.split(RETIREMENT_VALUE_PATH_DELIMITER) ?? [];

export function parseRetirementSummaryItemValue(
  item: SummaryItemValue,
  labelByKey: (key: string) => string,
  quotes?: RetirementQuotesV3Option,
) {
  return parseRetirementSummaryItemFormatAndValue(item, labelByKey, quotes).value;
}

export function parseRetirementSummaryItemFormatAndValue(
  item: SummaryItemValue,
  labelByKey: (key: string) => string,
  quotes?: RetirementQuotesV3Option,
): { format: ValueFormatType | undefined; value: string | undefined } {
  const {
    elements: {
      format: { value: { selection: valueFormat } = { selection: undefined } },
      value: { value: itemValue },
    },
  } = item;
  if (valueFormat === 'Text' || !quotes) {
    return { format: valueFormat, value: itemValue };
  }
  const value = findRetirementOptionValueByKey(quotes, ...retirementValuePathToKeys(item));
  if (!value && value !== 0) {
    return { format: valueFormat, value: undefined };
  }
  if (valueFormat === 'Currency') {
    return { format: valueFormat, value: `${labelByKey('currency:GBP')}${currencyValue(value)}` };
  }
  if (valueFormat === 'Currency per year') {
    return { format: valueFormat, value: `${labelByKey('currency:GBP')}${currencyValue(value)}/${labelByKey('year')}` };
  }
  return { format: valueFormat, value: ' ' };
}

export const normalizeRetirementDate = (retirementDate: RetirementDate): RetirementDate => ({
  isCalculationSuccessful: retirementDate.isCalculationSuccessful,
  retirementDate: new Date(timelessDateString(retirementDate.retirementDate)).toUTCString(),
  dateOfBirth: new Date(timelessDateString(retirementDate.dateOfBirth)).toUTCString(),
  availableRetirementDateRange: {
    from: new Date(timelessDateString(retirementDate.availableRetirementDateRange.from)).toUTCString(),
    to: new Date(timelessDateString(retirementDate.availableRetirementDateRange.to)).toUTCString(),
  },
  guaranteedQuoteEffectiveDateList:
    retirementDate?.guaranteedQuoteEffectiveDateList?.map(date => new Date(timelessDateString(date)).toUTCString()) ??
    [],
});

/**
 * Calculates the selectable retirement date range for DB.
 * Used when special conditions override the default range from the retirement-date API.
 *
 * @param {selectableRetirementDateRangeParams} params
 * @param {Date | string} params.earliestRetirementDate
 * @param {Date | string} params.dateOfBirth
 * @param {string} params.minDateOffset
 * @param {string} params.maxDateOffset
 * @param {Date | string} params.fetchedMinDate
 * @param {Date | string} params.fetchedMaxDate
 * @returns {selectableRetirementDateRange}
 */
export function selectableRetirementDateRangeDB({
  earliestRetirementDate,
  dateOfBirth,
  minDateOffset,
  maxDateOffset,
  fetchedMinDate,
  fetchedMaxDate,
}: selectableRetirementDateRangeParams): selectableRetirementDateRange {
  const calculatedMinDate = startOfDay(
    getMinMaxDate({
      condition: 'max',
      baseDate: minDateOffset ? new Date() : new Date(earliestRetirementDate),
      addIsoTime: minDateOffset || '0D',
      comparisonDate: addDays(new Date(), RC.DB_RET_PROC_PERIOD_IN_DAYS),
    }),
  );

  const calculatedMaxDate = endOfDay(
    getMinMaxDate({
      condition: 'min',
      baseDate: new Date(),
      addIsoTime: maxDateOffset || '0D',
      comparisonDate: dateOfBirth ? addYears(new Date(dateOfBirth), RC.LATEST_RET_AGE_IN_YEARS) : null,
    }),
  );

  return {
    minRetirementDate: minDateOffset
      ? calculatedMinDate
      : fetchedMinDate
      ? new Date(fetchedMinDate)
      : calculatedMinDate,
    maxRetirementDate: maxDateOffset
      ? calculatedMaxDate
      : fetchedMaxDate
      ? new Date(fetchedMaxDate)
      : calculatedMaxDate,
  };
}
