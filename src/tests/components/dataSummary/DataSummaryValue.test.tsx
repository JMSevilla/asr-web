import { ComponentProps } from 'react';
import { DataSummaryItemValue } from '../../../api/content/types/data-summary';
import { DataSummaryValue } from '../../../components/blocks/dataSummary/DataSummaryValue/DataSummaryValue';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ transfer: { value: 'transfer' } }),
}));

const DEFAULT_PROPS: ComponentProps<typeof DataSummaryValue> = {
  loading: false,
  itemIndex: 1,
  blockIndex: 1,
  item: {
    elements: {
      format: { value: { selection: 'Text', label: 'Text' } },
      value: { value: 'param1' },
      description: { value: 'description' },
      divider: { value: true },
      explanationSummaryItems: { values: [] },
      header: { value: 'header' },
      link: { value: 'link' },
      linkText: { value: 'linkText' },
      tooltip: { value: undefined },
    },
    type: 'type',
  },
  parseItemValue: jest.fn().mockReturnValue({
    format: 'Currency',
    value: 'value',
    isHidden: false,
  }),
  button: null,
  pageKey: 'pageKey',
};

describe('DataSummaryBlock', () => {
  it('should render summary item', () => {
    render(<DataSummaryValue {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('data-summary-block-1-item-1')).toBeInTheDocument();
    expect(screen.queryByText('value')).toBeInTheDocument();
  });

  it('should render summary item values', () => {
    render(
      <DataSummaryValue
        {...DEFAULT_PROPS}
        parseItemValue={jest.fn().mockReturnValue({
          format: 'Currency',
          value: ['value', 'value2', 'value3', 'value4'],
          isHidden: false,
        })}
      />,
    );
    expect(screen.queryByText('value')).toBeInTheDocument();
    expect(screen.queryByText('value2')).toBeInTheDocument();
    expect(screen.queryByText('value3')).toBeInTheDocument();
    expect(screen.queryByText('value4')).toBeInTheDocument();
  });

  it('should render multirows', () => {
    render(
      <DataSummaryValue
        {...DEFAULT_PROPS}
        item={{
          ...DEFAULT_PROPS.item,
          elements: {
            ...DEFAULT_PROPS.item.elements,
            format: { value: { selection: 'Multirows', label: 'Multirows' } },
          },
        }}
        parseItemValue={(item: DataSummaryItemValue) =>
          item.elements.format.value?.selection === 'Multirows'
            ? {
                format: 'Label',
                value: [
                  { key: 'row1', value: 'value1' },
                  { key: 'row2', value: 'value2' },
                ] as any,
                isHidden: false,
              }
            : { format: 'Label', value: item.elements.value.value, isHidden: false }
        }
      />,
    );
    expect(screen.queryByText('row1')).toBeInTheDocument();
    expect(screen.queryByText('row1')).toBeInTheDocument();
    expect(screen.queryByText('value1')).toBeInTheDocument();
    expect(screen.queryByText('value2')).toBeInTheDocument();
  });
});
