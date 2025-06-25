import { DataSummaryBlocksValue, DataSummaryItemValue } from '../../api/content/types/data-summary';
import { SummaryItemValue } from '../../api/content/types/retirement';
import {
  parseDataSummaryItemFormatAndValue,
  parseSummaryBlocksVisibility,
  parseSummaryItemsVisibility,
} from '../../business/data-summary';

const DATA: Record<string, string | Record<string, any> | null> = {
  referenceNumber: '7000003',
  businessGroup: 'LIF',
  fullName: 'XXXXXX XXXXX',
  emailAddress: 'test@towerswatson.com',
  phone: '+999 99999999',
  dateOfBirth: '1964-01-03T00:00:00+00:00',
  address: { lines: ['X'], country: 'XXXXXX XXXXXXX', countryCode: 'GB', postCode: null },
  journey: {
    type: 'dcretirementapplication',
    status: 'started',
    expirationDate: '2024-04-03T08:25:28.388865+00:00',
    preJourneyData: {
      SelectedQuoteDetails: {
        totalFundValue: 130901.31,
        incomeDrawdownTFC_taxableUFPLS: 98175.98,
        incomeDrawdownTFC_taxFreeUFPLS: 32725.33,
        incomeDrawdownTFC_optionNumber: 6,
        totalLTAUsedPerc: 12.18,
        selectedQuoteFullName: 'incomeDrawdownTFC',
      },
      DC_options_filter_retirement_date: { retirementDate: '2024-09-07T20:59:59.999Z', retirementAge: 60 },
    },
    stepsWithData: {
      DC_LS_purpose_fund: {
        designation_of_funds_strategies_strategy: { code: 'LIFELSLT', name: 'LifeSight Long Term Income Fund' },
      },
      DC_options_timetable: {
        SelectedQuoteDetails: {
          totalFundValue: 130901.31,
          incomeDrawdownTFC_taxableUFPLS: 98175.98,
          incomeDrawdownTFC_taxFreeUFPLS: 32725.33,
          incomeDrawdownTFC_optionNumber: 6,
          totalLTAUsedPerc: 12.18,
          selectedQuoteFullName: 'incomeDrawdownTFC',
        },
        DC_options_filter_retirement_date: { retirementDate: '2024-09-07T20:59:59.999Z', retirementAge: 60 },
      },
      DC_LS_lump_sum: { dc_retirement_option_change_lump_sum_dc_lump_sum_recalculate: { taxFreeLumpSum: 32725.2 } },
    },
    stepsWithQuestion: {
      DC_pw_question: {
        DC_pw_question: { answerKey: 'none', answerValue: 'No, I haven’t received guidance from Pension Wise' },
      },
      'DC_lta_question-transfer': {
        DC_LTA_1: {
          answerKey: 'no',
          answerValue:
            'No, I haven’t previously transferred other pension benefits from the UK to a qualifying recognised overseas pension scheme (QROPS)',
        },
      },
      'DC_lta_question-taken-2': {
        DC_LTA_2_A: { answerKey: 'no', answerValue: 'No, I haven’t taken benefits from another pension' },
      },
      'DC_lta_question-registrat': {
        LTA_0: { answerKey: 'no', answerValue: 'I have not registered for LTA protections' },
      },
      'DC_lta_question-date-2': {
        DC_LTA_3_A: {
          answerKey: 'no',
          answerValue:
            'No, I will not transfer to a qualifying recognised overseas pension scheme (QROPS) or take any other pension benefits before my retirement date',
        },
      },
      DC_lumpsum_reinvest: {
        TFCR_1: { answerKey: 'no', answerValue: 'No, I do not plan to reinvest my tax-free cash in another pension' },
      },
      DC_LS_Invst_strat: {
        dc_ls_strategy_questions: {
          answerKey: 'dc_ls_option1',
          answerValue: 'Option 1: LifeSight Purpose Built Funds',
        },
      },
    },
    stepsWithCheckboxes: {
      DC_LS_confirm_submit: {
        dc_ls_confirming_checklist: {
          dc_ls_confirming_confirm: { answerValue: true },
          dc_ls_confirm_risk: { answerValue: true },
        },
      },
      DC_pw_opt_out: { DC_PW_opt_out_list_key: { DC_PW_opt_out_checkbox: { answerValue: true } } },
      DC_LS_risks: { dc_ls_risks_checkbox: { dc_ls_risks_I_have_read: { answerValue: true } } },
    },
  },
  bankAccount: {
    accountName: 'test',
    accountNumber: '70872490',
    iban: null,
    sortCode: '404784',
    bic: null,
    clearingCode: null,
    bankName: 'First Direct, a division of HSBC UK',
    bankCity: 'Leeds',
    bankCountry: 'GB',
    bankCountryCode: 'GB',
  },
  uploadedFilesNames: [],
  emptyString: '',
};

const ITEM: SummaryItemValue = {
  elements: {
    description: { elementType: 'text', value: '' },
    divider: { elementType: 'toggle', value: false },
    explanationSummaryItems: { elementType: 'reference' },
    format: { value: { label: 'Text', selection: 'Text' } },
    header: { elementType: 'text', value: 'Benefits from another pension' },
    link: { elementType: 'text', value: '' },
    linkText: { elementType: 'text', value: 'Change' },
    showDespiteEmpty: { elementType: 'toggle', value: false },
    tooltip: { elementType: 'reference' },
    value: { elementType: 'text', value: 'journey.stepsWithQuestion.DC_lta_question-taken-2.DC_LTA_2_A.answerValue' },
  },
  type: 'Summary item',
};

