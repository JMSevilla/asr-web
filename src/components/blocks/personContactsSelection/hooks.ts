import { findValueByKey } from '../../../business/find-in-array';
import { isAnswerNo, isAnswerYes } from '../../../business/questions';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApi } from '../../../core/hooks/useApi';

export const useBereavementContactInitialData = (parameters: { key: string; value: string }[]) => {
  const {
    bereavement: { form },
  } = usePersistentAppState();

  const initialAppData = useApi(async api => {
    const [nextOfKin, executor] = await Promise.all([
      api.mdp.bereavementJourneyQuestionForm(findValueByKey('next_of_kin_status_page', parameters)!),
      api.mdp.bereavementJourneyQuestionForm(findValueByKey('executor_status_page', parameters)!),
    ]);

    isAnswerYes(nextOfKin.data) && form.resetPersonType({ personType: 'nextOfKin' });
    isAnswerYes(executor.data) && form.resetPersonType({ personType: 'executor' });
    if (isAnswerNo(nextOfKin.data)) {
      const nextOfKinAbout = await api.mdp.bereavementJourneyQuestionForm(
        findValueByKey('next_of_kin_about_status_page', parameters)!,
      );
      isAnswerNo(nextOfKinAbout?.data) && form.resetPersonType({ personType: 'nextOfKin' });
    }
    if (isAnswerNo(executor.data)) {
      const executorAbout = await api.mdp.bereavementJourneyQuestionForm(
        findValueByKey('executor_about_status_page', parameters)!,
      );
      isAnswerNo(executorAbout?.data) && form.resetPersonType({ personType: 'executor' });
    }

    return { nextOfKin, executor };
  });

  return {
    loading: initialAppData.loading,
    isNextOfKin: isAnswerYes(initialAppData.result?.nextOfKin?.data),
    isExecutor: isAnswerYes(initialAppData.result?.executor?.data),
  };
};
