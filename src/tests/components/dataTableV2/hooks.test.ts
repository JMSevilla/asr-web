import { DataTableColumn } from '../../../api/content/types/page';
import { NA_SYMBOL } from '../../../business/constants';
import { formatDate } from '../../../business/dates';
import {
  DEFAULT_PAGE_SIZE,
  useCachedDataTableRow,
  useCachedSelectedRow,
  useDataTableParams,
} from '../../../components/blocks/dataTable/dataTableV2/hooks';
import { DataTableRow } from '../../../components/blocks/dataTable/types';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../components/blocks/dataTable/dataTableV2/reducer', () => ({
  usePaginatedSort: jest.fn(() => ({
    sortBy: 'A',
    ascending: true,
    pageNumber: 1,
    pageSize: 5,
    sort: jest.fn(),
    setPage: jest.fn(),
    setPageSize: jest.fn(),
  })),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: [],
  }),
}));

jest.mock('../../../core/hooks/useSessionStorage', () => ({
  useSessionStorage: jest.fn(() => [{}, jest.fn()]),
}));

jest.mock('../../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn(() => ({
    tenant: { tenantUrl: { value: 'tenantUrl' } },
  })),
}));

jest.mock('../../../core/contexts/GlobalsContext', () => ({
  useGlobalsContext: jest.fn().mockReturnValue({
    labelByKey: (key: string) => `${key}`,
  }),
}));

jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useRef: jest.fn(<T>(initialValue: T) => ({
      current: initialValue,
    })),
  };
});

