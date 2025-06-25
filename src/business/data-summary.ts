import { ValueFormatType } from '../api/content/types/common';
import { DataSummaryBlocksValue, DataSummaryItemValue } from '../api/content/types/data-summary';
import { SummaryItemValue } from '../api/content/types/retirement';
import { currencyValue } from './currency';
import { formatDate } from './dates';

export const DATA_SUMMARY_VALUE_PATH_DELIMITER = '.';

export function findDataSummaryValueByKey(data: any, path: string): string | undefined {
  const paths = path.split(DATA_SUMMARY_VALUE_PATH_DELIMITER) ?? [];
  let current = data;

  for (let i = 0; i < paths.length; ++i) {
    if (!current || current[paths[i]] === undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }

  return current;
}

export function parseDataSummaryItemFormatAndValue(
  item: SummaryItemValue,
  labelByKey: (key: string) => string,
  data?: Record<string, string>,
): { format?: ValueFormatType; value?: string; isHidden?: boolean } {
  const {
    elements: {
      format: { value: { selection: valueFormat } = { selection: undefined } },
      value: { value: itemValue },
      showDespiteEmpty: showDespiteEmptyValue,
    },
  } = item;

  if (!data) {
    return { isHidden: true };
  }

  const keepInitialValue = valueFormat === 'Label';
  const isFileList = valueFormat === 'File list';
  const isHidden = !showDespiteEmptyValue?.value;
  const initialValue = keepInitialValue ? itemValue : findDataSummaryValueByKey(data, itemValue);
  const value = !initialValue?.length && !isHidden && !isFileList ? '-' : initialValue;

  if (
    isHidden &&
    ((typeof value === 'string' && value.length === 0) ||
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length < 1))
  ) {
    return { isHidden: true };
  }

  if (valueFormat === 'Currency') {
    return { format: valueFormat, value: `${labelByKey('currency:GBP')}${currencyValue(value)}` };
  } else if (valueFormat === 'Currency per year') {
    return {
      format: valueFormat,
      value: `${labelByKey('currency:GBP')}${currencyValue(value)}/${labelByKey('year')}`,
    };
  } else if (valueFormat === 'Date' && value) {
    return { format: valueFormat, value: formatDate(value) };
  } else if (valueFormat === 'SortCode' && value) {
    return { format: valueFormat, value: value.replace(/.{2}\B/g, '$&-') };
  }

  return { format: valueFormat, value };
}

export function parseSummaryBlocksVisibility(summaryBlocks?: DataSummaryBlocksValue[], data?: Record<string, string>) {
  if (!data) {
    return [];
  }

  return summaryBlocks?.reduce((arr, block) => {
    const items = parseSummaryItemsVisibility(block.elements.summaryItems?.values, data);

    if (items.length) {
      arr.push(block);
    }

    return arr;
  }, [] as DataSummaryBlocksValue[]);
}

export function parseSummaryItemsVisibility(items: DataSummaryItemValue[], data: Record<string, string>) {
  return items?.reduce((arr, item) => {
    const {
      elements: {
        value: { value: itemValue },
        showDespiteEmpty: showDespiteEmptyValue,
      },
    } = item;

    const value = findDataSummaryValueByKey(data, itemValue);
    const isPopulatedArray = Array.isArray(value) && value.length > 0;
    const valueExists = !Array.isArray(value) && value !== undefined && value !== null;

    if (isPopulatedArray || valueExists || showDespiteEmptyValue?.value) {
      return [...arr, item];
    }

    return arr;
  }, [] as DataSummaryItemValue[]);
}
