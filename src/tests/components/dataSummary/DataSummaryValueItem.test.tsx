import { ComponentProps } from 'react';
import { DataSummaryValueItem } from '../../../components/blocks/dataSummary/DataSummaryValue/DataSummaryValueItem';
import { useRouter } from '../../../core/router';
import { act, render, screen } from '../../common';

jest.mock('../../../config', () => ({
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ transfer: { value: 'transfer' } }),
}));

const DEFAULT_PROPS: ComponentProps<typeof DataSummaryValueItem> = {
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

const FILE_ELEMENT_ITEM: ComponentProps<typeof DataSummaryValueItem>['item'] = {
  elements: {
    format: { value: { selection: 'File list', label: 'File list' } },
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
}

const DEFAULT_PROPS_WITH_FILES: ComponentProps<typeof DataSummaryValueItem> = {
  ...DEFAULT_PROPS,
  item: FILE_ELEMENT_ITEM
}


describe('DataSummaryBlock', () => {
  it('should not render if items has isHidded prop true', () => {
    render(
      <DataSummaryValueItem
        {...DEFAULT_PROPS}
        parseItemValue={jest.fn().mockReturnValue({
          format: 'Currency',
          value: 'value',
          isHidden: true,
        })}
      />,
    );
    expect(screen.queryByTestId('data-summary-block-1-item-1')).not.toBeInTheDocument();
  });

  it('should render summary item', () => {
    render(<DataSummaryValueItem {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('data-summary-block-1-item-1')).toBeInTheDocument();
    expect(screen.queryByText('value')).toBeInTheDocument();
  });

  it('should render summary item values', () => {
    render(
      <DataSummaryValueItem
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

  it('should render summary file list item values', () => {
    render(
      <DataSummaryValueItem
        {...DEFAULT_PROPS_WITH_FILES}
        parseItemValue={jest.fn().mockReturnValue({
          format: 'File list',
          value: ['file', 'file2', 'file3'],
          isHidden: false,
        })}
      />,
    );
    expect(screen.queryByText('file')).toBeInTheDocument();
    expect(screen.queryByText('file2')).toBeInTheDocument();
    expect(screen.queryByText('file3')).toBeInTheDocument();
  });


  it('should render button and redirect on click', async () => {
    const navigateFn = jest.fn();
    jest.mocked(useRouter).mockReturnValueOnce({ parseUrlAndPush: navigateFn } as any);
    render(<DataSummaryValueItem {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('summary-block-1-item-1-action-btn')).toBeInTheDocument();
    await act(async () => {
      screen.getByTestId('summary-block-1-item-1-action-btn').click();
    });
    expect(navigateFn).toHaveBeenCalled();
  });
});
