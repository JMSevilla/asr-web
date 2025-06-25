import { ContentFund } from '../../../api/content/types/funds';
import { RetirementDCContributions } from '../../../api/mdp/types';

export const parseDisplayableFunds = (contributions: RetirementDCContributions, funds: ContentFund[]): ContentFund[] =>
  contributions.contributionTypes
    .flatMap(ct => ct.funds)
    .map(fund => funds.find(f => f.fundCode === fund?.code))
    .filter(Boolean) as ContentFund[];

export const parseGroupedFunds = (funds: ContentFund[], sortOrder: { value: string; label: string }[] = []) => {
  const grouped = [...funds]
    .sort(sortFundsByOrderThenByLabel)
    .reduce(
      (acc: Record<string, ContentFund[]>, row: ContentFund) =>
        acc[row.fundGroup]
          ? { ...acc, [row.fundGroup]: [...acc[row.fundGroup], row] }
          : { ...acc, [row.fundGroup]: [row] },
      {} as Record<string, ContentFund[]>,
    );
  const sortedGrouped = Object.keys(grouped)
    .sort((a, b) => sortOrder.findIndex(s => s.value === a) - sortOrder.findIndex(s => s.value === b))
    .reduce((acc, key) => ({ ...acc, [key]: grouped[key] }), {} as Record<string, ContentFund[]>);

  return sortedGrouped;
};

const sortFundsByOrderThenByLabel = (a: ContentFund, b: ContentFund) => {
  if (Number.isInteger(a.orderNo) && Number.isInteger(b.orderNo)) {
    return a.orderNo! - b.orderNo!;
  }

  if (Number.isInteger(a.orderNo)) {
    return -1;
  }

  if (Number.isInteger(b.orderNo)) {
    return 1;
  }

  return a.fundName.localeCompare(b.fundName);
};
