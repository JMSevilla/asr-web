import { useCallback } from 'react';
import { NA_SYMBOL } from '../../business/constants';
import { currencyValue } from '../../business/currency';
import { ZERO_FULL_ISO_TIME, formatDate, isoTimeToText } from '../../business/dates';
import { useGlobalsContext } from '../contexts/GlobalsContext';
import { useTenantContext } from '../contexts/TenantContext';
import { useCachedCmsTokens } from '../contexts/contentData/useCachedCmsTokens';
import { useApi } from './useApi';

/**
 * Replaces data placeholders in text with actual data from the data source
 * @param source The source url to get the data from or the data itself
 * @returns The replaceDataInText function, loading and error state
 * @example
 * const { replaceDataInText, loading, error } = useDataReplacerApi('https://example.com/data.json');
 * const text = replaceDataInText('[[data-text:field.path]]');
 * // text = 'Some text'
 */

export const useDataReplacerApi = (source?: string | Record<string, object>) => {
  const { tenant } = useTenantContext();
  const { labelByKey, rawLabelByKey } = useGlobalsContext();
  const cmsTokens = useCachedCmsTokens();
  const summary = useApi(
    async api => {
      if (!source) {
        return Promise.resolve({ data: null });
      }
      if (typeof source === 'string' && source.includes('/mdp-api/api/retirement/cms-token-information')) {
        const result = await cmsTokens.fetch();
        return { data: result };
      }
      if (typeof source === 'string') {
        return await api.mdp.dataSummary(source, { tenantUrl: tenant.tenantUrl.value });
      }
      return { data: source };
    },
    [source],
  );

  const replaceDataInText = useCallback(
    (text?: string) => {
      if (!text) {
        return text;
      }

      return text.replace(DATA_TOKENS_REGEX, (_, type: string, fieldPath: string) => {
        if (!summary.result?.data) {
          return NA_SYMBOL;
        }

        const value = findValueByKey(fieldPath, summary.result.data as Record<string, object>) as string;

        switch (type.toLowerCase()) {
          case 'currency':
            return `${labelByKey('currency:GBP')}${currencyValue(value)}`;
          case 'date':
            return formatDate(value);
          case 'timeto':
            return isoTimeToText(labelByKey, value, 2) || '';
          case 'text':
          default:
            return value;
        }
      });
    },
    [summary.result?.data],
  );

  return {
    replaceDataInText,
    getRawValue: (path: string) => findValueByKey(path, summary.result?.data as Record<string, object>),
    data: summary.result?.data,
    loading: summary.status === 'not-requested' || summary.loading,
    error: summary.error,
    elementProps: (key?: string, path?: string) => {
      const labelWithKey = key && rawLabelByKey(`${key}_no_value_aria`);
      const value = path ? findValueByKey(path, summary.result?.data as Record<string, object>) : summary.result?.data;
      const currentnessValue = typeof value === 'string' && value?.replace(labelByKey('currency:GBP'), '');
      if (currentnessValue === NA_SYMBOL) return {};

      return { 'aria-tag': labelWithKey ? rawLabelByKey(`${key}_no_value_aria`) : labelByKey('no_value_aria') };
    },
  };
};

export const DATA_TOKENS_REGEX = /\[\[data-?(currency|date|text|timeto|):([a-zA-Z0-9_.-]+)\]\]/g;

function findValueByKey(
  valuePath: string,
  object: Record<string, object | string>,
): string | object | Record<string, object> {
  const pathSegments = valuePath.split('.');
  const value = object?.[pathSegments[0]];
  if (value === undefined || value === null || value === NA_SYMBOL) {
    !process.env.JEST_WORKER_ID && console.error(`Value not found for key: ${valuePath}`);
    return NA_SYMBOL;
  }
  if (value === ZERO_FULL_ISO_TIME) {
    return NA_SYMBOL;
  }
  if (pathSegments.length === 1) {
    return object[pathSegments[0]];
  }
  return findValueByKey(pathSegments.slice(1).join('.'), object[pathSegments[0]] as Record<string, object>);
}
