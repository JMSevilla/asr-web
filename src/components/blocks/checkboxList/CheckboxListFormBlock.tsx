import { Grid } from '@mui/material';
import { useState } from 'react';
import { ParsedHtml } from '../..';
import { Checkbox, JourneyTypeSelection } from '../../../api/content/types/page';
import { AddCheckboxListParams } from '../../../api/mdp/types';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { CheckboxComponent } from '../../form';

interface Props {
  checkboxes: Checkbox[];
  checkboxesListKey: string;
  description?: string;
  journeyType: JourneyTypeSelection;
  pageKey: string;
}

export const CheckboxListFormBlock: React.FC<Props> = ({
  checkboxes: contentValues,
  checkboxesListKey,
  description,
  journeyType,
  pageKey,
}) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const preserved = usePersistentAppState();
  const addCheckboxListCb = useApiCallback((api, params: AddCheckboxListParams) => api.mdp.addCheckboxList(params));
  useApi(
    async api => {
      if (!isAuthenticated || !journeyType) {
        return Promise.reject();
      }
      const result = await api.mdp.checkboxList({ pageKey, checkboxesListKey, journeyType });
      const savedValues = result?.data.checkboxes;
      if (savedValues?.some(v => v.answerValue)) {
        setCheckboxesState(state =>
          state.map(({ key, required }) => ({
            key,
            required,
            checked: !!savedValues.find(v => v.key === key)?.answerValue,
          })),
        );
        return;
      }
    },
    [checkboxesListKey, journeyType],
  );
  const [checkboxesState, setCheckboxesState] = useState<{ key: string; required: boolean; checked: boolean }[]>(
    contentValues.map(({ checkboxKey, isMandatory, defaultState }) => ({
      key: checkboxKey.value,
      required: isMandatory.value,
      checked: !isAuthenticated
        ? !!preserved.checkbox.state?.[checkboxesListKey]?.[checkboxKey.value] ?? !!defaultState?.value
        : !!defaultState?.value,
    })),
  );

  const allRequiredOnesChecked = checkboxesState.every(({ required, checked }) => (required && checked) || !required);

  useFormSubmissionBindingHooks({
    key: checkboxesListKey,
    isValid: allRequiredOnesChecked,
    isDirty,
    cb: () => onSubmit(),
    initDependencies: [checkboxesState],
  });

  if (!checkboxesState?.length) {
    return null;
  }

  return (
    <Grid container spacing={6} id={checkboxesListKey}>
      {description && (
        <Grid item xs={12}>
          <ParsedHtml html={description} />
        </Grid>
      )}
      <Grid item xs={12} container spacing={6}>
        {contentValues.map(checkbox => (
          <Grid item xs={12} key={checkbox.checkboxKey.value}>
            <CheckboxComponent
              {...({} as any)}
              disabled={isSubmitting}
              label={<ParsedHtml html={checkbox.checkboxText.value} />}
              onChange={handleChange(checkbox.checkboxKey.value)}
              value={checkboxesState.find(({ key }) => key === checkbox.checkboxKey.value)?.checked}
              topPosition
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );

  function handleChange(key: string) {
    return (checked: boolean) => {
      const newState = checkboxesState.map(s => (s.key === key ? { ...s, checked } : s));
      setCheckboxesState(newState);
      setIsDirty(true);
      !isAuthenticated &&
        preserved.checkbox.saveForm({
          key: checkboxesListKey,
          form: newState.reduce((acc, { key, checked }) => ({ ...acc, [key]: checked }), {}),
        });
    };
  }

  async function onSubmit() {
    try {
      setIsSubmitting(true);
      const parsedState = checkboxesState.map(checkbox => ({ key: checkbox.key, answerValue: checkbox.checked }));
      await addCheckboxListCb.execute({ pageKey, journeyType, checkboxesListKey, checkboxes: parsedState });
    } catch {
      setIsSubmitting(false);
    }
  }
};
