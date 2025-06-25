import { RetirementOptionsList, RetirementOptionsListItem } from '../../../api/content/types/retirement';
import { RetirementQuotesV3Response, TransferOptions } from '../../../api/mdp/types';
import { useRetirementOptionsList } from '../../../components/blocks/retirementOptionsList/useRetirementOptionsList';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi } from '../../../core/hooks/useApi';
import { useSessionStorage } from '../../../core/hooks/useSessionStorage';
import { act, renderHook } from '../../common';

const createOption = (key: string, orderNo: number, type?: string): RetirementOptionsListItem => ({
  elements: {
    description: { elementType: 'formattedtext', value: 'description' },
    header: { elementType: 'text', value: key },
    key: { elementType: 'text', value: key },
    link: { elementType: 'text', value: 'link' },
    linkText: { elementType: 'text', value: 'linkText' },
    orderNo: { elementType: 'number', value: orderNo },
    summaryItems: { values: [] },
    type: type ? { elementType: 'text', value: type } : undefined,
  },
  type: 'Retirement option',
});
const TRANSFER_OPTS_MOCK: Partial<TransferOptions> = { transferOption: 'transferOptionKey' };
const MDP_OPTIONS_MOCK: Pick<RetirementQuotesV3Response, 'quotes'> = {
  quotes: {
    options: {
      first: {
        options: { option1: { attributes: { optionNumber: 2 } }, option2: { attributes: { optionNumber: 1 } } },
      },
      second: { options: { option3: {} } },
    },
  },
};
const CONTENT_ROOT_LEVEL_OPTIONS_LIST_MOCK: RetirementOptionsList = Object.keys(
  MDP_OPTIONS_MOCK.quotes.options ?? [],
).map((key, idx) => createOption(key, idx + 1));
const CONTENT_OPTIONS_LIST_MOCK: RetirementOptionsList = [
  createOption('option1', 20),
  createOption('option2', 1, 'cash'),
  createOption('option3', 33),
  createOption(TRANSFER_OPTS_MOCK.transferOption!, 33),
];

const MDP_OPTIONS_WITH_EXPIRY_MOCK: Pick<RetirementQuotesV3Response, 'quotes'> = {
  quotes: {
    quotation: {
      expiryDate: '2023-12-31T00:00:00+00:00',
      guaranteed: true,
    },
  },
};

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null }),
}));

jest.mock('../../../core/hooks/useSessionStorage', () => ({
  useSessionStorage: jest.fn().mockReturnValue([false, jest.fn(), jest.fn()]),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({ uncachedOptions: {} }),
}));

jest.mock('../../../cms/inject-tokens', () => ({
  useTokenEnrichedValue: (object: Object) => Object.values(object).map(v => v),
}));

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: {} }, loading: false }),
}));

jest.mock('../../../business/dates', () => ({
  formatDate: jest.fn(() => 'Dec 31, 2023'),
  getUTCDate: jest.fn(date => new Date(date)),
}));

