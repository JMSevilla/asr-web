import { NA_SYMBOL } from '../../../business/constants';
import { useTransferSummaryDetailsValues } from '../../../components/blocks/transferSummary/hooks';
import { TransferData } from '../../../components/blocks/transferSummary/types';
import { useApi } from '../../../core/hooks/useApi';
import { renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: undefined, loading: false }),
}));

describe('useTransferSummaryDetailsValues', () => {
  afterAll(jest.resetAllMocks);

  it('should return correct props', () => {
    jest.mocked(useApi).mockReturnValueOnce({
      loading: false,
      result: {
        transferData: {},
        uploadedFiles: {},
        personalDetails: {},
        userAddress: {},
        userPhone: {},
        userEmail: {},
        identityFiles: {},
      },
    } as any);
    const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));
    expect(result.current.loading).toBeFalsy();
    expect(result.current.parseConsent).toBeTruthy();
    expect(result.current.parseValue).toBeTruthy();
    expect(result.current.parseUserValue).toBeTruthy();
    expect(result.current.parsePensionWiseLabel).toBeTruthy();
    expect(result.current.parsePensionWiseValue).toBeTruthy();
    expect(result.current.parseFlexibleBenefitsValue).toBeTruthy();
  });

  describe('parseConsent', () => {
    it('should parse consent correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseConsent(PERSON_TYPE)).toBe(true);
      expect(result.current.parseConsent('person')).toBe(false);
    });
  });
  describe('parseValue', () => {
    it('should parse address correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'address')).toEqual(['line1', 'line2', 'line3', 'line4', 'line5']);
      expect(result.current.parseValue('no_data', 'address')).toBe(NA_SYMBOL);
    });
    it('should parse phone correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'phone')).toBe('+370 12345678');
      expect(result.current.parseValue('no_data', 'phone')).toBe(undefined);
    });
    it('should parse dateOfBirth correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'dateOfBirth')).toBe('19 Sep 2023');
      expect(result.current.parseValue('no_data', 'dateOfBirth')).toBe(NA_SYMBOL);
    });
    it('should parse country correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'country')).toBe('Lithuania');
      expect(result.current.parseValue('no_data', 'country')).toBe(NA_SYMBOL);
    });
    it('should parse postCode correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'postCode')).toBe('postCode');
      expect(result.current.parseValue('no_data', 'postCode')).toBe(NA_SYMBOL);
    });
    it('should parse question correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'question')).toBe('[[t2_transfer_advice_key]]');
    });
    it('should parse question correctly with no data', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: {
          ...TRANSFER_DATA,
          transferData: {
            ...TRANSFER_DATA?.transferData,
            questionForms: [],
          },
        },
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseValue('no_data', 'question')).toBe(undefined);
    });
    it('should parse consent question correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'consent')).toBe('[[yes]]');
    });
    it('should parse consent question correctly with no data', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: {
          ...TRANSFER_DATA,
          transferData: {
            ...TRANSFER_DATA?.transferData,
            questionForms: [],
          },
        },
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseValue('no_data', 'consent')).toBe(undefined);
    });
    it('should parse occupationalQuestion correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'occupationalQuestion')).toBe('[[t3_occupational_question_key]]');
    });
    it('should parse uploaded files list correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'uploaded')).toEqual(['filename', 'filename1']);
    });
    it('should parse uploaded identity files list correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'uploadedIdentity')).toEqual(['identity_doc1.pdf', 'identity_doc2.jpg']);
    });
    it('should return undefined when no identity files are uploaded', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: {
          ...TRANSFER_DATA,
          identityFiles: [],
        },
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseValue(PERSON_TYPE, 'uploadedIdentity')).toBeUndefined();
    });
    it('should parse default values correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      //ignore typescript to test default switch case
      //@ts-ignore
      expect(result.current.parseValue(PERSON_TYPE, 'test1')).toEqual('test1');
      //@ts-ignore
      expect(result.current.parseValue(PERSON_TYPE, 'test2')).toEqual('test2');
      //@ts-ignore
      expect(result.current.parseValue(PERSON_TYPE, 'test3')).toEqual(NA_SYMBOL);
    });
  });
  describe('parseUserValue', () => {
    it('should parse user address correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseUserValue('', 'address')).toEqual([
        'streetAddress1',
        'streetAddress2',
        'streetAddress3',
        'streetAddress4',
        'streetAddress5',
      ]);
    });
    it('should parse user name correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseUserValue('', 'name')).toBe('Title\nname surname');
    });
    it('should parse user phone correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseUserValue('', 'phone')).toBe('+370 12345678');
    });
    it('should parse user date of birth correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseUserValue('', 'dateOfBirth')).toBe('19 Sep 2023');
    });
    it('should parse user country correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseUserValue('', 'country')).toBe('Lithuania');
    });
    it('should parse user post code correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseUserValue('', 'postCode')).toBe('postCode');
    });
    it('should parse user email correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseUserValue('', 'email')).toBe('user@email.com');
    });
  });
  describe('parseFlexibleBenefitsValue', () => {
    it('should parse benefitsTaken correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseFlexibleBenefitsValue('', 'benefitsTaken')).toBe('[[t3_flexible_benefits_q_key]]');
    });
    it('should not hide rest if question key value is "yes"', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseFlexibleBenefitsValue('', 'shouldHideRest')).toBe(false);
    });
    it('should hide rest if question key value is "no"', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: {
          ...TRANSFER_DATA,
          transferData: {
            ...TRANSFER_DATA?.transferData,
            questionForms: [
              {
                questionKey: `t3_flexible_benefits_q`,
                answerKey: 'no',
                answerValue: 'no',
              },
            ],
          },
        },
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseFlexibleBenefitsValue('', 'shouldHideRest')).toBe(true);
    });
    it('should parse nameOfPlan correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseFlexibleBenefitsValue('', 'nameOfPlan')).toBe('nameOfPlan');
    });
    it('should parse typeOfPayment correctly', () => {
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(jest.fn(), 'transfer2'));

      expect(result.current.parseFlexibleBenefitsValue('', 'typeOfPayment')).toBe('typeOfPayment');
    });
    it('should parse dateOfPayment correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parseFlexibleBenefitsValue('', 'dateOfPayment')).toBe('19 Sep 2023');
    });
  });
  describe('parsePensionWiseValue', () => {
    it('should parse question correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: TRANSFER_DATA,
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parsePensionWiseValue('', 'question')).toBe('[[t3_pw_question_key]]');
    });
    it('should shouldHideRest return true if question key none', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: {
          ...TRANSFER_DATA,
          transferData: {
            ...TRANSFER_DATA?.transferData,
            questionForms: [
              {
                questionKey: `t3_pw_question`,
                answerKey: 'none',
                answerValue: 'none',
              },
            ],
          },
        },
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parsePensionWiseValue('', 'shouldHideRest')).toBe(true);
    });
    it('should pensionWiseDate return financialAdviseDate if question key no_fca', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: {
          ...TRANSFER_DATA,
          transferData: {
            ...TRANSFER_DATA?.transferData,
            questionForms: [
              {
                questionKey: `t3_pw_question`,
                answerKey: 'no_fca',
                answerValue: 'no_fca',
              },
            ],
          },
        },
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parsePensionWiseValue('', 'pensionWiseDate')).toBe('10 Sep 2023');
    });
    it('should pensionWiseDate return pensionWiseDate if question key is not no_fca', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      jest.mocked(useApi).mockReturnValueOnce({
        loading: false,
        result: {
          ...TRANSFER_DATA,
          transferData: {
            ...TRANSFER_DATA?.transferData,
            questionForms: [
              {
                questionKey: `t3_pw_question`,
                answerKey: 'not_no_fca',
                answerValue: 'not_no_fca',
              },
            ],
          },
        },
      } as any);
      const { result } = renderHook(() => useTransferSummaryDetailsValues(labelByKeyMock, 'transfer2'));

      expect(result.current.parsePensionWiseValue('', 'pensionWiseDate')).toBe('11 Sep 2023');
    });
  });
});

