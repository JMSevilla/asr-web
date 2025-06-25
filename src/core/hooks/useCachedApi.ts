import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { UseAsyncReturn } from 'react-async-hook';
import { Api } from '../../api/api';
import { useApi, useApiCallback } from './useApi';
import { useSessionStorage } from './useSessionStorage';

type CachedKey =
  | 'retirement-calculation'
  | 'transfer-options'
  | 'quotes-options'
  | 'retirement-quotes-V3'
  | 'retirement-quotes-V3-uncached'
  | 'beneficiary-relationship-statuses'
  | 'time-to-retirement'
  | 'line-ages'
  | 'countries-currencies';

export const useCachedApi = <R, D extends unknown[]>(
  asyncFn: (api: Api) => Promise<R | AxiosResponse<R>>,
  key: CachedKey,
  deps?: D,
): UseAsyncReturn<R> & { reset(val?: R): void } => {
  const [value, setValue, clearValue] = useSessionStorage<R | undefined>(key, undefined);
  const response = useApi(async api => {
    if (value) {
      return { data: value };
    }

    const result = await asyncFn(api);
    if (result === undefined) {
      return { data: value };
    }

    setValue((result as AxiosResponse<R>).data ?? (result as R));
    return result;
  }, deps || []);

  return {
    ...response,
    result: (response.result as AxiosResponse<R>)?.data ?? response.result,
    reset: (val?: AxiosResponse<R>) => {
      val ? setValue(val.data) : clearValue();
      response.set({ result: val, status: val ? 'success' : 'not-requested', loading: false, error: undefined });
    },
  } as UseAsyncReturn<R>;
};

export const useCachedApiCallback = <R, A extends unknown>(
  asyncFn: (api: Api, args: A) => Promise<R | AxiosResponse<R>>,
  key: CachedKey,
): UseAsyncReturn<R> & { reset(val?: R): void } => {
  const [value, setValue, clearValue] = useSessionStorage<R | undefined>(key, undefined);
  const [renderValue, setRenderValue] = useState(value);
  const response = useApiCallback(async (api, args: A) => {
    const result = await asyncFn(api, args);
    const resultValue = (result as AxiosResponse<R>)?.data ?? (result as R);
    setValue(resultValue);
    setRenderValue(resultValue);
    return result;
  });

  return {
    ...response,
    result: renderValue,
    reset: (val?: AxiosResponse<R>) => {
      val ? setValue(val.data) : clearValue();
      setRenderValue(val?.data);
      response.set({ result: val, status: val ? 'success' : 'not-requested', loading: false, error: undefined });
    },
  } as UseAsyncReturn<R>;
};
