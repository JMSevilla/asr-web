import { DEFAULT_PHONE_COUNTRY_CODE, PHONE_CODES } from './constants';

type PhoneForm = { phone?: string; phoneCode?: string };

export const joinPhoneNumberWithCode = ({ phone, phoneCode }: PhoneForm) =>
  phoneCode && phone ? [phoneCodeFromCountry(phoneCode), phone].join(' ') : undefined;

export const extractPhoneNumberWithCode = ({ phone: phoneWithCode }: PhoneForm) => {
  const [code, phone] = phoneWithCode?.split(' ') ?? [undefined, undefined];
  return { phoneCode: code ? countryFromPhoneCode(code) : DEFAULT_PHONE_COUNTRY_CODE, phone };
};

export const isPhoneCodeValid = (phoneCode?: string) =>
  !!PHONE_CODES.find(code => code.dial_code === addPlusToCode(phoneCode));

export const countryFromPhoneCode = (phoneCode: string) =>
  PHONE_CODES.find(pc => pc.dial_code === addPlusToCode(phoneCode))!.code;

export const phoneCodeFromCountry = (countryCode: string) => PHONE_CODES.find(pc => pc.code === countryCode)!.dial_code;

const addPlusToCode = (code?: string) => (code?.includes('+') ? code : `+${code}`);