const PERSON_TYPE = 'person_type';
const USER_ADDRESS = {
  streetAddress1: 'streetAddress1',
  streetAddress2: 'streetAddress2',
  streetAddress3: 'streetAddress3',
  streetAddress4: 'streetAddress4',
  streetAddress5: 'streetAddress5',
  country: 'Lithuania',
  postCode: 'postCode',
  countryCode: 'LT',
};
const ADDRESS = {
  line1: 'line1',
  line2: 'line2',
  line3: 'line3',
  line4: 'line4',
  line5: 'line5',
  country: 'Lithuania',
  postCode: 'postCode',
  countryCode: 'LT',
};
const PHONE = {
  number: '12345678',
  code: '370',
};

const TRANSFER_DATA: TransferData | undefined = {
  transferData: {
    startDate: 'startDate',
    flexibleBenefits: {
      nameOfPlan: 'nameOfPlan',
      typeOfPayment: 'typeOfPayment',
      dateOfPayment: '2023-09-19',
    },
    pensionWiseDate: '2023-09-11',
    financialAdviseDate: '2023-09-10',
    transferJourneyContacts: undefined,
    questionForms: [
      { questionKey: `${PERSON_TYPE}_consent_question`, answerKey: 'yes', answerValue: 'yes' },
      {
        questionKey: `t2_transfer_advice`,
        answerKey: 't2_transfer_advice_key',
        answerValue: 't2_transfer_advice_value',
      },
      {
        questionKey: `t3_occupational_question`,
        answerKey: 't3_occupational_question_key',
        answerValue: 't3_occupational_question_value',
      },
      {
        questionKey: `t3_flexible_benefits_q`,
        answerKey: 't3_flexible_benefits_q_key',
        answerValue: 't3_flexible_benefits_q_value',
      },
      {
        questionKey: `t3_flexible_benefits_q`,
        answerKey: 'yes',
        answerValue: 'yes',
      },
      {
        questionKey: `t3_pw_question`,
        answerKey: 't3_pw_question_key',
        answerValue: 't3_pw_question_value',
      },
    ],
    journeyGenericDataList: [
      {
        formKey: `person_address_data_person_type`,
        genericDataJson: JSON.stringify({ address: ADDRESS }),
      },
      {
        formKey: `person_data_person_type`,
        genericDataJson: JSON.stringify({
          phoneCode: '370',
          phoneNumber: '12345678',
          dateOfBirth: new Date('2023-09-19'),
          test1: 'test1',
          test2: 'test2',
        }),
      },
    ],
    totalGuaranteedTransferValue: 99,
    totalNonGuaranteedTransferValue: 100,
    transferApplicationStatus: '',
    submissionDate: '',
    submitByDate: '',
  },
  uploadedFiles: [
    {
      uuid: 'uuid',
      filename: 'filename',
      tags: [],
    },
    {
      uuid: 'uuid1',
      filename: 'filename1',
      tags: [],
    },
  ],
  personalDetails: {
    title: 'tITlE',
    gender: 'gender',
    name: 'name surname',
    dateOfBirth: '2023-09-19',
    insuranceNumber: 'string',
  },
  userAddress: USER_ADDRESS,
  userPhone: PHONE,
  userEmail: { email: 'user@email.com' },
  identityFiles: [
    {
      uuid: 'identity-uuid-1',
      filename: 'identity_doc1.pdf',
      tags: [],
    },
    {
      uuid: 'identity-uuid-2',
      filename: 'identity_doc2.jpg',
      tags: [],
    },
  ],
};
