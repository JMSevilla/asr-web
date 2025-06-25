import { ValueFormatType } from '../../../../api/content/types/common';
import { DataSummaryItemValue } from '../../../../api/content/types/data-summary';
import { ParsedButtonProps } from '../../../../cms/parse-cms';
import { DataSummaryValueItem } from './DataSummaryValueItem';

interface Props {
  loading: boolean;
  itemIndex: number;
  blockIndex: number;
  item: DataSummaryItemValue;
  parseItemValue(item: DataSummaryItemValue): {
    format?: ValueFormatType;
    value?: string;
    isHidden?: boolean;
  };
  button?: ParsedButtonProps | null;
  pageKey: string;
  isButtonColumnHidden?: boolean;
}

export const DataSummaryValue: React.FC<Props> = ({
  pageKey,
  loading,
  itemIndex,
  blockIndex,
  item,
  button,
  isButtonColumnHidden,
  parseItemValue,
}) => {
  if (item.elements.format.value?.selection === 'Multirows') {
    const itemValue = parseItemValue(item);
    const rows = (itemValue.value as unknown as { key: string; value: number | string }[]) || [];

    return (
      <>
        {rows.map((row, idx) => (
          <DataSummaryValueItem
            key={[itemIndex, idx].join('-')}
            item={parseItem(item, row)}
            itemIndex={itemIndex}
            blockIndex={blockIndex}
            parseItemValue={parseItemValue}
            loading={loading}
            isButtonColumnHidden={isButtonColumnHidden}
            button={idx === 0 ? button : null}
            pageKey={pageKey}
          />
        ))}
      </>
    );
  }

  return (
    <DataSummaryValueItem
      key={itemIndex}
      item={item}
      itemIndex={itemIndex}
      blockIndex={blockIndex}
      parseItemValue={parseItemValue}
      loading={loading}
      isButtonColumnHidden={isButtonColumnHidden}
      button={button}
      pageKey={pageKey}
    />
  );

  function parseItem(item: DataSummaryItemValue, row: { key: string; value: number | string }): DataSummaryItemValue {
    return {
      ...item,
      elements: {
        ...item.elements,
        header: { ...item.elements.header, value: row.key },
        value: { ...item.elements.value, value: row.value.toString() },
        format: { ...item.elements.format, value: { label: 'Label', selection: 'Label' } },
      },
    };
  }
};