describe('useDataTableParams', () => {
  it('should return correct initial state', () => {
    const { result } = renderHook(() => useDataTableParams({}));
    expect(result.current.columns).toStrictEqual([]);
    expect(result.current.rows).toStrictEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.selectedRowIndex).toBe(null);
    expect(result.current.selectedRowData).toBe(null);
  });

  it('should parse columns correctly', () => {
    const columnItemParams: DataTableColumn = {
      dataField: { value: 'a' },
      alignment: { value: { label: 'Left', selection: 'Left' } },
      dataFormat: { value: { label: 'Text', selection: 'Text' } },
      header: { value: 'A' },
      widthPercentage: { value: 10 },
      enableSortability: { value: true },
    };

    const { result } = renderHook(() =>
      useDataTableParams({
        columns: [
          { ...columnItemParams, dataField: { value: 'a' } },
          { ...columnItemParams, dataField: { value: 'b' }, header: { value: 'B' } },
        ],
        tableKey: 'test-table',
        withLabelPrefix: false,
      }),
    );

    expect(result.current.columns).toHaveLength(2);
    expect(result.current.columns[0].name).toBe('A');
    expect(result.current.columns[0].align).toBe('left');
    expect(result.current.columns[0].width).toBe('10%');
    expect(result.current.columns[0].parseValue).toBeInstanceOf(Function);
    expect(result.current.columns[0].sort).toEqual({
      sorted: true,
      ascending: true,
      onClick: expect.any(Function),
    });

    expect(result.current.columns[1].name).toBe('B');
    expect(result.current.columns[1].sort?.sorted).toBe(false);
  });

  it('should parse column values correctly', () => {
    const columnItemParams: DataTableColumn = {
      dataField: { value: 'a' },
      alignment: { value: { label: 'Left', selection: 'Left' } },
      dataFormat: { value: { label: 'Text', selection: 'Text' } },
      header: { value: 'A' },
      widthPercentage: { value: 10 },
      enableSortability: { value: false },
    };

    const date = new Date();
    const { result } = renderHook(() =>
      useDataTableParams({
        columns: [
          { ...columnItemParams, dataField: { value: 'a' } },
          {
            ...columnItemParams,
            dataField: { value: 'b' },
            dataFormat: { value: { label: 'Currency', selection: 'Currency' } },
          },
          {
            ...columnItemParams,
            dataField: { value: 'c' },
            dataFormat: { value: { label: 'Date', selection: 'Date' } },
          },
          {
            ...columnItemParams,
            dataField: { value: 'd' },
          },
        ],
        tableKey: 'test-table',
      }),
    );

    expect(result.current.columns[0].parseValue({ a: 'abc' })).toBe('abc');
    expect(result.current.columns[1].parseValue({ b: '100' })).toBe('currency:GBP100.00');
    expect(result.current.columns[2].parseValue({ c: date.toISOString() })).toBe(formatDate(date));
    expect(result.current.columns[3].parseValue({})).toBe(NA_SYMBOL);
  });

  it('should parse column values with prefix correctly', () => {
    jest.mocked(useGlobalsContext).mockReturnValue({
      labelByKey: (key: string) => `[${key}]`,
    } as any);

    const columnItemParams: DataTableColumn = {
      dataField: { value: 'a' },
      alignment: { value: { label: 'Left', selection: 'Left' } },
      dataFormat: { value: { label: 'Label', selection: 'Label' } },
      header: { value: 'A' },
      widthPercentage: { value: 10 },
      enableSortability: { value: false },
    };

    const { result } = renderHook(() =>
      useDataTableParams({
        columns: [
          {
            ...columnItemParams,
            dataField: { value: 'a' },
          },
        ],
        withLabelPrefix: true,
        tableKey: 'tableKey',
      }),
    );

    expect(result.current.columns[0].parseValue({ a: 'value' })).toBe('[tableKey_value]');
  });

  it('should handle row selection correctly', () => {
    jest.mocked(useGlobalsContext).mockReturnValue({
      labelByKey: (key: string) => key,
    } as any);

    const mockApiResult = [
      { id: '1', name: 'Test 1' },
      { id: '2', name: 'Test 2' },
    ];

    jest.requireMock('../../../core/hooks/useApi').useApi.mockReturnValue({
      loading: false,
      result: mockApiResult,
    });

    const { result } = renderHook(() =>
      useDataTableParams({
        columns: [
          {
            dataField: { value: 'name' },
            alignment: { value: { label: 'Left', selection: 'Left' } },
            dataFormat: { value: { label: 'Text', selection: 'Text' } },
            header: { value: 'Name' },
            widthPercentage: { value: 10 },
            enableSortability: { value: false },
          },
        ],
        tableKey: 'test-table',
      }),
    );

    expect(result.current.selectedRowIndex).toBe(null);
    expect(result.current.selectedRowData).toBe(null);

    act(() => {
      result.current.setSelectedRowIndex(0);
    });

    expect(result.current.selectedRowIndex).toBe(0);
    expect(result.current.selectedRowData).toEqual({ id: '1', name: 'Test 1' });

    act(() => {
      result.current.setSelectedRowIndex(1);
    });

    expect(result.current.selectedRowIndex).toBe(1);
    expect(result.current.selectedRowData).toEqual({ id: '2', name: 'Test 2' });

    act(() => {
      result.current.setSelectedRowIndex(null);
    });

    expect(result.current.selectedRowIndex).toBe(null);
    expect(result.current.selectedRowData).toBe(null);
  });

  it('should sort data correctly', () => {
    const mockSort = jest.fn();
    jest.requireMock('../../../components/blocks/dataTable/dataTableV2/reducer').usePaginatedSort.mockReturnValue({
      sortBy: 'Name',
      ascending: true,
      pageNumber: 1,
      pageSize: 5,
      sort: mockSort,
      setPage: jest.fn(),
      setPageSize: jest.fn(),
    });

    const mockApiResult = [
      { id: '1', name: 'Test 1', date: '2023-01-01' },
      { id: '2', name: 'Test 2', date: '2023-01-02' },
      { id: '3', name: 'Test 3', date: '2023-01-03' },
    ];

    jest.requireMock('../../../core/hooks/useApi').useApi.mockReturnValue({
      loading: false,
      result: mockApiResult,
    });

    const { result } = renderHook(() =>
      useDataTableParams({
        columns: [
          {
            dataField: { value: 'name' },
            alignment: { value: { label: 'Left', selection: 'Left' } },
            dataFormat: { value: { label: 'Text', selection: 'Text' } },
            header: { value: 'Name' },
            widthPercentage: { value: 10 },
            enableSortability: { value: true },
          },
        ],
        tableKey: 'test-table',
      }),
    );

    result.current.columns[0].sort?.onClick();
    expect(mockSort).toHaveBeenCalledWith('Name');
  });

  it('should handle cached data from session storage', () => {
    const savedRow: DataTableRow = { id: '2', name: 'Test 2' };
    jest
      .requireMock('../../../core/hooks/useSessionStorage')
      .useSessionStorage.mockReturnValueOnce([{ 'test-table': savedRow }, jest.fn()]);

    const mockApiResult = [
      { id: '1', name: 'Test 1' }, // Page 1
      { id: '2', name: 'Test 2' }, // Page 2 (when pageSize is 1)
      { id: '3', name: 'Test 3' }, // Page 3
    ];

    const mockSetPage = jest.fn();
    jest.requireMock('../../../components/blocks/dataTable/dataTableV2/reducer').usePaginatedSort.mockReturnValueOnce({
      sortBy: 'Name',
      ascending: true,
      pageNumber: 1, // Start on page 1
      pageSize: 1, // With this size, our target row is on page 2
      sort: jest.fn(),
      setPage: mockSetPage,
      setPageSize: jest.fn(),
    });

    jest.requireMock('../../../core/hooks/useApi').useApi.mockReturnValueOnce({
      loading: false,
      result: mockApiResult,
    });

    act(() => {
      renderHook(() =>
        useDataTableParams({
          columns: [
            {
              dataField: { value: 'name' },
              alignment: { value: { label: 'Left', selection: 'Left' } },
              dataFormat: { value: { label: 'Text', selection: 'Text' } },
              header: { value: 'Name' },
              widthPercentage: { value: 10 },
              enableSortability: { value: true },
            },
          ],
          tableKey: 'test-table',
        }),
      );
    });

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it('should handle empty or null values', () => {
    const columnItemParams: DataTableColumn = {
      dataField: { value: 'a' },
      alignment: { value: { label: 'Left', selection: 'Left' } },
      dataFormat: { value: { label: 'Text', selection: 'Text' } },
      header: { value: 'A' },
      widthPercentage: { value: 10 },
      enableSortability: { value: false },
    };

    const { result } = renderHook(() =>
      useDataTableParams({
        columns: [{ ...columnItemParams, dataField: { value: 'a' } }],
        tableKey: 'test-table',
      }),
    );

    expect(result.current.columns[0].parseValue({ a: '' as any })).toBe(NA_SYMBOL);
    expect(result.current.columns[0].parseValue({})).toBe(NA_SYMBOL);

    const rowWithNullValue: DataTableRow = {};
    rowWithNullValue.a = null as any;
    expect(result.current.columns[0].parseValue(rowWithNullValue)).toBe(NA_SYMBOL);

    const rowWithUndefinedValue: DataTableRow = {};
    expect(result.current.columns[0].parseValue(rowWithUndefinedValue)).toBe(NA_SYMBOL);
  });
});

describe('Session storage hooks', () => {
  it('should provide useCachedDataTableRow hook', () => {
    const { result } = renderHook(() => useCachedDataTableRow());
    expect(result.current).toEqual([{}, expect.any(Function)]);
  });

  it('should provide useCachedSelectedRow hook', () => {
    const { result } = renderHook(() => useCachedSelectedRow());
    expect(result.current).toEqual([{}, expect.any(Function)]);
  });

  it('should use cached data when specified', () => {
    const mockSetCache = jest.fn();
    const cachedDataTableRow: Record<string, DataTableRow> = { cachedData: { id: '1' } as any };
    const cachedSelectedRow: DataTableRow = { id: '2', name: 'Test' };

    jest
      .requireMock('../../../core/hooks/useSessionStorage')
      .useSessionStorage.mockReturnValueOnce([cachedDataTableRow, mockSetCache])
      .mockReturnValueOnce([cachedSelectedRow, jest.fn()]);

    const { result: cachedDataTableResult } = renderHook(() => useCachedDataTableRow());
    const { result: cachedSelectedRowResult } = renderHook(() => useCachedSelectedRow());

    expect(cachedDataTableResult.current[0]).toEqual(cachedDataTableRow);
    expect(cachedSelectedRowResult.current[0]).toEqual(cachedSelectedRow);

    const newData: Record<string, DataTableRow> = { newData: { id: '3' } as any };
    act(() => {
      cachedDataTableResult.current[1](newData);
    });

    expect(mockSetCache).toHaveBeenCalledWith(newData);
  });
});

describe('DEFAULT_PAGE_SIZE', () => {
  it('should have correct default page size', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(10);
  });
});
