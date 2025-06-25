import React from 'react';
import { PrimaryButton } from '..';
import { CmsTenant } from '../../api/content/types/tenant';
import { MdpUserParams, RetirementJourneySubmitData } from '../../api/mdp/types';
import { findValueByKey } from '../../business/find-in-array';
import { useAcknowledgementsContext } from '../../core/contexts/AcknowledgementsContext';
import { useContentDataContext } from '../../core/contexts/contentData/ContentDataContext';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
  tenant: CmsTenant | null;
}

export const SubmissionBlock: React.FC<Props> = ({ id, parameters, tenant }) => {
  const router = useRouter();
  const { labelByKey } = useGlobalsContext();
  const cachedAccessKey = useCachedAccessKey();
  const { clearCmsTokens } = useContentDataContext();
  const { acknowledgements, toggleIsSubmitting } = useAcknowledgementsContext();
  const successPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const failurePageKey = findValueByKey('error_next_page', parameters) ?? '';
  const submitJourneyCb = useApiCallback(async (api, data: RetirementJourneySubmitData) => {
    const result = await api.mdp.retirementJourneySubmit(data);
    clearCmsTokens();
    return result;
  });
  const userRetirementApplicationStatusCb = useApiCallback((api, params: MdpUserParams) =>
    api.mdp.userRetirementApplicationStatus(params),
  );
  const { membership } = useContentDataContext();

  return (
    <PrimaryButton
      id={id}
      onClick={onSubmit}
      loading={
        submitJourneyCb.loading ||
        userRetirementApplicationStatusCb.loading ||
        cachedAccessKey.loading ||
        router.loading ||
        router.parsing
      }
      data-mdp-key="retirement_app_submit"
      data-testid="retirement_app_submit"
      disabled={!!membership?.hasAdditionalContributions && (!acknowledgements?.option2 || !acknowledgements?.option1)}
    >
      {labelByKey('retirement_app_submit')}
    </PrimaryButton>
  );

  async function onSubmit() {
    toggleIsSubmitting(true);
    try {
      await submitJourneyCb.execute({
        contentAccessKey: cachedAccessKey.data!.contentAccessKey,
        acknowledgement: acknowledgements?.option1 ?? false,
        acknowledgementPensionWise: acknowledgements?.option2 ?? false,
        acknowledgementFinancialAdvisor: acknowledgements?.option3 ?? false,
      });
      await userRetirementApplicationStatusCb.execute({
        preRetirementAgePeriod: tenant?.preRetiremetAgePeriod?.value ?? 0,
        newlyRetiredRange: tenant?.newlyRetiredRange?.value ?? 0,
        retirementApplicationPeriod: 6,
      });

      await cachedAccessKey.refresh();
      await router.parseUrlAndPush(successPageKey);
    } catch (error) {
      await router.parseUrlAndPush(failurePageKey);
    } finally {
      toggleIsSubmitting(false);
    }
  }
};
