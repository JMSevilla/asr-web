import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { TransferFlexibleBenefits } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { useRouter } from '../../../core/router';
import { FlexibleBenefitsForm } from './FlexibleBenefitsForm';
import { FlexibleBenefitsFormType } from './validation';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';

interface Props {
  id: string;
  pageKey: string;
  isStandAlone?: boolean;
  journeyType: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}

export const FlexibleBenefitsFormBlock: React.FC<Props> = ({ id, pageKey, journeyType, isStandAlone, parameters }) => {
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const savedValues = useApi(api => api.mdp.transferFlexibleBenefits());
  const saveValuesCb = useApiCallback((api, params: TransferFlexibleBenefits) =>
    api.mdp.transferFlexibleBenefitsSave(params),
  );
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const prefix = `${id}`;
  const defaultValues = useMemo(
    () => (savedValues.result?.data ? valuesToForm(savedValues.result?.data) : undefined),
    [savedValues.result?.data],
  );

  return (
    <Grid container spacing={12} id={id}>
      <Grid item xs={12} lg={isStandAlone ? 12 : 6}>
        <FlexibleBenefitsForm prefix={prefix} onSubmit={handleSubmit} defaultValues={defaultValues} />
      </Grid>
    </Grid>
  );

  async function handleSubmit(values: FlexibleBenefitsFormType) {
    await saveValuesCb.execute(formToValues(values));
    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    await journeyNavigation.goNext();
  }
};

const formToValues = (form: FlexibleBenefitsFormType): TransferFlexibleBenefits => {
  return { ...form, dateOfPayment: form.dateOfPayment?.toISOString() };
};

const valuesToForm = (values: TransferFlexibleBenefits): Partial<FlexibleBenefitsFormType> => {
  return { ...values, dateOfPayment: values.dateOfPayment ? new Date(values.dateOfPayment) : null };
};
