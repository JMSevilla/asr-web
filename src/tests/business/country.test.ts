import { countryByCode, countryCurrencyByCode, isIbanMandatoryByCountryCode } from '../../business/country';

describe('Business country logic', () => {
  describe('findValueByKey', () => {
    it('should find existing parameter value', () => {
      expect(countryByCode('AF')).toEqual('Afghanistan');
    });
  });
  describe('countryCurrencyByCode', () => {
    it('should find existing parameter value', () => {
      expect(countryCurrencyByCode('AF')).toEqual('AFN');
    });
  });
  describe('isIbanMandatoryByCountryCode', () => {
    it('should find existing parameter value', () => {
      expect(isIbanMandatoryByCountryCode('DE')).toBe(true);
      expect(isIbanMandatoryByCountryCode('US')).toBe(false);
    });
  });
});
