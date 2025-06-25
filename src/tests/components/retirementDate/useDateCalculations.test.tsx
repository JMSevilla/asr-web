import { addYears, differenceInYears, parseISO } from 'date-fns';
import { act } from 'react-dom/test-utils';
import { RetirementDate } from '../../../api/mdp/types';
import { getUTCDate } from '../../../business/dates';
import { useDateCalculations } from '../../../components/blocks/datePicker/retirementDate/useDateCalculations';
import { renderHook } from '../../common';

const DEFAULT_RETIREMENT_DATE: RetirementDate = {
  isCalculationSuccessful: true,
  retirementDate: new Date('2025-01-01').toISOString(),
  dateOfBirth: new Date('1950-01-01').toISOString(),
  availableRetirementDateRange: {
    from: new Date('2020-01-01').toISOString(),
    to: new Date('2030-01-01').toISOString(),
  },
};

jest.mock('../../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({ update: jest.fn() }),
}));

describe('useDateCalculations', () => {
  it('should return correctly formatted values', () => {
    const { result } = renderHook(() => useDateCalculations(DEFAULT_RETIREMENT_DATE));
    expect(result.current.ageOptions).toStrictEqual(Array.from(Array(80 + 1).keys()).slice(70));
    expect(result.current.dateFrom).toStrictEqual(parseISO(DEFAULT_RETIREMENT_DATE.availableRetirementDateRange.from));
    expect(result.current.dateTo).toStrictEqual(parseISO(DEFAULT_RETIREMENT_DATE.availableRetirementDateRange.to));
    expect(result.current.dateOfBirth).toStrictEqual(getUTCDate(parseISO(DEFAULT_RETIREMENT_DATE.dateOfBirth)));
    expect(result.current.selectedDate).toStrictEqual(parseISO(DEFAULT_RETIREMENT_DATE.retirementDate));
    expect(result.current.lastValidDate).toStrictEqual(parseISO(DEFAULT_RETIREMENT_DATE.retirementDate));
    expect(result.current.selectedAge).toStrictEqual(
      differenceInYears(
        parseISO(DEFAULT_RETIREMENT_DATE.retirementDate),
        getUTCDate(parseISO(DEFAULT_RETIREMENT_DATE.dateOfBirth)),
      ),
    );
  });

  it('should update selectedAge and selectedDate on changeAge call', () => {
    const { result } = renderHook(() => useDateCalculations(DEFAULT_RETIREMENT_DATE));
    const age = 80;
    act(() => {
      result.current.changeAge(age);
    });
    expect(result.current.selectedAge).toStrictEqual(age);
    expect(result.current.selectedDate).toStrictEqual(
      addYears(getUTCDate(parseISO(DEFAULT_RETIREMENT_DATE.dateOfBirth)), age),
    );
  });

  it('should update selectedAge and selectedDate on changeDate call', () => {
    const { result } = renderHook(() => useDateCalculations(DEFAULT_RETIREMENT_DATE));
    const date = new Date('2028-01-01');
    act(() => {
      result.current.changeDate(date);
    });
    expect(result.current.selectedAge).toStrictEqual(
      differenceInYears(date, getUTCDate(parseISO(DEFAULT_RETIREMENT_DATE.dateOfBirth))),
    );
    expect(result.current.selectedDate).toStrictEqual(date);
  });

  it('should update lastValidDate on confirmSelectedDateIsValid call', () => {
    const { result } = renderHook(() => useDateCalculations(DEFAULT_RETIREMENT_DATE));
    const date = new Date('2028-01-01');
    act(() => {
      result.current.changeDate(date);
    });
    expect(result.current.lastValidDate).not.toStrictEqual(date);
    act(() => result.current.confirmSelectedDateIsValid());
    expect(result.current.lastValidDate).toStrictEqual(date);
  });

  it('should return quotesRetirementDate date if it exist', () => {
    const date = new Date('2028-01-01');
    const { result } = renderHook(() => useDateCalculations(DEFAULT_RETIREMENT_DATE, '12', true, date));

    expect(result.current.selectedDate).toStrictEqual(date);
  });
});
