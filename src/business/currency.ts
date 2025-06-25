import { NA_SYMBOL } from './constants';
import { storedCountries } from './country';

const countries = storedCountries();

export const currencyValue = (value?: number | string | null) =>
  typeof value === 'undefined' || value === null || Number.isNaN(Number(value))
    ? NA_SYMBOL
    : Number(value)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const currencyToNumber = (value: string) => Number(value.replace(/,/g, ''));

export const calculatePercentage = (total: number, value: number) => ((value / total) * 100).toFixed(2);
export const constructBankAccountCurriencies = (currency?: string) => {
  const alreadyInTheList = currency && !!DEFAULT_BANK_ACCOUNT_CURRENCIES.find(item => item.value === currency);

  return currency && !alreadyInTheList
    ? [{ value: currency, label: constructCurrencyLabel(currency) }, ...DEFAULT_BANK_ACCOUNT_CURRENCIES]
    : [...DEFAULT_BANK_ACCOUNT_CURRENCIES];
};

export const constructCurrencyLabel = (code: string) => {
  const name = countries?.find(country => country?.currencyCode === code)?.currencyName;
  return name ? `${code} - ${name}` : code;
};

export const DEFAULT_BANK_ACCOUNT_CURRENCIES = [
  { value: 'GBP', label: constructCurrencyLabel('GBP') },
  { value: 'USD', label: constructCurrencyLabel('USD') },
  { value: 'EUR', label: constructCurrencyLabel('EUR') },
];

export const currencyCodeToName = (code: string) => {
  const name = countries?.find(country => country?.currencyCode === code)?.currencyName;
  return name!;
};
