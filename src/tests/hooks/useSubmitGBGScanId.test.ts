import { useSubmitGBGScanId } from '../../components/blocks/gbgScan/useSubmitGBGScanId';
import { renderHook } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

describe('useSubmitGBGScanId', () => {
  it('should return submit GBG fn when journeyType is retirement', async () => {
    const { result } = renderHook(() => useSubmitGBGScanId('retirement'));

    expect(result.current.execute).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });
  it('should return submit GBG fn when journeyType is transfer2', async () => {
    const { result } = renderHook(() => useSubmitGBGScanId('transfer2'));

    expect(result.current.execute).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });
});
