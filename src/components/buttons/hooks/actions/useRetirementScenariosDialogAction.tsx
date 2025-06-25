import { useState } from 'react';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { useApi } from '../../../../core/hooks/useApi';
import { PensionsProjectionsModal } from '../../../blocks/pensionProjections/shared/PensionsProjectionsModal';
import { CustomActionHook } from '../types';

export const useRetirementScenariosDialogAction: CustomActionHook = () => {
  const [open, setOpen] = useState(false);
  const lineAges = useApi(api => api.mdp.lineAges());
  const { membership } = useContentDataContext();

  return {
    execute: () => setOpen(true),
    loading: false,
    node: (
      <PensionsProjectionsModal
        open={open}
        onClose={() => setOpen(false)}
        ages={lineAges.result?.data.ageLines || []}
        normalRetirementAge={membership?.normalRetirementAge}
      />
    ),
  };
};
