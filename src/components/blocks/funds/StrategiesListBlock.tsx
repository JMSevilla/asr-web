import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { MessageType } from '../..';
import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { RetirementDCFund } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { RadioButtonsField } from '../../form';
import { OneColumnBlockLoader } from '../../loaders';

interface Props {
  id: string;
  pageKey: string;
  journeyType: JourneyTypeSelection;
  panelList?: PanelListItem[];
  parameters: { key: string; value: string }[];
}

export const StrategiesListBlock: React.FC<Props> = ({ id, pageKey, journeyType, parameters, panelList }) => {
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { rawMessageByKey } = useGlobalsContext();
  const { panelByKey } = usePanelBlock(panelList);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const cachedAccessKey = useCachedAccessKey();
  const strategies = useApi(async api => {
    const [schemeCode, category] = cachedAccessKey.data?.schemeCodeAndCategory?.split('-') || [];
    if (!schemeCode || !category) {
      return [];
    }
    const result = await api.mdp.retirementDcSpendingStrategies(schemeCode, category);
    return result.data.contributionTypes.flatMap(ct => ct.strategies).filter(Boolean) as RetirementDCFund[];
  });
  const stepData = useJourneyStepData<RetirementDCFund>({
    journeyType,
    formKey: id,
    pageKey,
    personType: 'strategy',
  });
  const form = useForm<{ strategy: string | null }>({ defaultValues: { strategy: null }, mode: 'onChange' });
  const formState = useFormState({ control: form.control });
  const selectedStrategy = form.watch('strategy');

  useFormSubmissionBindingHooks({
    cb: handleSubmit,
    key: 'funds-strategies-list',
    isValid: formState.isValid && !!selectedStrategy && !strategies.error,
    initDependencies: [strategies.result, selectedStrategy],
  });

  useEffect(() => {
    if (stepData.values?.code) {
      form.reset({ strategy: stepData.values.code });
    }
  }, [stepData.values?.code]);

  useEffect(() => {
    if (!strategies.error) return;
    const errorMessage = rawMessageByKey(`${id}_error`);
    if (errorMessage) {
      showNotifications([
        { type: errorMessage.type as MessageType, message: errorMessage.html, buttons: errorMessage.buttons },
      ]);
    }
    return () => hideNotifications();
  }, [strategies.error]);

  if (strategies.loading) {
    return <OneColumnBlockLoader id={id} data-testid="strategies-list-loader" />;
  }

  if (strategies.error) {
    return (
      <Stack id={id} data-testid="strategies-list-error">
        {panelByKey(`${id}_error`)}
      </Stack>
    );
  }

  return (
    <Stack id={id} data-testid="strategies-list" gap={2} component="form">
      <RadioButtonsField
        name="strategy"
        control={form.control}
        buttons={strategies.result?.map(strategy => ({ value: strategy.code, label: strategy.name })) ?? []}
        disabled={strategies.loading || stepData.loading || journeyNavigation.loading || submitStepCb.loading}
      />
    </Stack>
  );

  async function handleSubmit() {
    const formValue = form.getValues('strategy');
    const selectedStrategy = strategies.result?.find(s => s?.code === formValue);
    if (formValue && !selectedStrategy) {
      console.error(`Strategy with code ${formValue} not found`);
      return;
    }
    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    await stepData.save(selectedStrategy!);
    await journeyNavigation.goNext();
  }
};
