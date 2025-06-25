import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  format,
  isBefore,
  isEqual,
  isSameDay,
  isValid,
  isWithinInterval,
  parse,
  parseISO,
  setDate,
  setMonth,
  startOfDay,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { CmsGlobals } from '../api/content/types/globals';
import { extractLabelByKey } from './globals';

export const formatDate = (date: string | number | Date, dateFormat = 'dd MMM yyyy') => {
  const rawDate = typeof date === 'string' && rawDateFromISOString(date);

  if (rawDate) {
    return rawDate;
  }

  try {
    const shouldAddGMT = typeof date === 'string' && /^\d{1,2} [A-Za-z]+ \d{4}$/.test(date);
    const dateObj = new Date(shouldAddGMT ? date + ' GMT' : date);
    const utcDate = utcToZonedTime(dateObj, 'UTC');
    return format(utcDate, dateFormat);
  } catch {
    return date?.toString();
  }
};

export const rawDateFromISOString = (isoString: string) => {
  const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const [year, month, day] = match.slice(1, 4).map(Number);
    const monthName = new Date(Date.UTC(year, month - 1, day)).toLocaleString('default', { month: 'short' });
    const dayString = day.toString().padStart(2, '0');
    return `${dayString} ${monthName} ${year}`;
  }
};

export const zonedDate = (date: string | number | Date): Date => {
  if (typeof date === 'string') {
    const match = date.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z/);
    if (match) {
      return new Date(
        Date.UTC(
          parseInt(match[1], 10),
          parseInt(match[2], 10) - 1,
          parseInt(match[3], 10),
          parseInt(match[4], 10),
          parseInt(match[5], 10),
          parseInt(match[6], 10),
          parseInt(match[7], 10),
        ),
      );
    }
  }
  return new Date(date);
};

export const formatTime = (date: string | number | Date, timeFormat = 'HH:mm') => {
  try {
    const isDateISOString = typeof date === 'string' && date.match(/\d{4}-\d{2}-\d{2}T/);
    return format(isDateISOString ? parseISO(date) : new Date(date), timeFormat);
  } catch {
    return date.toString();
  }
};

export const parseDate = (dateString: string, dateFormat = 'dd MMM yyyy') => {
  try {
    return parse(dateString, dateFormat, new Date());
  } catch {
    return null;
  }
};

export function isValidDate(date?: Date): boolean {
  return (date && !isNaN(date.getTime())) || false;
}

export function normalizeDate(date: Date) {
  return new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
}

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 * Please use getUTCDate instead.
 */
