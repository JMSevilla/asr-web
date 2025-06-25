import { endOfDay, startOfDay } from 'date-fns';
import { RetirementDate, RetirementQuotesV3Response } from '../../api/mdp/types';
import {
  findRetirementOptionValueByKey,
  normalizeRetirementDate,
  parseRetirementSummaryItemFormatAndValue,
  retirementValuePathToKeys,
  selectableRetirementDateRangeDB,
} from '../../business/retirement';

const MDP_OPTIONS_MOCK: Pick<RetirementQuotesV3Response, 'quotes'> = {
  quotes: {
    options: {
      first: { options: { option1: { attributes: { value: 0 } }, option2: { attributes: { value: 2 } } } },
      second: { options: { option3: { attributes: { value: 3 } }, option4: { attributes: { value: 4 } } } },
    },
  },
};

describe('Retirement logic', () => {
  describe('findRetirementOptionValueByKey', () => {
    it('should return correct option if keys are valid', () => {
      expect(findRetirementOptionValueByKey(MDP_OPTIONS_MOCK.quotes, 'first', 'option1', 'value')).toBe(
        MDP_OPTIONS_MOCK.quotes.options!['first'].options!['option1'].attributes!['value'],
      );
      expect(findRetirementOptionValueByKey(MDP_OPTIONS_MOCK.quotes, 'second', 'option4', 'value')).toBe(
        MDP_OPTIONS_MOCK.quotes.options!['second'].options!['option4'].attributes!['value'],
      );
    });

    it('should return null if keys are invalid', () => {
      expect(findRetirementOptionValueByKey(MDP_OPTIONS_MOCK.quotes, 'second', 'option3', 'otherValue')).toBe(null);
      expect(findRetirementOptionValueByKey(MDP_OPTIONS_MOCK.quotes, 'third', 'option5')).toBe(null);
    });
  });

  describe('retirementValuePathToKeys', () => {
    it('should parse keys correctly', () => {
      expect(retirementValuePathToKeys({ elements: { value: { value: 'first.option1.value' } } } as any)).toEqual([
        'first',
        'option1',
        'value',
      ]);
      expect(retirementValuePathToKeys({ elements: { value: { value: 'second.option4.value' } } } as any)).toEqual([
        'second',
        'option4',
        'value',
      ]);
    });
  });

  describe('parseRetirementSummaryItemFormatAndValue', () => {
    it('should return correct value when format is Text', () => {
      const item = {
        elements: {
          format: { value: { selection: 'Text' } },
          value: { value: 'value' },
        },
      };
      expect(parseRetirementSummaryItemFormatAndValue(item as any, () => '', MDP_OPTIONS_MOCK.quotes)).toEqual({
        format: 'Text',
        value: 'value',
      });
    });

    it('should return correct value when format is Currency', () => {
      const item = {
        elements: {
          format: { value: { selection: 'Currency' } },
          value: { value: 'first.option1.value' },
        },
      };
      expect(parseRetirementSummaryItemFormatAndValue(item as any, () => '', MDP_OPTIONS_MOCK.quotes)).toEqual({
        format: 'Currency',
        value: '0.00',
      });
    });

    it('should return correct value when format is Currency per year', () => {
      const item = {
        elements: {
          format: { value: { selection: 'Currency per year' } },
          value: { value: 'first.option2.value' },
        },
      };
      expect(parseRetirementSummaryItemFormatAndValue(item as any, () => '', MDP_OPTIONS_MOCK.quotes)).toEqual({
        format: 'Currency per year',
        value: '2.00/',
      });
    });

    it('should return empty value when format is invalid', () => {
      const item = {
        elements: {
          format: { value: { selection: 'Invalid' } },
          value: { value: 'first.option1.value' },
        },
      };
      expect(parseRetirementSummaryItemFormatAndValue(item as any, () => '', MDP_OPTIONS_MOCK.quotes)).toEqual({
        format: 'Invalid',
        value: ' ',
      });
    });
  });

  describe('normalizeRetirementDate', () => {
    it('should correctly normalize date', () => {
      const retirementDateWithTimezonePlus4: RetirementDate = {
        isCalculationSuccessful: true,
        retirementDate: '2020-01-01T02:00:00+04:00',
        dateOfBirth: '1980-01-01T02:00:00+04:00',
        availableRetirementDateRange: {
          from: '2020-01-01T02:00:00+04:00',
          to: '2020-10-01T02:00:00+04:00',
        },
        guaranteedQuoteEffectiveDateList: ['2020-10-01T02:00:00+04:00'],
      };
      expect(normalizeRetirementDate(retirementDateWithTimezonePlus4)).toStrictEqual({
        isCalculationSuccessful: true,
        retirementDate: 'Wed, 01 Jan 2020 00:00:00 GMT',
        dateOfBirth: 'Tue, 01 Jan 1980 00:00:00 GMT',
        availableRetirementDateRange: {
          from: 'Wed, 01 Jan 2020 00:00:00 GMT',
          to: 'Thu, 01 Oct 2020 00:00:00 GMT',
        },
        guaranteedQuoteEffectiveDateList: ['Thu, 01 Oct 2020 00:00:00 GMT'],
      });
    });
  });

  describe('selectableRetirementDateRangeDB', () => {
    beforeEach(() => {
      jest.spyOn(require('../../business/dates'), 'getMinMaxDate').mockReturnValue(new Date('2024-01-01T00:00:00Z'));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return calculatedMinDate and calculatedMaxDate when minDateOffset and maxDateOffset are provided', () => {
      const params = {
        earliestRetirementDate: '2024-01-01',
        dateOfBirth: '1980-01-01',
        minDateOffset: '30D',
        maxDateOffset: '60D',
        fetchedMinDate: '2024-01-10',
        fetchedMaxDate: '2024-12-31',
      };

      const result = selectableRetirementDateRangeDB(params);

      expect(result.minRetirementDate).toEqual(startOfDay(new Date('2024-01-01T00:00:00Z')));
      expect(result.maxRetirementDate).toEqual(endOfDay(new Date('2024-01-01T00:00:00Z')));
    });

    it('should return fetchedMinDate and fetchedMaxDate when minDateOffset and maxDateOffset are not provided', () => {
      const params = {
        earliestRetirementDate: '2024-01-01',
        dateOfBirth: '1980-01-01',
        minDateOffset: '',
        maxDateOffset: '',
        fetchedMinDate: '2024-01-10',
        fetchedMaxDate: '2024-12-31',
      };

      const result = selectableRetirementDateRangeDB(params);

      expect(result.minRetirementDate).toEqual(new Date('2024-01-10'));
      expect(result.maxRetirementDate).toEqual(new Date('2024-12-31'));
    });
  });
});
