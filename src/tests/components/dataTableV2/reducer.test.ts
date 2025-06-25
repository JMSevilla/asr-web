import { DataTableColumn } from '../../../api/content/types/page';
import { usePaginatedSort } from '../../../components/blocks/dataTable/dataTableV2/reducer';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

describe('usePaginatedSort', () => {
  const mockColumns = [
    { dataField: { value: 'a' }, header: { value: 'Column A' } } as DataTableColumn,
    { dataField: { value: 'b' }, header: { value: 'Column B' } } as DataTableColumn,
    { dataField: { value: 'c' }, header: { value: 'Column C' } } as DataTableColumn,
  ];

  it('should return correct initial state with default values', () => {
    const { result } = renderHook(() => usePaginatedSort(mockColumns, 10));

    expect(result.current.sortBy).toBe('Column A');
    expect(result.current.ascending).toBe(true);
    expect(result.current.pageNumber).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('should return correct initial state with custom defaultOrderingColumn', () => {
    const { result } = renderHook(() =>
      usePaginatedSort(mockColumns, 20, 'b')
    );

    expect(result.current.sortBy).toBe('Column B');
    expect(result.current.ascending).toBe(true);
    expect(result.current.pageNumber).toBe(1);
    expect(result.current.pageSize).toBe(20);
  });

  it('should return correct initial state with defaultOrderingOrder set to DESC', () => {
    const { result } = renderHook(() =>
      usePaginatedSort(mockColumns, 5, 'c', 'DESC')
    );

    expect(result.current.sortBy).toBe('Column C');
    expect(result.current.ascending).toBe(false);
    expect(result.current.pageNumber).toBe(1);
    expect(result.current.pageSize).toBe(5);
  });

  it('should handle empty columns array', () => {
    const { result } = renderHook(() => usePaginatedSort([], 10));

    expect(result.current.sortBy).toBe('');
    expect(result.current.ascending).toBe(true);
    expect(result.current.pageNumber).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('should update page number', () => {
    const { result } = renderHook(() => usePaginatedSort(mockColumns, 10));

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.pageNumber).toBe(3);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.sortBy).toBe('Column A');
    expect(result.current.ascending).toBe(true);
  });

  it('should update page size and reset page number to 1', () => {
    const { result } = renderHook(() => usePaginatedSort(mockColumns, 10));

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.pageNumber).toBe(3);

    act(() => {
      result.current.setPageSize(25);
    });

    expect(result.current.pageSize).toBe(25);
    expect(result.current.pageNumber).toBe(1);
  });

  it('should sort by a column', () => {
    const { result } = renderHook(() => usePaginatedSort(mockColumns, 10));

    act(() => {
      result.current.sort('Column B');
    });

    expect(result.current.sortBy).toBe('Column B');
    expect(result.current.ascending).toBe(true);
    expect(result.current.pageNumber).toBe(1);
  });

  it('should toggle sort order when sorting by the same column', () => {
    const { result } = renderHook(() => usePaginatedSort(mockColumns, 10));

    act(() => {
      result.current.sort('Column B');
    });
    expect(result.current.sortBy).toBe('Column B');
    expect(result.current.ascending).toBe(true);

    act(() => {
      result.current.sort('Column B');
    });

    expect(result.current.sortBy).toBe('Column B');
    expect(result.current.ascending).toBe(false);
    expect(result.current.pageNumber).toBe(1);
  });

  it('should reset page number to 1 when sorting', () => {
    const { result } = renderHook(() => usePaginatedSort(mockColumns, 10));

    act(() => {
      result.current.setPage(4);
    });
    expect(result.current.pageNumber).toBe(4);

    act(() => {
      result.current.sort('Column C');
    });

    expect(result.current.sortBy).toBe('Column C');
    expect(result.current.pageNumber).toBe(1);
  });
});