export function dateWithoutHours(date: Date) {
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

export const timelessDateString = (date: string) => date.split('T')?.[0];

export function isNotFutureDate(value: Date | null) {
  if (!value || !isValid(value)) return true;
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const pastDate = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  return isBefore(pastDate, today) || isEqual(pastDate, today);
}

export const ZERO_FULL_ISO_TIME = '0Y0M0W0D';

export const isoTimeToText = (
  globalsOrGetLabel: CmsGlobals | null | ((key: string) => string),
  isoString: string,
  timeValuesLimit?: number,
) => {
  const years = isoTimeToYears(isoString);
  const months = isoTimeToMonths(isoString);
  const weeks = isoTimeToWeeks(isoString);
  const days = isoTimeToDays(isoString);
  const getLabel = (key: string) =>
    typeof globalsOrGetLabel === 'function' ? globalsOrGetLabel(key) : extractLabelByKey(globalsOrGetLabel, key);

  if (!years && !months && !weeks && !days) {
    return null;
  }

  const yearsLabelKey = years && years > 1 ? 'years' : 'year';
  const monthsLabelKey = months && months > 1 ? 'months' : 'month';
  const weeksLabelKey = weeks && weeks > 1 ? 'weeks' : 'week';
  const daysLabelKey = days && days > 1 ? 'days' : 'day';

  const yearsText = years ? `${years} ${getLabel(yearsLabelKey)}` : '';
  const monthsText = months ? `${months} ${getLabel(monthsLabelKey)}` : '';
  const weeksText = weeks ? `${weeks} ${getLabel(weeksLabelKey)}` : '';
  const daysText = days ? `${days} ${getLabel(daysLabelKey)}` : '';
  const list = [yearsText, monthsText, weeksText, daysText].filter(Boolean);

  return timeValuesLimit ? list.slice(0, timeValuesLimit).join(', ') : list.join(', ');
};

export const isoTimeToYears = (isoString: string) => Number(isoString.match(/(\d+)Y/)?.[1]);
export const isoTimeToMonths = (isoString: string) => Number(isoString.match(/(\d+)M/)?.[1]);
export const isoTimeToWeeks = (isoString: string) => Number(isoString.match(/(\d+)W/)?.[1]);
export const isoTimeToDays = (isoString: string) => Number(isoString.match(/(\d+)D/)?.[1]);

export function addIsoTimeToDate(date: Date, isoTime: string) {
  const years = isoTimeToYears(isoTime) || 0;
  const months = isoTimeToMonths(isoTime) || 0;
  const weeks = isoTimeToWeeks(isoTime) || 0;
  const days = isoTimeToDays(isoTime) || 0;

  return addDays(addWeeks(addMonths(addYears(date, years), months), weeks), days);
}

export function getNextTaxDate(isNextPaymentYear: boolean = true) {
  const now = getUTCDate(new Date());
  const nextYear = addYears(now, 1);
  return setMonth(setDate(isNextPaymentYear ? nextYear : now, 6), 3);
}

/**
 * Strip off all time information *and* convert the result to 00:00:00 UTC.
 *
 * Use this when you want “the same UTC day” regardless of the user’s local time zone.
 *
 * @param {Date} date - The date to be modified
 * @returns {Date} - The date with the time set to 00:00:00
 */
export const getUTCDate = (date: Date | string) => {
  const inputDate = new Date(date);
  return new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate()));
};

/**
 * Strip off all time information *but* keep the same Y/M/D in the local time zone.
 *
 * Use this when you care only about the calendar date the user selected,
 * and you don’t want any implicit UTC-shifts to move it a day forward/back.
 *
 * @param date the input Date (or null/undefined)
 * @returns a new Date at local midnight of the same Y/M/D, or the original falsy/invalid value
 */
export function getLocalStartOfDay(date: Date | string | null | undefined): Date | null | undefined {
  if (date == null) return date;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return d;
  return startOfDay(d);
}

/**
 * Calculates either the minimum or maximum date based on a base date plus ISO duration, and a comparison date.
 *
 * @param {Object} params - The parameters object
 * @param {'min' | 'max'} params.condition - Specify either 'min' or 'max' date
 * @param {Date} params.baseDate - The date from which the isoTime will be added
 * @param {string} params.isoTime - ISO duration string
 * @param {Date | null} params.comparisonDate - Date to compare against
 * @returns {Date} - The calculated date
 */
export function getMinMaxDate({
  condition,
  baseDate,
  addIsoTime,
  comparisonDate,
}: {
  condition: 'min' | 'max';
  baseDate: Date;
  addIsoTime: string;
  comparisonDate: Date | null;
}): Date {
  const calculatedDate = addIsoTimeToDate(baseDate, addIsoTime);

  if (comparisonDate) {
    return condition === 'max'
      ? new Date(Math.max(calculatedDate.getTime(), comparisonDate.getTime()))
      : new Date(Math.min(calculatedDate.getTime(), comparisonDate.getTime()));
  }

  return calculatedDate;
}

export function createAllowedDateChecker(
  extraDates: string[],
  fromDate?: Date,
  toDate?: Date,
): (date: Date) => boolean {
  const extraAllowed = extraDates.map(date => new Date(date));

  return (date: Date) => {
    const inRange =
      fromDate && toDate && isWithinInterval(date, { start: startOfDay(fromDate), end: endOfDay(toDate) });
    const isExtra = extraAllowed.some(allowedDate => isSameDay(date, allowedDate));
    return inRange || isExtra;
  };
}

/**
 * Serialize a Date to a local ISO-style string (YYYY-MM-DD), without converting to UTC.
 *
 */
export function toLocalISOString(date: Date | null | undefined): string | undefined {
  if (!date) return undefined;
  return format(date, 'yyyy-MM-dd');
}