const summaryBlocks: Partial<DataSummaryBlocksValue>[] = [
  {
    elements: {
      header: { value: '' },
      highlightedBackground: { value: false },
      summaryItems: {
        values: [
          {
            elements: {
              value: { value: 'param1' },
            },
          },
          {
            elements: {
              value: { value: 'param2' },
            },
          },
        ] as DataSummaryItemValue[],
      },
    },
  },
  {
    elements: {
      header: { value: '' },
      highlightedBackground: { value: false },
      summaryItems: {
        values: [
          {
            elements: {
              value: { value: 'param2' },
            },
          },
        ] as DataSummaryItemValue[],
      },
    },
  },
];

const data = {
  param1: 'a',
};

describe('Business Data Summary logic', () => {
  describe('parseDataSummaryItemFormatAndValue', () => {
    it('should parse item with Currency format correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      expect(
        parseDataSummaryItemFormatAndValue(
          {
            ...ITEM,
            elements: {
              ...ITEM.elements,
              format: { value: { label: 'Currency', selection: 'Currency' } },
              value: {
                elementType: 'text',
                value: 'journey.stepsWithData.DC_options_timetable.SelectedQuoteDetails.totalFundValue',
              },
            },
          },
          labelByKeyMock,
          DATA as Record<string, string>,
        ),
      ).toEqual({ format: 'Currency', value: '[[currency:GBP]]130,901.31' });
    });
    it('should parse item with Date format correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      expect(
        parseDataSummaryItemFormatAndValue(
          {
            ...ITEM,
            elements: {
              ...ITEM.elements,
              format: { value: { label: 'Date', selection: 'Date' } },
              value: {
                elementType: 'text',
                value: 'dateOfBirth',
              },
            },
          },
          labelByKeyMock,
          DATA as Record<string, string>,
        ),
      ).toEqual({ format: 'Date', value: '03 Jan 1964' });
    });
    it('should parse item with SortCode format correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      expect(
        parseDataSummaryItemFormatAndValue(
          {
            ...ITEM,
            elements: {
              ...ITEM.elements,
              format: { value: { label: 'SortCode', selection: 'SortCode' } },
              value: {
                elementType: 'text',
                value: 'bankAccount.sortCode',
              },
            },
          },
          labelByKeyMock,
          DATA as Record<string, string>,
        ),
      ).toEqual({ format: 'SortCode', value: '40-47-84' });
    });
    it('should parse item with Text format correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      expect(parseDataSummaryItemFormatAndValue(ITEM, labelByKeyMock, DATA as Record<string, string>)).toEqual({
        format: 'Text',
        value: 'No, I haven’t taken benefits from another pension',
      });
    });
    it('should parse item property isHidden if there is no correct value', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      expect(
        parseDataSummaryItemFormatAndValue(
          {
            ...ITEM,
            elements: {
              ...ITEM.elements,
              value: {
                elementType: 'text',
                value: 'test.test',
              },
            },
          },
          labelByKeyMock,
          DATA as Record<string, string>,
        ),
      ).toEqual({ isHidden: true });

      expect(
        parseDataSummaryItemFormatAndValue(
          {
            ...ITEM,
            elements: {
              ...ITEM.elements,
              value: {
                elementType: 'text',
                value: 'emptyString',
              },
            },
          },
          labelByKeyMock,
          DATA as Record<string, string>,
        ),
      ).toEqual({ isHidden: true });
    });
    it('should parse item with showDespiteEmpty property "true" correctly', () => {
      const labelByKeyMock = jest.fn((key: string) => `[[${key}]]`);
      expect(
        parseDataSummaryItemFormatAndValue(
          {
            ...ITEM,
            elements: {
              ...ITEM.elements,
              format: { value: { label: 'Text', selection: 'Text' } },
              showDespiteEmpty: { elementType: 'toggle', value: true },
              value: {
                elementType: 'text',
                value: '',
              },
            },
          },
          labelByKeyMock,
          DATA as Record<string, string>,
        ),
      ).toEqual({ format: 'Text', value: '-' });
    });
  });
  describe('parseSummaryBlocksVisibility', () => {
    it('should return an empty array if data is not found', () => {
      expect(parseSummaryBlocksVisibility(summaryBlocks as DataSummaryBlocksValue[], undefined)).toEqual([]);
    });

    it('should return one summary block', () => {
      expect(parseSummaryBlocksVisibility(summaryBlocks as DataSummaryBlocksValue[], data)).toEqual([summaryBlocks[0]]);
    });
  });

  describe('parseSummaryItemsVisibility', () => {
    it('should return an empty array if data is not found', () => {
      expect(
        parseSummaryItemsVisibility(summaryBlocks[0].elements?.summaryItems.values as DataSummaryItemValue[], {}),
      ).toEqual([]);
    });

    it('should return one summary item ', () => {
      expect(
        parseSummaryItemsVisibility(summaryBlocks[0].elements?.summaryItems.values as DataSummaryItemValue[], data),
      ).toEqual([summaryBlocks[0].elements?.summaryItems.values[0]]);
    });
  });
});
