import { useState } from 'react';
import { MdpUserParams } from '../../../../api/mdp/types';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { useTenantContext } from '../../../../core/contexts/TenantContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { RetirementApplicationDeleteModal } from '../../../blocks/retirementApplicationDelete/RetirementApplicationDeleteModal';
import { CustomActionHook } from '../types';

export const useDeleteRAAction: CustomActionHook = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { tenant } = useTenantContext();
  const { clearCmsTokens } = useContentDataContext();
  const cachedAccessKey = useCachedAccessKey();
  const deleteCb = useApiCallback(async api => {
    const result = await api.mdp.retirementJourneyDelete();
    clearCmsTokens();
    return result;
  });
  const userRetirementApplicationStatusCb = useApiCallback((api, params: MdpUserParams) =>
    api.mdp.userRetirementApplicationStatus(params),
  );
  const loading =
    deleteCb.loading ||
    userRetirementApplicationStatusCb.loading ||
    cachedAccessKey.loading ||
    router.loading ||
    router.parsing;

  function handleApplicationDeleteClick() {
    setOpen(true);
  }

  async function handleDelete() {
    setOpen(true);
    const result = await deleteCb.execute();
    await userRetirementApplicationStatusCb.execute({
      preRetirementAgePeriod: tenant?.preRetiremetAgePeriod?.value ?? 0,
      newlyRetiredRange: tenant?.newlyRetiredRange?.value ?? 0,
      retirementApplicationPeriod: 6,
    });
    await cachedAccessKey.refresh();

    if (result.data.nextPageKey) {
      await router.parseUrlAndPush(result.data.nextPageKey);
    } else {
      router.reload();
    }
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }

  return {
    execute: handleApplicationDeleteClick,
    loading,
    node: (
      <RetirementApplicationDeleteModal open={open} onClose={handleClose} onDelete={handleDelete} isLoading={loading} />
    ),
  };
};
