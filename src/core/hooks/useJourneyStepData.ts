import { useEffect, useState } from 'react';
import { JourneyTypeSelection, JourneyTypes } from '../../api/content/types/page';
import { usePersistentAppState } from '../contexts/persistentAppState/PersistentAppStateContext';
import { BereavementPersonFormValues } from '../contexts/persistentAppState/hooks/bereavement/form';
import { useGenericStepData } from './useGenericStepData';

type JourneyStepDataArgs<T, V> = {
  journeyType: JourneyTypeSelection;
  pageKey: string;
  formKey: string;
  personType: string;
  preventFetch?: boolean;
  parseValuesToForm?: (values: T) => T;
  parseFormToValues?: (values: T) => T;
};

/**
 * Provides a hook to get and save data for a journey step.
 * @param journeyType The journey type to get data for.
 * @param pageKey The page key to get data for.
 * @param formKey The form key to get data for.
 * @param personType The person type to get data for.
 * @param parseValuesToForm A function to parse the values to the form (optional).
 * @param parseFormToValues A function to parse the form to the values (optional).
 * @param preventFetch Prevents the hook from automatically fetching data.
 * @returns The values and save function.
 * @example
 * const { values, save } = useJourneyStepData({ journeyType: 'transfer2', pageKey: 'pageKey', formKey: 'formKey', personType: 'personType' });
 * save(values); // should be awaited
 */
export const useJourneyStepData = <T, V = any>({
  journeyType,
  pageKey,
  formKey,
  personType,
  preventFetch = false,
  parseValuesToForm,
  parseFormToValues,
}: JourneyStepDataArgs<T, V>) => {
  const { bereavement } = usePersistentAppState();
  const stepData = useGenericStepData<T>(
    journeyType,
    pageKey,
    [formKey, personType].join('_'),
    journeyType === JourneyTypes.BEREAVEMENT || preventFetch,
  );
  const [defaultValues, setDefaultValues] = useState<T>();
  const [isLoading, setIsLoading] = useState<boolean>(stepData.loading);

  useEffect(() => {
    if (journeyType === JourneyTypes.BEREAVEMENT) {
      const values = bereavement.form.values[personType];
      values && setDefaultValues(parseValuesToForm ? parseValuesToForm(values as T) : (values as T));
      return;
    }
    if (stepData.data) {
      setDefaultValues(parseValuesToForm ? parseValuesToForm(stepData.data) : stepData.data);
      return;
    }
  }, [journeyType, stepData.data]);

  useEffect(() => {
    setIsLoading(stepData.loading);
  }, [stepData.loading]);

  async function handleSaveValues(values: T) {
    setDefaultValues(parseFormToValues ? parseFormToValues(values) : values);
    if (journeyType === JourneyTypes.BEREAVEMENT) {
      bereavement.form.saveForm({
        personType,
        values: (parseFormToValues ? parseFormToValues(values) : values) as BereavementPersonFormValues,
      });
      return;
    }
    await stepData.save.execute(parseFormToValues ? parseFormToValues(values) : values);
  }

  return { values: defaultValues, save: handleSaveValues, loading: isLoading };
};
