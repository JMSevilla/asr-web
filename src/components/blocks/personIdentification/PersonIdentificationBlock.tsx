import { Grid } from '@mui/material';
import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { SubmitStepParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { BereavementPersonFormValues } from '../../../core/contexts/persistentAppState/hooks/bereavement/form';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { useRouter } from '../../../core/router';
import { PersonIdentificationForm } from './PersonIdentificationForm';
import { PersonIdentificationFormType } from './validation';

interface Props {
  id: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  isStandAlone?: boolean;
  panelList?: PanelListItem[];
  journeyType?: JourneyTypeSelection;
}

export const PersonIdentificationBlock: React.FC<Props> = ({
  id,
  pageKey,
  parameters,
  isStandAlone,
  panelList,
  journeyType,
}) => {
  const router = useRouter();
  const { bereavement } = usePersistentAppState();
  const { panelByKey } = usePanelBlock(panelList);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const personType = findValueByKey('person_type', parameters) ?? 'deceased';
  const submitStepCb = useApiCallback((api, args: SubmitStepParams) => api.mdp.bereavementJourneySubmitStep(args));
  const prefix = `${id}_${personType}`;
  const panel1 = panelByKey(`${prefix}_panel1`),
    panel2 = panelByKey(`${prefix}_panel2`);

  return (
    <Grid container id={id} spacing={12}>
      {panel1 && (
        <Grid item xs={12}>
          {panel1}
        </Grid>
      )}
      <Grid item xs={12}>
        <PersonIdentificationForm
          prefix={prefix}
          isStandAlone={isStandAlone}
          submitLoading={router.loading || router.parsing}
          initialData={bereavement.form.values[personType] as PersonIdentificationFormType}
          onSubmit={handleSubmit}
          panel={panel2}
        />
      </Grid>
    </Grid>
  );

  async function handleSubmit(values: PersonIdentificationFormType) {
    bereavement.form.saveForm({ personType, values: formToValues(values) });
    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    await journeyNavigation.goNext();
  }
};

const formToValues = (values: PersonIdentificationFormType): BereavementPersonFormValues => {
  const type = values.identification?.type;
  return {
    ...values,
    identification: {
      ...values.identification,
      nationalInsuranceNumber:
        type === 'INSURANCE_NUMBER' ? values.identification?.nationalInsuranceNumber ?? undefined : undefined,
      personalPublicServiceNumber:
        type === 'SERVICE_NUMBER' ? values.identification?.personalPublicServiceNumber || undefined : undefined,
      pensionReferenceNumbers: values.identification?.pensionReferenceNumbers?.filter(Boolean),
    },
  };
};
