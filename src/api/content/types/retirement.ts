import { BooleanValue, CMSValue, CallToAction, FormatSelection, NumberValue, StringValue } from './common';

export type RetirementOptionsList = RetirementOptionsListItem[];

export interface RetirementOptionsListItem {
  elements: RetirementOptionElements;
  type: string;
}

interface RetirementOptionElements {
  bottomInformation?: StringValue;
  callToAction?: CallToAction;
  dependsOnTransfer?: Partial<BooleanValue>;
  distributedLayoutOfSummaryItems?: BooleanValue;
  description: StringValue;
  header: StringValue;
  headerTooltip?: Tooltip;
  key: StringValue;
  link: StringValue;
  linkText: StringValue;
  orderNo: NumberValue;
  summaryItems: { values: SummaryItemValue[] };
  type?: StringValue;
}

export interface RetirementOptionSummary {
  elements: {
    key: StringValue;
    description?: { value?: DescriptionValue };
    summaryBlocks: { values: SummaryBlocksValue[] };
  };
  type: string;
}

export interface DescriptionValue {
  elements?: { content?: StringValue };
  type: string;
}

export interface SummaryBlocksValue {
  elements: {
    header: StringValue;
    highlightedBackground: BooleanValue;
    summaryItems: { values: SummaryItemValue[] };
  };
  type: string;
}

export interface SummaryItemValue {
  elements: SummaryItemElements;
  type: string;
}

interface SummaryItemElements {
  description: StringValue;
  divider: BooleanValue;
  explanationSummaryItems: ExplanationSummaryItems;
  format: FormatSelection;
  header: StringValue;
  link: StringValue;
  linkText: StringValue;
  tooltip: Tooltip;
  value: StringValue;
  showDespiteEmpty?: BooleanValue;
}

interface ExplanationSummaryItems {
  elementType?: string;
  values?: {
    elements: SummaryItemElements;
    type: string;
  }[];
}

interface Tooltip extends CMSValue {
  value?: {
    elements: {
      contentText: StringValue;
      linkText: StringValue;
      tooltipKey: StringValue;
      headerText: StringValue;
    };
    type: string;
  };
}

export type selectableRetirementDateRange = {
  minRetirementDate: Date;
  maxRetirementDate: Date;
};

export type selectableRetirementDateRangeParams = {
  earliestRetirementDate: Date | string;
  dateOfBirth: Date | string;
  minDateOffset: string;
  maxDateOffset: string;
  fetchedMinDate?: Date | string;
  fetchedMaxDate?: Date | string;
};
