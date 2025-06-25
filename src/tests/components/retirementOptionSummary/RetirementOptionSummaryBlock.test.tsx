import { ComponentProps } from 'react';
import { act } from 'react-dom/test-utils';
import { RetirementOptionSummaryBlock } from '../../../components';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';
import { render, screen, waitFor } from '../../common';
import { MDP_OPTIONS_MOCK, SUMMARY_OPTION_MOCK } from './mock';

const DEFAULT_PROPS: ComponentProps<typeof RetirementOptionSummaryBlock> = {
  id: 'id',
  pageKey: 'page',
  parameters: [],
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
    parseUrlAndPush: jest.fn(),
    parsedQuery: { type: 'quote' },
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: null }, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({
    result: { data: null },
    loading: false,
    execute: () => Promise.resolve({ result: { data: null } }),
  }),
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null }),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    retirementCalculation: undefined,
    retirementCalculationLoading: false,
    transferOptions: undefined,
    transferOptionsLoading: false,
    quotesOptions: undefined,
    quotesOptionsError: undefined,
    quotesOptionsLoading: false,
    refreshQuotesOptions: jest.fn(),
  }),
}));

jest.mock('../../../cms/inject-tokens', () => ({
  useTokenEnrichedValue: (object: Object) => object,
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {} } }),
}));

describe('RetirementOptionSummaryBlock', () => {
  it('should display summary', () => {
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('option-summary')).toBeTruthy();
  });

  it('should display loader', () => {
    jest.mocked(useApi).mockReturnValueOnce({ loading: true } as any);
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('option-summary-loader')).toBeTruthy();
  });

  it('should display all summary blocks', () => {
    jest.mocked(useRetirementContext).mockReturnValueOnce({
      quotesOptions: MDP_OPTIONS_MOCK,
      refreshQuotesOptions: jest.fn(),
    } as any);
    jest.mocked(useApi).mockReturnValueOnce({ result: { data: SUMMARY_OPTION_MOCK } } as any);
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);
    SUMMARY_OPTION_MOCK.elements.summaryBlocks.values.forEach(block =>
      expect(screen.queryByText(block.elements.header.value!)).toBeTruthy(),
    );
  });

  it('should display all summary block items', () => {
    jest.mocked(useRetirementContext).mockReturnValueOnce({
      quotesOptions: MDP_OPTIONS_MOCK,
      refreshQuotesOptions: jest.fn(),
    } as any);
    jest.mocked(useApi).mockReturnValueOnce({ result: { data: SUMMARY_OPTION_MOCK } } as any);
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);
    SUMMARY_OPTION_MOCK.elements.summaryBlocks.values[0].elements.summaryItems.values.forEach((_, idx) =>
      expect(screen.queryByTestId(`summary-block-${0}-item-${idx}`)).toBeTruthy(),
    );
  });

  it('should filter summary block items correctly', () => {
    jest.mocked(useRetirementContext).mockReturnValueOnce({
      quotesOptions: MDP_OPTIONS_MOCK,
      refreshQuotesOptions: jest.fn(),
    } as any);
    jest.mocked(useApi).mockReturnValueOnce({ result: { data: SUMMARY_OPTION_MOCK } } as any);
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);

    const secondBlockSummaryItems = SUMMARY_OPTION_MOCK.elements.summaryBlocks.values[1].elements.summaryItems.values;
    const secondBlockSummaryItemsWithValues = secondBlockSummaryItems.slice(0, 3);
    const secondBlockSummaryItemsWithoutValues = secondBlockSummaryItems.slice(3);
    secondBlockSummaryItemsWithValues.forEach((_, idx) =>
      expect(screen.queryByTestId(`summary-block-${1}-item-${idx}`)).toBeTruthy(),
    );
    expect(
      screen.queryByTestId(
        `summary-block-${1}-item-${secondBlockSummaryItems.length - secondBlockSummaryItemsWithoutValues.length}`,
      ),
    ).toBeFalsy();
  });

  it('should display summary block item explanation items', () => {
    jest.mocked(useRetirementContext).mockReturnValueOnce({
      quotesOptions: MDP_OPTIONS_MOCK,
      refreshQuotesOptions: jest.fn(),
    } as any);
    jest.mocked(useApi).mockReturnValueOnce({ result: { data: SUMMARY_OPTION_MOCK } } as any);
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);

    SUMMARY_OPTION_MOCK.elements.summaryBlocks.values[0].elements.summaryItems.values[0].elements.explanationSummaryItems.values?.forEach(
      (_, idx) => expect(screen.queryByTestId(`summary-block-${0}-item-${0}-explanation-${idx}`)).toBeTruthy(),
    );
  });

  it('should display summary block item explanation item loaders', () => {
    jest.mocked(useRetirementContext).mockReturnValueOnce({
      quotesOptions: MDP_OPTIONS_MOCK,
      refreshQuotesOptions: jest.fn(),
      quotesOptionsLoading: true,
    } as any);
    jest.mocked(useApi).mockReturnValueOnce({ result: { data: SUMMARY_OPTION_MOCK } } as any);
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);

    SUMMARY_OPTION_MOCK.elements.summaryBlocks.values[0].elements.summaryItems.values[0].elements.explanationSummaryItems.values?.forEach(
      (_, idx) => expect(screen.queryByTestId(`summary-block-${0}-item-${idx}-loader`)).toBeTruthy(),
    );
  });

  it('should filter summary block item explanation items', () => {
    jest.mocked(useRetirementContext).mockReturnValueOnce({
      quotesOptions: MDP_OPTIONS_MOCK,
      refreshQuotesOptions: jest.fn(),
    } as any);
    jest.mocked(useApi).mockReturnValueOnce({ result: { data: SUMMARY_OPTION_MOCK } } as any);
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);

    SUMMARY_OPTION_MOCK.elements.summaryBlocks.values[0].elements.summaryItems.values[1].elements.explanationSummaryItems.values?.forEach(
      (_, idx) => expect(screen.queryByTestId(`summary-block-${0}-item-${1}-explanation-${idx}`)).toBeFalsy(),
    );
  });

  it('should call router.push on summary item action click', async () => {
    const navigateFn = jest.fn();
    jest.mocked(useRetirementContext).mockReturnValueOnce({
      quotesOptions: MDP_OPTIONS_MOCK,
      refreshQuotesOptions: jest.fn(),
    } as any);
    jest.mocked(useApi).mockReturnValueOnce({ result: { data: SUMMARY_OPTION_MOCK } } as any);
    jest.mocked(useRouter).mockReturnValueOnce({ loading: false, parseUrlAndPush: navigateFn } as any);
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      execute: (key: string) => Promise.resolve({ data: { url: key } }),
    } as any);
    render(<RetirementOptionSummaryBlock {...DEFAULT_PROPS} />);

    act(() => screen.queryByTestId('summary-block-0-item-0-action-btn')?.click());
    await waitFor(() => expect(navigateFn).toBeCalled());
  });
});
