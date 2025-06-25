import { useState } from 'react';
import { ContentFund } from '../../../../api/content/types/funds';
import { useApi } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { parseDisplayableFunds } from '../parsing';

export const useFundRows = () => {
  const cachedAccessKey = useCachedAccessKey();
  const funds = useApi(
    async api => {
      const [schemeCode, category] = cachedAccessKey.data?.schemeCodeAndCategory?.split('-') || [];
      if (!schemeCode || !category) {
        return [];
      }
      const [funds, contentDefinedFunds] = await Promise.all([
        api.mdp.retirementDcSpendingFunds(schemeCode, category),
        api.content.authorizedFunds(cachedAccessKey.data?.contentAccessKey),
      ]);
      return parseDisplayableFunds(funds.data, contentDefinedFunds.data?.funds ?? []);
    },
    [cachedAccessKey.data?.contentAccessKey],
  );
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const sortedRows = funds.result?.sort(sortFunds(selectedFunds)) ?? [];
  const checkedRows = sortedRows.filter(row => selectedFunds.includes(row.fundCode));

  return {
    rows: sortedRows,
    selected: checkedRows,
    error: (Array.isArray(funds.error) ? funds.error[0] : funds.error) as string | undefined,
    update: setSelectedFunds,
  };
};

function sortFunds(selectedFunds: string[]) {
  return (a: ContentFund, b: ContentFund) => {
    if (sortByGroup(a, b) === 0) {
      if (sortByChecked(selectedFunds)(a, b) === 0) {
        return sortByLabel(a, b);
      }
      return sortByChecked(selectedFunds)(a, b);
    }
    return sortByGroup(a, b);
  };
}

function sortByChecked(selectedFunds: string[]) {
  return (a: ContentFund, b: ContentFund) => {
    if (selectedFunds.includes(a.fundCode) === selectedFunds.includes(b.fundCode)) {
      return 0;
    }
    return selectedFunds.includes(a.fundCode) ? -1 : 1;
  };
}

function sortByGroup(a: ContentFund, b: ContentFund) {
  return a.fundGroup.localeCompare(b.fundGroup);
}

function sortByLabel(a: ContentFund, b: ContentFund) {
  return a.fundName.localeCompare(b.fundName);
}
