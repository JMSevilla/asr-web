import { RetirementOptionSummary, SummaryItemValue } from '../../../api/content/types/retirement';
import { RetirementQuotesV3Response } from '../../../api/mdp/types';

const type = '',
  elementType = 'text',
  key = { value: 'key', elementType: 'text' };

const createSummaryBlock = (
  header: string,
  summaryItems: SummaryItemValue[] = [],
): RetirementOptionSummary['elements']['summaryBlocks']['values'][number] => ({
  type,
  elements: {
    header: { ...key, value: header },
    highlightedBackground: { elementType, value: false },
    summaryItems: { values: summaryItems },
  },
});

const createSummaryItem = (
  value: string,
  format: NonNullable<SummaryItemValue['elements']['format']['value']>['label'],
  explanationSummaryItems: SummaryItemValue[] = [],
): SummaryItemValue => ({
  type,
  elements: {
    link: key,
    tooltip: {},
    header: key,
    linkText: key,
    description: key,
    value: { ...key, value },
    divider: { ...key, value: false },
    explanationSummaryItems: { values: explanationSummaryItems },
    format: { ...key, value: { label: format, selection: format } },
  },
});

export const MDP_OPTIONS_MOCK: Pick<RetirementQuotesV3Response, 'quotes'> = {
  quotes: {
    options: {
      first: {
        options: {
          option1: {
            attributes: { attribute1: 100 },
            options: { option1X: { attributes: { attribute1X: 100, attribute1Y: null } } },
          },
          option2: { attributes: { attribute1: 100, attribute2: 200 } },
        },
      },
      second: { options: { option3: { attributes: { attributeX: 'simple text', attributeY: 10, attributeZ: null } } } },
    },
  },
};

export const SUMMARY_OPTION_MOCK: RetirementOptionSummary = {
  type,
  elements: {
    key,
    description: { value: { elements: { content: {value: ""}}, type: ""}},
    summaryBlocks: {
      values: [
        createSummaryBlock('head1', [
          createSummaryItem('first.option1.attribute1', 'Currency', [
            createSummaryItem('first.option1.option1X.attribute1X', 'Currency'),
            createSummaryItem('first.option1.option1X.attribute1Y', 'Text'),
          ]),
          createSummaryItem('first.option2.attribute2', 'Currency per year', [
            createSummaryItem('second.option3.attributeZ', 'Currency per year'), // no value
            createSummaryItem('first.option1.option1X.attribute1Y', 'Currency'), // no value
          ]),
        ]),
        createSummaryBlock('head2', [
          createSummaryItem('second.option3.attributeX', 'Text'),
          createSummaryItem('second.option3.attributeY', 'Text'),
          createSummaryItem('second.option3.attributeZ', 'Text'),
          createSummaryItem('second.option3.attributeZ', 'Currency'), // no value
        ]),
      ],
    },
  },
};
