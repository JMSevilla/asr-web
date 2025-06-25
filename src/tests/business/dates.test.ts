import { addDays, addMonths, addWeeks, addYears, isAfter, isValid, parseISO, setDate, setMonth } from 'date-fns';
import { CmsGlobals } from '../../api/content/types/globals';
import {
  addIsoTimeToDate,
  createAllowedDateChecker,
  formatDate,
  formatTime,
  getLocalStartOfDay,
  getMinMaxDate,
  getNextTaxDate,
  getUTCDate,
  isNotFutureDate,
  isValidDate,
  isoTimeToText,
  normalizeDate,
  rawDateFromISOString,
  timelessDateString,
  toLocalISOString,
  zonedDate,
} from '../../business/dates';

const GLOBALS: CmsGlobals = {
  labels: [
    {
      elements: {
        labelKey: { elementType: 'type', value: 'years' },
        labelText: { elementType: '', value: 'Years' },
        linkTarget: { elementType: 'type', value: '' },
      },
      type: 'Label',
    },
    {
      elements: {
        labelKey: { elementType: 'type', value: 'months' },
        labelText: { elementType: '', value: 'Months' },
        linkTarget: { elementType: 'type', value: '' },
      },
      type: 'Label',
    },
    {
      elements: {
        labelKey: { elementType: 'type', value: 'days' },
        labelText: { elementType: '', value: 'Days' },
        linkTarget: { elementType: 'type', value: '' },
      },
      type: 'Label',
    },
  ],
};

