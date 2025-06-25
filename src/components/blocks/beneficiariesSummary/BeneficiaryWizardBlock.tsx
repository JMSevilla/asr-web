import { FC, useState } from 'react';
import { PanelListItem } from '../../../api/content/types/page';
import { BeneficiaryListUpdateRequest } from '../../../api/mdp/types';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { BeneficiariesLoader } from './BeneficiariesLoader';
import { BeneficiaryWizardForm } from './beneficiaryWizardForm/BeneficiaryWizardForm';
import { BeneficiaryWizardFormContextProvider } from './beneficiaryWizardForm/BeneficiaryWizardFormContext';
import { BeneficiaryFormType } from './beneficiaryWizardForm/types';
import {
  mapBeneficiariesSummaryFormValuesToUpdateRequest,
  mapBeneficiariesToWizardFormValues,
} from './beneficiaryWizardForm/utils';
interface Props {
  id: string;
  panelList?: PanelListItem[];
  backPageKey?: string;
}

export const BeneficiaryWizardBlock: FC<Props> = ({ id, panelList = [], backPageKey }) => {
  const router = useRouter();
  const accessKey = useCachedAccessKey();
  const beneficiaries = useApi(async api => await api.mdp.beneficiaries());
  const dependants = useApi(async api => await api.mdp.dependants());
  const backUrl = useApi(api => (backPageKey ? api.content.urlFromKey(backPageKey) : Promise.reject()), [backPageKey]);
  const url = backUrl.result?.data?.url;
  const [isSummaryView, setSummaryView] = useState(false);

  const updateBeneficiaryListCb = useApiCallback(async (api, params: BeneficiaryListUpdateRequest) => {
    const result = await api.mdp.updateBeneficiaryList(params);
    !!url && (await router.push({ url, query: { message: 'beneficiaries_saved' } }));
    return result;
  });

  if (beneficiaries.loading || dependants.loading || backUrl.loading) return <BeneficiariesLoader />;

  return (
    <BeneficiaryWizardFormContextProvider
      beneficiaries={beneficiaries.result?.data.beneficiaries}
      dependants={
        !!dependants.result?.data.dependants?.length
          ? mapBeneficiariesToWizardFormValues(dependants.result?.data.dependants)
          : []
      }
      formKey={id}
      panelList={panelList}
    >
      <BeneficiaryWizardForm
        id={id}
        onConfirmSave={handleOnUpdate}
        modalIsLoading={updateBeneficiaryListCb.loading || router.loading}
        isLoading={beneficiaries.loading || updateBeneficiaryListCb.loading}
        isSummaryView={isSummaryView || !!beneficiaries.result?.data.beneficiaries?.length}
        backUrl={url}
      />
    </BeneficiaryWizardFormContextProvider>
  );

  async function handleOnUpdate(values: BeneficiaryFormType[]) {
    setSummaryView(true);
    const request = mapBeneficiariesSummaryFormValuesToUpdateRequest(accessKey?.data?.contentAccessKey ?? '', values);
    await updateBeneficiaryListCb.execute(request);
  }
};
