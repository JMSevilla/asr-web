import { useMemo } from 'react';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { useApi, useApiCallback } from './useApi';

/**
 * Fetches and saves generic step data for a given journey type, page key and form key.
 * @param journeyType The journey type to fetch and save data for.
 * @param pageKey The page key to fetch and save data for.
 * @param formKey The form key to fetch and save data for.
 * @param disabled If true, the data will not be fetched. Save will still work.
 * @returns The data and save function.
 * @example
 * const { data, save } = useGenericStepData('transfer2', 'pageKey', 'formKey');
 * save({ name: 'John' });
 * // Then the next time you load the page, data will be { name: 'John' }
 */
export const useGenericStepData = <T>(
  journeyType: JourneyTypeSelection,
  pageKey: string,
  formKey: string,
  disabled = false,
) => {
  const shouldNotLoadValues = disabled || !journeyType;
  const stepData = useApi(
    api =>
      shouldNotLoadValues ? Promise.reject() : api.mdp.genericJourneyStepData<string>(journeyType, pageKey, formKey),
    [shouldNotLoadValues, journeyType, pageKey, formKey],
  );
  const saveStepDataCb = useApiCallback((api, data: T) =>
    api.mdp.genericJourneySubmitStepData<T>(journeyType, pageKey, formKey, data),
  );
  const data = useMemo(() => {
    try {
      return stepData.result?.data.genericDataJson
        ? (JSON.parse(stepData.result.data.genericDataJson) as T)
        : undefined;
    } catch (e) {
      process.env.NODE_ENV !== 'test' && console.error(e);
      return undefined;
    }
  }, [stepData.result?.data.genericDataJson]);

  return { data, save: saveStepDataCb, loading: stepData.loading || saveStepDataCb.loading };
};