describe('useRetirementOptionsList', () => {
  it('should return correct loading, transferLoading and selectedQuoteName values', () => {
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptionsLoading: true,
      uncachedOptions: {},
      quotesOptions: { ...MDP_OPTIONS_MOCK, isCalculationSuccessful: true },
    } as any);
    jest.mocked(useApi).mockReturnValue({
      result: { data: { selectedQuoteName: 'test', ...CONTENT_OPTIONS_LIST_MOCK } },
      loading: true,
    } as any);
    const { result } = renderHook(() =>
      useRetirementOptionsList({ pageKey: 'page', journeyType: 'retirement', rootLevelList: false }),
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.transferLoading).toBe(false);
    expect(result.current.selectedQuoteName).toBe('test');
  });

  it('should return all root options when isRootLevel argument is true', () => {
    jest
      .mocked(useRetirementContext)
      .mockReturnValue({ quotesOptions: MDP_OPTIONS_MOCK, uncachedOptions: { result: MDP_OPTIONS_MOCK } } as any);
    jest.mocked(useApi).mockReturnValue({
      result: { data: CONTENT_ROOT_LEVEL_OPTIONS_LIST_MOCK },
    } as any);
    const { result } = renderHook(() =>
      useRetirementOptionsList({ pageKey: 'page', journeyType: 'retirement', rootLevelList: true }),
    );
    CONTENT_ROOT_LEVEL_OPTIONS_LIST_MOCK.forEach(contentItem => {
      const item = result.current.list.find(item => item.elements.key.value === contentItem.elements.key.value);
      expect(item).toBeTruthy();
    });
  });

  it('should return correctly filtered and leveled options when isRootLevel argument is false', () => {
    jest
      .mocked(useRetirementContext)
      .mockReturnValue({ quotesOptions: MDP_OPTIONS_MOCK, uncachedOptions: { result: MDP_OPTIONS_MOCK } } as any);
    jest
      .mocked(useApi)
      .mockReturnValue({ result: { data: { selectedQuoteName: 'first', ...CONTENT_OPTIONS_LIST_MOCK } } } as any);
    const { result } = renderHook(() =>
      useRetirementOptionsList({ pageKey: 'page', journeyType: 'retirement', rootLevelList: false }),
    );
    expect(
      result.current.list.find(item => item.elements.key.value === CONTENT_OPTIONS_LIST_MOCK[0].elements.key.value),
    ).toBeTruthy();
    expect(
      result.current.list.find(item => item.elements.key.value === CONTENT_OPTIONS_LIST_MOCK[1].elements.key.value),
    ).toBeTruthy();
    expect(
      result.current.list.find(item => item.elements.key.value === CONTENT_OPTIONS_LIST_MOCK[2].elements.key.value),
    ).toBeFalsy();
  });

  it('should not return options if isRootLevel is false and selectedQuoteName does not exist', () => {
    jest
      .mocked(useRetirementContext)
      .mockReturnValue({ quotesOptions: MDP_OPTIONS_MOCK, uncachedOptions: { result: MDP_OPTIONS_MOCK } } as any);
    jest
      .mocked(useApi)
      .mockReturnValue({ result: { data: { selectedQuoteName: undefined, ...CONTENT_OPTIONS_LIST_MOCK } } } as any);
    const { result } = renderHook(() =>
      useRetirementOptionsList({ pageKey: 'page', journeyType: 'retirement', rootLevelList: false }),
    );
    expect(result.current.list.length).toBe(0);
  });

  it('should filter options if filterParams are present', () => {
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptions: MDP_OPTIONS_MOCK,
      uncachedOptions: { result: MDP_OPTIONS_MOCK },
      filtersEnabled: true,
    } as any);
    jest.mocked(useApi).mockReturnValue({
      result: { data: { selectedQuoteName: 'first', ...CONTENT_OPTIONS_LIST_MOCK }, list: ['cash'] },
    } as any);
    const { result } = renderHook(() =>
      useRetirementOptionsList({
        pageKey: 'page',
        rootLevelList: true,
        journeyType: 'retirement',
      }),
    );
    expect(result.current.list.length).toBe(1);
  });

  it('should not filter options if filters is disabled', () => {
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptions: MDP_OPTIONS_MOCK,
      uncachedOptions: { result: MDP_OPTIONS_MOCK },
      filtersEnabled: false,
    } as any);
    jest.mocked(useApi).mockReturnValue({
      result: { data: { selectedQuoteName: 'first', ...CONTENT_OPTIONS_LIST_MOCK }, list: ['cash'] },
    } as any);
    const { result } = renderHook(() =>
      useRetirementOptionsList({
        pageKey: 'page',
        rootLevelList: true,
        journeyType: 'retirement',
      }),
    );
    expect(result.current.list.length).toBe(2);
  });

  it('should sort options by option number if shouldSortByOptionNumber is true', () => {
    jest
      .mocked(useRetirementContext)
      .mockReturnValue({ quotesOptions: MDP_OPTIONS_MOCK, uncachedOptions: { result: MDP_OPTIONS_MOCK } } as any);
    jest.mocked(useApi).mockReturnValue({
      result: { data: { selectedQuoteName: 'first', ...CONTENT_OPTIONS_LIST_MOCK } },
    } as any);
    const { result } = renderHook(() =>
      useRetirementOptionsList({
        pageKey: 'page',
        journeyType: 'retirement',
        rootLevelList: true,
        shouldSortByOptionNumber: true,
      }),
    );
    expect(result.current.list[0].elements.key.value).toBe('option2');
    expect(result.current.list[1].elements.key.value).toBe('option1');
  });

  it('should return transferOption if content options contain an option with the same key', () => {
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptions: MDP_OPTIONS_MOCK,
      uncachedOptions: { result: MDP_OPTIONS_MOCK },
      transferOptions: TRANSFER_OPTS_MOCK,
    } as any);
    jest
      .mocked(useApi)
      .mockReturnValue({ result: { data: { selectedQuoteName: undefined, ...CONTENT_OPTIONS_LIST_MOCK } } } as any);
    const { result } = renderHook(() =>
      useRetirementOptionsList({ pageKey: 'page', journeyType: 'retirement', rootLevelList: true }),
    );
    expect(result.current.transferOption).toBe(
      CONTENT_OPTIONS_LIST_MOCK.find(item => item.elements.key.value === TRANSFER_OPTS_MOCK.transferOption),
    );
  });

  it('should call onCalculationFailed callback if quotesOptions calculation fails', () => {
    const callback = jest.fn();
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptions: { ...MDP_OPTIONS_MOCK, isCalculationSuccessful: false },
      uncachedOptions: { result: MDP_OPTIONS_MOCK },
      transferOptions: TRANSFER_OPTS_MOCK,
    } as any);
    jest
      .mocked(useApi)
      .mockReturnValue({ result: { data: { selectedQuoteName: undefined, ...CONTENT_OPTIONS_LIST_MOCK } } } as any);
    jest.mocked(useSessionStorage).mockReturnValue([false, jest.fn(), jest.fn()]);
    act(() => {
      renderHook(() =>
        useRetirementOptionsList({
          pageKey: 'page',
          journeyType: 'retirement',
          rootLevelList: true,
          onCalculationFailed: callback,
        }),
      );
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should return quoteExpiryDate for guaranteed quote', async () => {
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptions: MDP_OPTIONS_WITH_EXPIRY_MOCK,
      uncachedOptions: { result: MDP_OPTIONS_WITH_EXPIRY_MOCK },
    } as any);
    jest.mocked(useApi).mockReturnValue({
      result: { data: { selectedQuoteName: 'first', ...CONTENT_OPTIONS_LIST_MOCK } },
    } as any);

    const { result } = renderHook(() =>
      useRetirementOptionsList({
        pageKey: 'page',
        journeyType: 'retirement',
        rootLevelList: false,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.quoteExpiryDate).toBe('Dec 31, 2023');
  });

  it('should return null when quotesOptions is not available', async () => {
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptions: undefined,
      uncachedOptions: { result: undefined },
    } as any);
    jest.mocked(useApi).mockReturnValue({
      result: { data: { selectedQuoteName: 'first', ...CONTENT_OPTIONS_LIST_MOCK } },
    } as any);

    const { result } = renderHook(() =>
      useRetirementOptionsList({
        pageKey: 'page',
        journeyType: 'retirement',
        rootLevelList: false,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.quoteExpiryDate).toBeNull();
  });
});
