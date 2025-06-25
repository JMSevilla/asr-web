import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { Api } from '../../../api/api';
import { CmsTenant } from '../../../api/content/types/tenant';
import { timelessDateString } from '../../../business/dates';
import { useApiCallback } from '../../hooks/useApi';
import { useCachedAccessKey } from '../../hooks/useCachedAccessKey';
import { useCachedApiCallback } from '../../hooks/useCachedApi';
import { useContentDataContext } from '../contentData/ContentDataContext';
import { useCachedCmsTokens } from '../contentData/useCachedCmsTokens';
import { retirementApplicationStatusParams } from './utils';

export const useTransferOptions = () => {
  const cachedAccessKey = useCachedAccessKey();
  const cmsTokens = useCachedCmsTokens();

  return useCachedApiCallback(async api => {
    const result = await api.mdp.transferOptions();
    await Promise.all([cachedAccessKey.refresh(), cmsTokens.refresh()]);
    return result;
  }, 'transfer-options');
};

export const useQuotesOptions = (tenant: CmsTenant | null) => {
  const { updateCmsToken } = useContentDataContext();
  const cachedAccessKey = useCachedAccessKey();

  const retirementDateCb = useApiCallback(async (api: Api) => {
    const date = await api.mdp.retirementDate();
    if (typeof date === 'string') return parseISO(timelessDateString(date));
    return parseISO(date.data.retirementDate);
  });

  const retirementStatusCb = useApiCallback(async (api: Api) => {
    const result = await api.mdp.userRetirementApplicationStatus(retirementApplicationStatusParams(tenant));
    updateCmsToken('earliestStartRaDateForSelectedDate', result.data.earliestStartRaDateForSelectedDate);
    updateCmsToken('latestStartRaDateForSelectedDate', result.data.latestStartRaDateForSelectedDate);
    updateCmsToken('retirementJourneyExpirationDate', result.data.expirationRaDateForSelectedDate);
    return result;
  });

  const optionsCb = useCachedApiCallback(async (api: Api, newDate?: Date) => {
    const date = newDate ?? (await retirementDateCb.execute());
    const options = await api.mdp.retirementQuotesV3(date);
    updateCmsToken('selectedRetirementDate', new Date(date).toUTCString());

    if (cachedAccessKey.data?.schemeType === 'DC') {
      return options.data;
    }

    const status = await retirementStatusCb.execute();
    await cachedAccessKey.refresh();
    return { ...options.data, ...status.data };
  }, 'retirement-quotes-V3');

  const uncachedOptionsCb = useCachedApiCallback(async (api: Api, newDate?: Date) => {
    const date = newDate ?? (await retirementDateCb.execute());
    const options = await api.mdp.retirementQuotesV3(date, true);
    return options.data;
  }, 'retirement-quotes-V3-uncached');

  return useMemo(
    () => ({
      result: optionsCb.result,
      error: optionsCb.error,
      loading: optionsCb.loading,
      uncachedOptions: uncachedOptionsCb,
      update: async (date: Date, forced = false) => {
        const previousDate = optionsCb.currentParams?.[0];
        if (previousDate === date && !forced) return;
        const result = await Promise.all([
          optionsCb.execute(date),
          // uncachedOptionsCb.execute(date) // Disabled until transfer dependant options are ready
        ]);
        return result[0];
      },
      refresh: async () => {
        const date = await retirementDateCb.execute();
        await optionsCb.execute(date);
      },
      init: async () => {
        const date = await retirementDateCb.execute();
        await optionsCb.execute(date);
      },
    }),
    [
      optionsCb.result,
      optionsCb.error,
      optionsCb.loading,
      optionsCb.currentParams,
      uncachedOptionsCb.result,
      uncachedOptionsCb.error,
      uncachedOptionsCb.loading,
    ],
  );
};
