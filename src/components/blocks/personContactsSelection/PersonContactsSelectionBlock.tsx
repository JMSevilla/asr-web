import { Box, RadioGroup } from '@mui/material';
import React, { useState } from 'react';
import { QuestionRadioButton } from '../..';
import { ListLoader, PrimaryButton } from '../../';
import { SubmitStepParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import {
  BereavementPersonFormValues,
  PersonContactsSelection,
} from '../../../core/contexts/persistentAppState/hooks/bereavement/form';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';
import { useBereavementContactInitialData } from './hooks';

interface Props {
  id: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
}

export const PersonContactsSelectionBlock: React.FC<Props> = ({ id, pageKey, parameters }) => {
  const router = useRouter();
  const {
    bereavement: { form },
  } = usePersistentAppState();
  const { labelByKey } = useGlobalsContext();
  const [selectedValue, setSelectedValue] = useState<PersonContactsSelection | undefined>(
    form.values?.contactSelection,
  );
  const firstPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const secondPageKey = findValueByKey('contact_page', parameters) ?? '';
  const submitStepCb = useApiCallback((api, args: SubmitStepParams) => api.mdp.bereavementJourneySubmitStep(args));
  const initialApiData = useBereavementContactInitialData(parameters);

  if (initialApiData.loading) return <ListLoader />;

  const options = createOptions(form.values.reporter!, form.values?.nextOfKin, form.values?.executor);

  return (
    <Box id={id} data-testid={id}>
      <RadioGroup onChange={handleValueChange} value={selectedValue} data-testvalue={selectedValue}>
        {options?.map((option, idx) => (
          <QuestionRadioButton id={`option-${idx + 1}`} key={option.value} value={option.value} label={option.label} />
        ))}
      </RadioGroup>
      <Box mt={8}>
        <PrimaryButton
          data-testid="bereavement_contact_selection_continue"
          onClick={handleClick}
          disabled={!options?.length || !options.find(option => option.value === selectedValue)}
          loading={router.loading}
        >
          {labelByKey('bereavement_contact_selection_continue')}
        </PrimaryButton>
      </Box>
    </Box>
  );

  function handleValueChange(_: React.ChangeEvent<HTMLInputElement>, value: string) {
    setSelectedValue(value as PersonContactsSelection);
  }

  async function handleClick() {
    const isOtherSelected = selectedValue === 'OTHER';
    const nextPageKey = isOtherSelected ? secondPageKey : firstPageKey;
    !isOtherSelected && clearData();
    form.saveContactSelection({ contactSelection: selectedValue });
    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    await router.parseUrlAndPush(nextPageKey);
  }

  function clearData() {
    form.resetPersonType({ personType: 'contactPerson' });
  }

  function createOptions(
    reporter: BereavementPersonFormValues,
    nextOfKin?: BereavementPersonFormValues,
    executor?: BereavementPersonFormValues,
  ) {
    return [
      {
        value: 'YOU',
        label: `${[
          reporter?.name,
          reporter?.surname,
          `(${[
            labelByKey('bereavement_contact_selection_you'),
            initialApiData.isNextOfKin && labelByKey('bereavement_contact_selection_next_of_kin'),
            initialApiData.isExecutor && labelByKey('bereavement_contact_selection_executor'),
          ]
            .filter(Boolean)
            .join(', ')})`,
        ]
          .filter(Boolean)
          .join(' ')}`,
      },
      (nextOfKin?.name || nextOfKin?.surname) && {
        value: 'NEXT_OF_KIN',
        label: `${[nextOfKin?.name, nextOfKin?.surname, `(${labelByKey('bereavement_contact_selection_next_of_kin')})`]
          .filter(Boolean)
          .join(' ')}`,
      },
      (executor?.name || executor?.surname) && {
        value: 'EXECUTOR',
        label: `${[executor?.name, executor?.surname, `(${labelByKey('bereavement_contact_selection_executor')})`]
          .filter(Boolean)
          .join(' ')}`,
      },
      {
        value: 'OTHER',
        label: labelByKey('bereavement_contact_selection_other'),
      },
    ].filter(Boolean) as { value: PersonContactsSelection; label: string }[];
  }
};
