import { useApi, useApiCallback } from '../../core/hooks/useApi';
import { useGenericStepData } from '../../core/hooks/useGenericStepData';
import { renderHook } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: {} } }),
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn() }),
}));

describe('useGenericStepData', () => {
  it('should return undefined if genericDataJson is not valid JSON string', () => {
    jest.mocked(useApi).mockReturnValue({ result: { data: { genericDataJson: 'invalid' } } } as any);
    const { result } = renderHook(() => useGenericStepData('transfer2', 'pageKey', 'formKey'));
    expect(result.current.data).toBeUndefined();
  });

  it('should return and parse useApi values', () => {
    jest.mocked(useApi).mockReturnValue({ result: { data: { genericDataJson: '{ "value": 1 }' } } } as any);
    const { result } = renderHook(() => useGenericStepData('transfer2', 'pageKey', 'formKey'));
    expect(result.current.data).toStrictEqual({ value: 1 });
  });

  it('should call saveStepDataCb.execute on save.execute call', () => {
    const execute = jest.fn();
    jest.mocked(useApiCallback).mockReturnValue({ execute } as any);
    const { result } = renderHook(() => useGenericStepData('transfer2', 'pageKey', 'formKey'));
    result.current.save.execute({ value: 1 });
    expect(result.current.save.execute).toBeCalledWith({ value: 1 });
  });
});
