import React, { createContext, useContext, useMemo, useState } from 'react';
import { UseAsyncReturn } from 'react-async-hook';
import { CmsTenant } from '../../../api/content/types/tenant';
import {
  RetirementCalculation,
  RetirementQuotesV3Response,
  TransferOptions,
  UserRetirementApplicationStatus,
} from '../../../api/mdp/types';
import { useCachedApiCallback } from '../../hooks/useCachedApi';
import { useQuotesOptions, useTransferOptions } from './hooks';

interface Props {
  tenant: CmsTenant;
}

interface RetirementContextValue {
  retirementCalculation?: RetirementCalculation;
  retirementCalculationLoading: boolean;
  transferOptions?: TransferOptions;
  transferOptionsLoading: boolean;
  quotesOptions?: RetirementQuotesV3Response & Partial<UserRetirementApplicationStatus>;
  quotesOptionsLoading: boolean;
  quotesOptionsError?: Error;
  uncachedOptions: UseAsyncReturn<RetirementQuotesV3Response>;
  filtersUpdating: boolean;
  filtersEnabled: boolean;
  selectedRetirementDate?: Date;
  setSelectedRetirementDate: (date: Date | undefined) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  onFilterUpdateStart: () => void;
  onFilterUpdateEnd: () => void;
  onRetirementDateChanged: AsyncFunction<
    [Date] | [Date, boolean],
    (RetirementQuotesV3Response & Partial<UserRetirementApplicationStatus>) | undefined
  >;
  refreshQuotesOptions: AsyncFunction<unknown, void>;
  init: AsyncFunction<unknown, void>;
}

const RetirementContext = createContext<RetirementContextValue>({
  retirementCalculation: undefined,
  retirementCalculationLoading: false,
  transferOptions: undefined,
  transferOptionsLoading: false,
  quotesOptionsError: undefined,
  quotesOptionsLoading: false,
  uncachedOptions: undefined as any,
  filtersUpdating: false,
  filtersEnabled: false,
  selectedRetirementDate: undefined,
  setSelectedRetirementDate: () => undefined,
  applyFilters: () => undefined,
  resetFilters: () => undefined,
  onFilterUpdateStart: () => undefined,
  onFilterUpdateEnd: () => undefined,
  onRetirementDateChanged: () => Promise.resolve(undefined),
  refreshQuotesOptions: () => Promise.resolve(),
  init: () => Promise.resolve(),
});

export const useRetirementContext = () => useContext(RetirementContext);

export const RetirementContextProvider: React.FC<React.PropsWithChildren<Props>> = ({ children, tenant }) => {
  const retirementCalculation = useCachedApiCallback(api => api.mdp.retirementCalculations(), 'retirement-calculation');
  const quotesOptions = useQuotesOptions(tenant);
  const transferOptions = useTransferOptions();
  const [filtersUpdating, setFiltersUpdating] = useState(false);
  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [selectedRetirementDate, setSelectedRetirementDate] = useState<Date | undefined>(undefined);

  return (
    <RetirementContext.Provider
      value={useMemo(
        () => ({
          retirementCalculation: retirementCalculation.result,
          retirementCalculationLoading: retirementCalculation.loading,
          transferOptions: transferOptions.result,
          transferOptionsLoading: transferOptions.loading,
          quotesOptions: quotesOptions.result,
          quotesOptionsError: quotesOptions.error,
          quotesOptionsLoading: quotesOptions.loading,
          uncachedOptions: quotesOptions.uncachedOptions,
          filtersUpdating,
          filtersEnabled,
          selectedRetirementDate,
          setSelectedRetirementDate,
          applyFilters: () => setFiltersEnabled(true),
          resetFilters: () => setFiltersEnabled(false),
          onFilterUpdateStart: () => setFiltersUpdating(true),
          onFilterUpdateEnd: () => setFiltersUpdating(false),
          onRetirementDateChanged: quotesOptions.update,
          refreshQuotesOptions: quotesOptions.refresh,
          init: async () => {
            transferOptions.execute();
            await Promise.all([retirementCalculation.execute(), quotesOptions.init()]);
          },
        }),
        [
          retirementCalculation.result,
          retirementCalculation.loading,
          transferOptions.result,
          transferOptions.loading,
          quotesOptions.result,
          quotesOptions.error,
          quotesOptions.loading,
          quotesOptions.uncachedOptions,
          filtersUpdating,
          selectedRetirementDate,
          quotesOptions.update,
          quotesOptions.refresh,
          quotesOptions.init,
        ],
      )}
    >
      {children}
    </RetirementContext.Provider>
  );
};