describe('Business dates logic', () => {
  describe('formatDate', () => {
    test('should return correct date string', () => {
      expect(formatDate('2021-06-14T00:00:00+00:00')).toBe('14 Jun 2021');
      expect(formatDate('14 June 2021')).toBe('14 Jun 2021');
    });
  });

  describe('rawDateFromISOString', () => {
    test('should return correct date string', () => {
      expect(rawDateFromISOString('2021-06-14T00:00:00+00:00')).toBe('14 Jun 2021');
    });
  });

  describe('zonedDate', () => {
    test('zonedDate should return correct date', () => {
      expect(zonedDate(new Date('2021-06-14T00:00:00+00:00')).toISOString()).toBe('2021-06-14T00:00:00.000Z');
    });
  });

  describe('isValidDate', () => {
    it('undefined should be invalid date', () => {
      expect(isValidDate()).toBe(false);
    });

    it('current Date should be valid date', () => {
      expect(isValidDate(new Date())).toBe(true);
    });
  });

  describe('normalizeDate', () => {
    it('should normalize date', () => {
      const date = new Date('Fri, 25 Mar 2022 15:07:08 GMT+2');
      const normalizedDate = new Date(
        new Date('Fri, 25 Mar 2022 15:07:08 GMT+2').getTime() + Math.abs(date.getTimezoneOffset() * 60000),
      );

      expect(normalizeDate(date).toISOString()).toBe(normalizedDate.toISOString());
    });
  });

  describe('timelessDateString', () => {
    it('should return timeless date string', () => {
      const date = '1959-03-29T23:59:59+00:00';

      expect(timelessDateString(date)).toBe('1959-03-29');
    });
  });

  describe('formatTime', () => {
    it('should format time', () => {
      const date = new Date('Fri, 25 Mar 2022 15:07:08 GMT+2');
      const normalizedDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
      const hours = normalizedDate.getHours() < 10 ? `0${normalizedDate.getHours()}` : normalizedDate.getHours();
      const minutes =
        normalizedDate.getMinutes() < 10 ? `0${normalizedDate.getMinutes()}` : normalizedDate.getMinutes();
      expect(formatTime(normalizedDate)).toBe(`${hours}:${minutes}`);
    });
  });

  describe('isNotFutureDate', () => {
    test('isNotFutureDate should return true for a past or present date', () => {
      const pastDate = new Date('2021-06-14');
      expect(isNotFutureDate(pastDate)).toBe(true);

      const currentDate = new Date(timelessDateString(new Date().toISOString()));
      expect(isNotFutureDate(currentDate)).toBe(true);
      expect(isNotFutureDate(null)).toBe(true);
    });

    test('isNotFutureDate should return false for a future date', () => {
      const currentDate = new Date(timelessDateString(new Date().toISOString()));
      const futureDate = addDays(currentDate, 10);

      expect(isAfter(futureDate, currentDate)).toBe(true);
      expect(isNotFutureDate(futureDate)).toBe(false);
    });
  });

  describe('isoTimeToText', () => {
    test('isoTimeToText should return null for empty string', () => {
      expect(isoTimeToText({}, '')).toBe(null);
    });

    test('isoTimeToText should return translated and formatted date', () => {
      expect(isoTimeToText(GLOBALS, '61Y11M0W5D')).toBe('61 Years, 11 Months, 5 Days');
    });

    test('isoTimeToText should return the first two non-zero values from date', () => {
      expect(isoTimeToText({}, '0Y11M0W5D', 2)).toBe('11 [[label:months]], 5 [[label:days]]');
    });

    test('isoTimeToText should return correct values when provided with label function', () => {
      const labelByKey = (key: string) => `[[label:${key}]]`;
      expect(isoTimeToText(labelByKey, '0Y11M0W5D', 2)).toBe('11 [[label:months]], 5 [[label:days]]');
    });
  });

  describe('getNextTaxDate', () => {
    it('should return next tax year date', () => {
      const nextTaxDate = setMonth(setDate(addYears(new Date(), 1), 6), 3);
      const date = getNextTaxDate();
      expect(date.getFullYear).toBe(nextTaxDate.getFullYear);
      expect(date.getMonth).toBe(nextTaxDate.getMonth);
      expect(date.getDate).toBe(nextTaxDate.getDate);
    });

    it('should return same tax year date', () => {
      const nextTaxDate = setMonth(setDate(new Date(), 6), 3);
      const date = getNextTaxDate(true);
      expect(date.getFullYear).toBe(nextTaxDate.getFullYear);
      expect(date.getMonth).toBe(nextTaxDate.getMonth);
      expect(date.getDate).toBe(nextTaxDate.getDate);
    });
  });

  describe('addIsoTimeToDate', () => {
    test('addIsoTimeToDate should return date with added iso time', () => {
      const date = new Date('2021-06-14');
      const isoTime = '1Y1M1W1D';
      const expectedDate = addDays(addYears(addMonths(addWeeks(date, 1), 1), 1), 1);
      expect(addIsoTimeToDate(date, isoTime).toISOString()).toBe(expectedDate.toISOString());
    });
  });

  describe('getMinMaxDate', () => {
    test('should return the maximum date', () => {
      const baseDate = new Date('2022-01-01');
      const comparisonDate = new Date('2024-01-01');
      const isoTime = '1Y';
      const result = getMinMaxDate({
        condition: 'max',
        baseDate,
        addIsoTime: isoTime,
        comparisonDate,
      });
      expect(result.toISOString()).toBe(new Date('2024-01-01').toISOString());
    });

    test('should return the minimum date', () => {
      const baseDate = new Date('2022-01-01');
      const comparisonDate = new Date('2024-01-01');
      const isoTime = '1Y';
      const result = getMinMaxDate({
        condition: 'min',
        baseDate,
        addIsoTime: isoTime,
        comparisonDate,
      });
      expect(result.toISOString()).toBe(new Date('2023-01-01').toISOString());
    });

    test('should handle null comparisonDate', () => {
      const baseDate = new Date('2022-01-01');
      const isoTime = '1Y';
      const result = getMinMaxDate({
        condition: 'max',
        baseDate,
        addIsoTime: isoTime,
        comparisonDate: null,
      });
      expect(result.toISOString()).toBe(new Date('2023-01-01').toISOString());
    });
  });
  describe('createAllowedDateChecker (with optional range)', () => {
    const extraDates = ['2012-01-01', '2000-01-01'];
    const from = parseISO('2025-05-01T00:00:00+00:00');
    const to = parseISO('2038-02-01T00:00:00+00:00');
    const checker = createAllowedDateChecker(extraDates, from, to);

    it('should allow a date inside the range', () => {
      expect(checker(parseISO('2030-01-01'))).toBe(true);
    });

    it('should allow boundary dates', () => {
      expect(checker(from)).toBe(true);
      expect(checker(to)).toBe(true);
    });

    it('should disallow a date just outside the range', () => {
      expect(checker(parseISO('2025-04-30'))).toBe(false);
      expect(checker(parseISO('2038-02-02'))).toBe(false);
    });

    it('should allow extra allowed dates outside the range', () => {
      expect(checker(parseISO('2012-01-01'))).toBe(true);
      expect(checker(parseISO('2000-01-01'))).toBe(true);
    });

    it('should disallow unrelated dates not in range or extra list', () => {
      expect(checker(parseISO('2010-05-05'))).toBe(false);
      expect(checker(parseISO('1999-12-31'))).toBe(false);
    });
  });

  describe('createAllowedDateChecker (no range)', () => {
    const extraDates = ['2012-01-01', '2000-01-01'];
    const checker = createAllowedDateChecker(extraDates);

    it('should allow only explicitly allowed extra dates', () => {
      expect(checker(parseISO('2012-01-01'))).toBe(true);
      expect(checker(parseISO('2000-01-01'))).toBe(true);
    });

    it('should disallow any date not in extra list', () => {
      expect(checker(parseISO('2025-01-01'))).toBe(false);
      expect(checker(parseISO('2030-06-15'))).toBe(false);
    });
  });

  describe('getUTCDate', () => {
    it('zeroes time and returns 00:00:00Z for a Date input', () => {
      const input = new Date('2025-05-10T12:34:56Z');
      const result = getUTCDate(input);
      expect(result.toISOString()).toBe('2025-05-10T00:00:00.000Z');
    });

    it('zeroes time and returns 00:00:00Z for a string input', () => {
      const input = '2025-05-10T23:59:59Z';
      const result = getUTCDate(input);
      expect(result.toISOString()).toBe('2025-05-10T00:00:00.000Z');
    });
  });

  describe('getLocalStartOfDay', () => {
    it('zeroes time but keeps the same local Y/M/D', () => {
      const input = new Date('2025-05-10T12:34:56Z');
      const result = getLocalStartOfDay(input)!;

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(10);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });

    it('returns null for null input', () => {
      expect(getLocalStartOfDay(null)).toBeNull();
    });

    it('returns undefined for undefined input', () => {
      expect(getLocalStartOfDay(undefined)).toBeUndefined();
    });

    it('returns the original object for an invalid date', () => {
      const badDate = new Date('not-a-date');
      expect(isValid(badDate)).toBe(false);
      const result = getLocalStartOfDay(badDate);
      expect(result).toBe(badDate);
    });
  });

  describe('toLocalISOString', () => {
    it('formats a Date to YYYY-MM-DD using local values', () => {
      const dt = new Date(2025, 4, 10, 23, 59, 59);
      expect(toLocalISOString(dt)).toBe('2025-05-10');
    });

    it('pads single-digit months and days', () => {
      const dt = new Date(2025, 0, 5);
      expect(toLocalISOString(dt)).toBe('2025-01-05');
    });

    it('returns undefined for null or undefined', () => {
      expect(toLocalISOString(null)).toBeUndefined();
      expect(toLocalISOString(undefined)).toBeUndefined();
    });
  });
});


