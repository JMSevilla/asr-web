import { NA_SYMBOL } from '../../business/constants';
import { useApi } from '../../core/hooks/useApi';
import { useDataReplacerApi } from '../../core/hooks/useDataReplacerApi';
import { renderHook } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/hooks/useApi', () => ({ useApi: jest.fn() }));

jest.mock('../../core/contexts/TenantContext', () => ({
  useTenantContext: jest.fn().mockReturnValue({ tenant: { currency: 'GBP' } }),
}));

jest.mock('../../core/contexts/GlobalsContext', () => ({
  useGlobalsContext: jest.fn().mockReturnValue({ labelByKey: (key: string) => `[${key}]` }),
}));

jest.mock('../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({
    fetch: jest.fn().mockResolvedValue({ data: { 'data-currency': 'GBP' } }),
  }),
}));

describe('useDataReplacerApi', () => {
  it('should return correct data and value', async () => {
    (useApi as jest.Mock).mockReturnValue({ result: { data: { cost: 'GBP' } } });
    const { result } = renderHook(() => useDataReplacerApi('sourceUrl'));

    expect(result.current.data).toEqual({ cost: 'GBP' });
    expect(result.current.getRawValue('cost')).toBe('GBP');
  });

  it('should inject correct values for date, currency, text tokens when provided with url', async () => {
    const values = { cost: '1500', secondCost: '0', date: new Date('2000-01-01'), text: 'text', isoTime: '0Y11M0W5D' };
    (useApi as jest.Mock).mockReturnValue({ result: { data: values } });
    const { result } = renderHook(() => useDataReplacerApi('sourceUrl'));

    expect(result.current.replaceDataInText(`cost should be [[data-currency:cost]].`)).toBe(
      'cost should be [currency:GBP]1,500.00.',
    );
    expect(result.current.replaceDataInText(`second cost should be [[data-currency:secondCost]].`)).toBe(
      'second cost should be [currency:GBP]0.00.',
    );
    expect(result.current.replaceDataInText(`date is [[data-date:date]].`)).toBe('date is 01 Jan 2000.');
    expect(result.current.replaceDataInText('text is [[data-text:text]].')).toBe('text is text.');
    expect(result.current.replaceDataInText('time to is [[data-timeto:isoTime]].')).toBe(
      'time to is 11 [months], 5 [days].',
    );
  });

  it('should inject correct values for date, currency, text tokens when provided with data', async () => {
    const values = {
      cost: '1500',
      date: new Date('2000-01-01'),
      text: 'text',
      isoTime: '0Y11M0W5D',
    } as unknown as Record<string, object>;
    const { result } = renderHook(() => useDataReplacerApi(values));

    expect(result.current.replaceDataInText(`cost should be [[data-currency:cost]].`)).toBe(
      'cost should be [currency:GBP]1,500.00.',
    );
    expect(result.current.replaceDataInText(`date is [[data-date:date]].`)).toBe('date is 01 Jan 2000.');
    expect(result.current.replaceDataInText('text is [[data-text:text]].')).toBe('text is text.');
    expect(result.current.replaceDataInText('time to is [[data-timeto:isoTime]].')).toBe(
      'time to is 11 [months], 5 [days].',
    );
  });

  it('should return NA symbols in text when summary is not available', async () => {
    (useApi as jest.Mock).mockReturnValue({ result: { data: null } });
    const { result } = renderHook(() => useDataReplacerApi('sourceUrl'));

    const text1 = 'cost should be [[data-currency:cost]], date is [[data-date:date]], text is [[data-text:text]].';
    const text2 = `cost should be ${NA_SYMBOL}, date is ${NA_SYMBOL}, text is ${NA_SYMBOL}.`;
    expect(result.current.replaceDataInText(text1)).toBe(text2);
  });
});
