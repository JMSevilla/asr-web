import { useRetirementContext } from '../../../../core/contexts/retirement/RetirementContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { CustomActionHook } from '../types';

export const useSetSelectedRetirementDateAction: CustomActionHook = props => {
  const { setSelectedRetirementDate, onRetirementDateChanged } = useRetirementContext();
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();

  const startCb = useApiCallback(async api => {
    if (props?.params) {
      setSelectedRetirementDate(new Date(props.params));
      onRetirementDateChanged(new Date(props.params));
    }
  });

  return {
    execute: startCb.execute,
    loading: router.parsing || router.loading || startCb.loading || cachedAccessKey.loading,
  };
};
