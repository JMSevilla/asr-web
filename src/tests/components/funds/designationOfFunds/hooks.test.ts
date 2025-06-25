import { useFundRows } from '../../../../components/blocks/funds/designationOfFunds/hooks';
import { useApi } from '../../../../core/hooks/useApi';
import { act, renderHook } from '../../../common';

jest.mock('../../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: [
      {
        fundCode: 'fundCode2',
        fundName: 'fundName2',
        fundGroup: 'fundGroup2',
      },
      {
        fundCode: 'fundCode',
        fundName: 'fundName',
        fundGroup: 'fundGroup',
      },
      {
        fundCode: 'fundCode3',
        fundName: 'fundName3',
        fundGroup: 'fundGroup3',
      },
    ],
  }),
}));

jest.mock('../../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({
    data: { contentAccessKey: 'contentAccessKey' },
  }),
}));

describe('useFundRows', () => {
  it('should return correct initial state', () => {
    const { result } = renderHook(() => useFundRows());
    expect(result.current.rows).toStrictEqual([
      {
        fundCode: 'fundCode',
        fundName: 'fundName',
        fundGroup: 'fundGroup',
      },
      {
        fundCode: 'fundCode2',
        fundName: 'fundName2',
        fundGroup: 'fundGroup2',
      },
      {
        fundCode: 'fundCode3',
        fundName: 'fundName3',
        fundGroup: 'fundGroup3',
      },
    ]);
    expect(result.current.selected).toStrictEqual([]);
    expect(result.current.error).toBe(undefined);
  });

  it('should return correct checked rows', () => {
    const { result, rerender } = renderHook(() => useFundRows());
    act(() => {
      result.current.update(['fundCode2', 'fundCode']);
      rerender();
    });
    expect(result.current.selected).toStrictEqual([
      {
        fundCode: 'fundCode',
        fundName: 'fundName',
        fundGroup: 'fundGroup',
      },
      {
        fundCode: 'fundCode2',
        fundName: 'fundName2',
        fundGroup: 'fundGroup2',
      },
    ]);
  });

  it('should return correct error', () => {
    (useApi as jest.Mock).mockReturnValue({
      loading: false,
      error: 'error',
    });
    const { result } = renderHook(() => useFundRows());
    expect(result.current.error).toBe('error');
  });
});
