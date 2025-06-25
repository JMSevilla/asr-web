import { ComponentProps } from 'react';
import { DataSummaryBlock } from '../../../components/blocks/dataSummary/DataSummaryBlock';
import { useApi } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: null, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ transfer: { value: 'transfer' } }),
}));

const DEFAULT_PROPS: ComponentProps<typeof DataSummaryBlock> = {
  id: 'id',
  sourceUrl: 'sourceUrl',
  summaryBlocks: [
    {
      type: 'summaryBlock',
      elements: {
        header: { value: 'header' },
        highlightedBackground: { value: true },
        summaryItems: {
          values: [
            {
              type: 'summaryItem',
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
            },
          ],
        },
      },
    },
  ],
  journeyType: 'transfer2',
  pageKey: 'pageKey',
};

describe('DataSummaryBlock', () => {
  it('should not render without items', () => {
    render(<DataSummaryBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('data-summary')).not.toBeInTheDocument();
  });

  it('should render loader', () => {
    jest.mocked(useApi).mockReturnValueOnce({ result: null, loading: true } as any);
    render(<DataSummaryBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('data-summary-loader')).toBeTruthy();
  });

  it('should render summary with correct items', () => {
    const displayedValue = 'test value';
    const filteredValue = 'filtered value';
    jest.mocked(useApi).mockReturnValue({
      result: {
        data: { param1: displayedValue, param2: filteredValue },
        blocks: DEFAULT_PROPS.summaryBlocks,
      },
      loading: false,
    } as any);
    render(<DataSummaryBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('data-summary')).toBeTruthy();
    expect(screen.getByText(displayedValue)).toBeTruthy();
    expect(screen.queryByText(filteredValue)).not.toBeInTheDocument();
  });
});
