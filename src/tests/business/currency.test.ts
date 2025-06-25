import { NA_SYMBOL } from '../../business/constants';
import {
  calculatePercentage,
  constructBankAccountCurriencies,
  currencyCodeToName,
  currencyValue,
} from '../../business/currency';

describe('Business currency logic', () => {
  describe('currencyValue', () => {
    it('should return same number if number not longer than 3 digits', () => {
      expect(currencyValue('100')).toBe('100.00');
    });

    it('should return number split by comma every third digit', () => {
      expect(currencyValue('1000')).toBe('1,000.00');
    });

    it('should return "-" if number is undefined', () => {
      expect(currencyValue()).toBe(NA_SYMBOL);
    });

    it('should return "-" if number is null', () => {
      expect(currencyValue(null)).toBe(NA_SYMBOL);
    });

    it('should return "-" if number is NaN', () => {
      expect(currencyValue('a')).toBe(NA_SYMBOL);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(100, 25)).toBe('25.00');
    });

    it('should handle zero total value', () => {
      expect(calculatePercentage(0, 10)).toBe('Infinity');
    });

    it('should handle zero value', () => {
      expect(calculatePercentage(100, 0)).toBe('0.00');
    });

    it('should handle large numbers', () => {
      expect(calculatePercentage(1000000, 500000)).toBe('50.00');
    });
  });

  describe('constructBankAccountCurriencies', () => {
    it('should return currency options correctly', () => {
      const currency = 'GBP';
      const array = [
        { value: 'GBP', label: 'GBP - Pound Sterling' },
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
      ];
      const result = constructBankAccountCurriencies(currency);
      expect(result).toEqual(array);
      expect(constructBankAccountCurriencies('GBP')).toEqual(array);
      expect(constructBankAccountCurriencies('USD')).toEqual(array);
      expect(constructBankAccountCurriencies('EUR')).toEqual(array);
    });
  });
  describe('currencyCodeToName', () => {
    it('should return currency name correctly', () => {
      expect(currencyCodeToName('GBP')).toEqual('Pound Sterling');
      expect(currencyCodeToName('USD')).toEqual('US Dollar');
      expect(currencyCodeToName('EUR')).toEqual('Euro');
    });
  });
});
