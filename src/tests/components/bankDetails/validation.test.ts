import { bankDetailsFormSchema, BankDetailsFormType } from '../../../components/blocks/bankDetailsForm/validation';
import { generateFormValues } from '../../mock';

const validGBForm: BankDetailsFormType = {
  bankCountryCode: 'GB',
  accountName: 'xxx',
  accountNumber: '12345678',
  sortCode: '123456',
  iban: undefined,
  bic: undefined,
  clearingCode: undefined,
  accountCurrency: 'GBP',
};

const validOtherCountryForm: BankDetailsFormType = {
  bankCountryCode: 'US',
  accountName: 'xxx',
  accountNumber: '12345678',
  sortCode: undefined,
  iban: '123456',
  bic: 'AAAABBCC123',
  clearingCode: '12312312',
  accountCurrency: 'USD',
};

describe('BankDetailsForm validation', () => {
  it('should validate correct GB scheme', () => {
    expect(bankDetailsFormSchema.isValidSync(generateFormValues<BankDetailsFormType>(validGBForm))).toBeTruthy();
  });

  it('should be invalid without bankCountryCode in GB scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validGBForm, { bankCountryCode: undefined }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid with too long accountName in GB scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validGBForm, {
          accountName: 'Super Long Account Name even longer than 40 symbols',
        }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid with accountNumber not digits in GB scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validGBForm, { accountNumber: 'text' }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid with accountNumber not being 8 digits in GB scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validGBForm, { accountNumber: '123123' }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid with sortCode not being 6 digits in GB scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(generateFormValues<BankDetailsFormType>(validGBForm, { accountNumber: '123' })),
    ).toBeFalsy();
  });

  it('should validate correct other country scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(generateFormValues<BankDetailsFormType>(validOtherCountryForm, {
        accountNumber: '12345678901234567890'
      })),
    ).toBeTruthy();
  });

  it('should be invalid without bankCountryCode in other country scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validOtherCountryForm, { bankCountryCode: undefined }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid with too long iban in other iban country scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validOtherCountryForm, {
          bankCountryCode: 'DE',
          iban: 'Super Long Account Name even longer than 40 symbols',
        }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid without bic code to other country scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validOtherCountryForm, { bic: undefined }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid when bic code not matches pattern in other country scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validOtherCountryForm, { bic: 's2s2s2s2s2s' }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid with clearingCode code longer than 11 symbols in other country scheme', () => {
    expect(
      bankDetailsFormSchema.isValidSync(
        generateFormValues<BankDetailsFormType>(validOtherCountryForm, { clearingCode: 'Clearing code text' }),
      ),
    ).toBeFalsy();
  });
});
