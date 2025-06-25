import { useState } from 'react';
import { SecondaryButton } from '../..';
import { CmsTenant } from '../../../api/content/types/tenant';
import { MdpUserParams } from '../../../api/mdp/types';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { RetirementApplicationDeleteModal } from './RetirementApplicationDeleteModal';

interface Props {
  id?: string;
  tenant: CmsTenant | null;
}

export const RetirementApplicationDeleteBlock: React.FC<Props> = ({ id, tenant }) => {
  const { labelByKey } = useGlobalsContext();
  const [open, setOpen] = useState(false);
  const router = useRouter();
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

  return (
    <>
      <SecondaryButton
        id={id}
        loading={loading}
        onClick={handleApplicationDeleteClick}
        data-testid="retirement-info-panel-delete"
      >
        {labelByKey('retirement_application_delete')}
      </SecondaryButton>
      <RetirementApplicationDeleteModal open={open} onClose={handleClose} onDelete={handleDelete} isLoading={loading} />
    </>
  );

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
};
