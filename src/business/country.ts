import { CountryCurrencyItem } from '../api/mdp/types';
import { getItem } from '../core/session-storage';
import { COUNTRY_LIST, IBAN_COUNTRY_CODES } from './constants';

export const storedCountries = () => {
  const storedCountries = getItem<CountryCurrencyItem[]>('countries-currencies');
  return storedCountries || COUNTRY_LIST;
};
const countries = storedCountries();

export const countryByCode = (code: string) => countries?.find(country => country?.countryCode === code)?.countryName;
export const countryCurrencyByCode = (code: string) => {
  return countries?.find(country => country?.countryCode === code)?.currencyCode;
};
export const isIbanMandatoryByCountryCode = (code: string): boolean => IBAN_COUNTRY_CODES.includes(code);
