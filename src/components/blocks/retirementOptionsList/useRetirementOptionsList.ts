import { useCallback, useEffect, useState } from 'react';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { RetirementOptionsList, RetirementOptionsListItem } from '../../../api/content/types/retirement';
import { RetirementQuotesV3Option, RetirementQuotesV3Response } from '../../../api/mdp/types';
import { isTrue } from '../../../business/boolean';
import { formatDate } from '../../../business/dates';
import { RETIREMENT_VALUE_PATH_DELIMITER, findRetirementOptionValueByKey } from '../../../business/retirement';
import { useTokenEnrichedValue } from '../../../cms/inject-tokens';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useSessionStorage } from '../../../core/hooks/useSessionStorage';

interface Props {
  pageKey: string;
  rootLevelList?: boolean;
  journeyType: JourneyTypeSelection;
  shouldSortByOptionNumber?: boolean;
  onCalculationFailed?: AsyncFunction;
}

let optionsInitialized = false;

export const useRetirementOptionsList = ({
  pageKey,
  rootLevelList,
  journeyType,
  shouldSortByOptionNumber,
  onCalculationFailed,
}: Props) => {
  const retirement = useRetirementContext();
  const quoteSelection = useQuoteSelection(pageKey, rootLevelList);
  const options = useQuoteOptions(quoteSelection.result?.data.selectedQuoteName, rootLevelList);
  const optionsFilter = useOptionsFilter(
    pageKey,
    journeyType,
    retirement.quotesOptionsLoading && retirement.quotesOptions?.isCalculationSuccessful !== false,
    retirement.filtersEnabled,
    [retirement.quotesOptions?.quotes],
  );
  const transferDependantOptions = useTransferDependantQuoteOptions(
    options.transferDependantOptionsExist,
    options.rawList,
    quoteSelection.result?.data.selectedQuoteName,
  );

  const failedCalcActionInProcess = useRefreshOnCalculationFailed(retirement.quotesOptions, onCalculationFailed);

  return {
    list: shouldSortByOptionNumber
      ? options.list
          .filter(optionsFilter.shouldDisplayOption)
          .sort(sortByOptionNumber(retirement.quotesOptions?.quotes))
      : options.list.filter(optionsFilter.shouldDisplayOption),
    transferDependantList: transferDependantOptions.list.filter(optionsFilter.shouldDisplayOption),
    transferDependantListLoading: transferDependantOptions.loading,
    selectedQuoteName: quoteSelection.result?.data.selectedQuoteName,
    loading: quoteSelection.loading || options.loading || optionsFilter.loading || retirement.filtersUpdating,
    transferLoading: rootLevelList && retirement.transferOptionsLoading,
    transferOption: rootLevelList
      ? options.rawList?.find(
          option =>
            option.elements?.key.value?.toLowerCase() === retirement.transferOptions?.transferOption.toLowerCase(),
        )
      : null,
    failedCalcActionInProcess,
    optionNumberByKey: (key: string) =>
      shouldSortByOptionNumber && retirement.quotesOptions?.quotes
        ? findRetirementOptionValueByKey(retirement.quotesOptions?.quotes, key, 'optionNumber')
        : null,
    quoteExpiryDate:
      (retirement.quotesOptions?.quotes?.quotation?.guaranteed &&
        retirement.quotesOptions?.quotes?.quotation?.expiryDate &&
        formatDate(retirement.quotesOptions.quotes.quotation.expiryDate)) ||
      null,
    valueByKey: (keys: string[]) =>
      retirement.quotesOptions ? findRetirementOptionValueByKey(retirement.quotesOptions.quotes, ...keys) : null,
    valueOfTransferDependantByKey: (keys: string[]) =>
      retirement.uncachedOptions.result
        ? findRetirementOptionValueByKey(retirement.uncachedOptions.result.quotes, ...keys)
        : null,
    valueOfTransferByKey: (keys: string[]) =>
      retirement.transferOptions
        ? findRetirementOptionValueByKey(
            { attributes: retirement.transferOptions as unknown as RetirementQuotesV3Option['attributes'] },
            ...keys,
          )
        : null,
  };
};

const useRefreshOnCalculationFailed = (options?: RetirementQuotesV3Response, onCalculationFailed?: AsyncFunction) => {
  const [callbackCalled, setCallbackCalled] = useSessionStorage(
    'retirementOptionsFailureCallbackCalled',
    options?.isCalculationSuccessful === false,
  );
  const [callbackInProcess, setCallbackInProcess] = useState(false);

  useEffect(() => {
    if (onCalculationFailed && !callbackCalled && options && !options.isCalculationSuccessful) {
      (async () => {
        setCallbackInProcess(true);
        setCallbackCalled(true);
        await onCalculationFailed();
        setCallbackInProcess(false);
      })();
    }
  }, [options?.isCalculationSuccessful]);

  return callbackInProcess;
};

const useOptionsFilter = (
  pageKey: string,
  journeyType: JourneyTypeSelection,
  optionsLoading = false,
  filtersEnabled: boolean,
  deps: unknown[] = [],
) => {
  const cachedAccessKey = useCachedAccessKey();
  const [loading, setLoading] = useState(optionsLoading);

  const optionsFilter = useApi(async api => {
    if (!optionsInitialized) {
      return Promise.reject();
    }

    setLoading(false);
    if (!journeyType || cachedAccessKey.data?.schemeType !== 'DC') {
      return Promise.reject();
    }

    const result = await api.mdp.genericJourneyAllData(journeyType);
    const checkboxesOptions = result.data.journey?.stepsWithData?.[pageKey]?.DC_options_filter_retirement_date
      ?.checkboxes as any;

    return {
      list: Object.entries(checkboxesOptions || {})
        .filter(([, val]) => val)
        .map(([key]) => key),
    };
  }, deps);

  const shouldDisplayOption = useCallback(
    (option: RetirementOptionsListItem) => {
      if (!journeyType || !optionsFilter.result?.list?.length) {
        return true;
      }
      if (!filtersEnabled) return optionsFilter.result.list;
      return option.elements.type?.value ? optionsFilter.result.list.includes(option.elements.type?.value) : false;
    },
    [optionsFilter.result],
  );

  useEffect(() => {
    if (journeyType && optionsLoading) {
      setLoading(true);
    }
  }, [journeyType, optionsLoading]);

  return {
    filters: optionsFilter.result,
    loading: optionsFilter.loading || loading,
    shouldDisplayOption,
  };
};

const useQuoteSelection = (pageKey: string, rootLevelList?: boolean) => {
  return useApi(async api => {
    if (rootLevelList) {
      return Promise.reject();
    }
    const result = await api.mdp.quoteSelectionJourneyPreviousStep(pageKey);
    return await api.mdp.quoteSelectionJourneyQuestionForm(result.data.previousPageKey);
  });
};

const useQuoteOptions = (selectedQuoteName?: string, rootLevelList?: boolean) => {
  const accessKey = useCachedAccessKey();
  const retirement = useRetirementContext();
  const options = useApi(
    async api => {
      if (!selectedQuoteName && !rootLevelList) {
        optionsInitialized = true;
        return Promise.reject();
      }

      await api.mdp.clearLumpSum();
      await retirement.refreshQuotesOptions();
      optionsInitialized = true;

      if (rootLevelList) {
        return await api.content.retirementOptionList(accessKey.data?.contentAccessKey);
      }
      if (selectedQuoteName) {
        return await api.content.retirementOptionList(accessKey.data?.contentAccessKey, selectedQuoteName);
      }
      return Promise.reject();
    },
    [selectedQuoteName],
  );

  const rawOptionsList = useTokenEnrichedValue(options.result?.data);
  const calculatedOptions =
    selectedQuoteName && retirement.quotesOptions
      ? findDisplayedOption(
          retirement.quotesOptions.quotes,
          ...selectedQuoteName.split(RETIREMENT_VALUE_PATH_DELIMITER),
        )
      : retirement.quotesOptions?.quotes;
  const optionsList = [...(rawOptionsList ?? [])]
    .filter(isCurrentLevelNonDependantOption(calculatedOptions))
    .sort(sortByOrderNo);
  const transferDependantOptionsExist = [...(rawOptionsList ?? [])].some(
    isCurrentLevelTransferDependantOption(calculatedOptions),
  );

  return {
    loading: options.loading || retirement.quotesOptionsLoading,
    list: optionsList,
    rawList: rawOptionsList,
    transferDependantOptionsExist,
  };
};

const useTransferDependantQuoteOptions = (
  exist: boolean,
  rawList?: RetirementOptionsList | null,
  selectedQuoteName?: string,
) => {
  const retirement = useRetirementContext();

  useEffect(() => {
    if (exist && !retirement.transferOptionsLoading && !retirement.uncachedOptions.result?.quotes) {
      retirement.uncachedOptions.execute();
    }
  }, [exist, retirement.transferOptions, retirement.transferOptionsLoading]);

  const calculatedUncachedOptions =
    selectedQuoteName && retirement.uncachedOptions.result
      ? findDisplayedOption(
          retirement.uncachedOptions.result.quotes,
          ...selectedQuoteName.split(RETIREMENT_VALUE_PATH_DELIMITER),
        )
      : retirement.uncachedOptions.result?.quotes;
  const transferDependantOptionsList = [...(rawList ?? [])]
    .filter(isCurrentLevelTransferDependantOption(calculatedUncachedOptions))
    .sort(sortByOrderNo);

  return {
    list: transferDependantOptionsList,
    loading: retirement.uncachedOptions.loading,
    transferDependantListLoading: retirement.uncachedOptions.loading,
  };
};

function isCurrentLevelNonDependantOption(calculatedOptions?: RetirementQuotesV3Option) {
  return (option: RetirementOptionsListItem) =>
    isCurrentLevelOption(option, calculatedOptions) && !isTransferDependantOption(option);
}

function isCurrentLevelTransferDependantOption(calculatedOptions?: RetirementQuotesV3Option) {
  return (option: RetirementOptionsListItem) =>
    isCurrentLevelOption(option, calculatedOptions) && isTransferDependantOption(option);
}

function isCurrentLevelOption(option: RetirementOptionsListItem, calculatedOptions?: RetirementQuotesV3Option) {
  return (
    option?.elements?.key.value && Object.keys(calculatedOptions?.options || {}).includes(option.elements.key.value)
  );
}

function isTransferDependantOption(option: RetirementOptionsListItem) {
  return isTrue(option?.elements.dependsOnTransfer?.value);
}

function sortByOrderNo(
  {
    elements: {
      orderNo: { value: currentOptionNo },
    },
  }: RetirementOptionsListItem,
  {
    elements: {
      orderNo: { value: nextOptionNo },
    },
  }: RetirementOptionsListItem,
) {
  if (currentOptionNo === undefined || nextOptionNo === undefined) return 0;
  return currentOptionNo - nextOptionNo;
}

function sortByOptionNumber(calculatedOptions?: RetirementQuotesV3Option) {
  return (
    {
      elements: {
        key: { value: currentKey },
      },
    }: RetirementOptionsListItem,
    {
      elements: {
        key: { value: nextKey },
      },
    }: RetirementOptionsListItem,
  ) => {
    if (!calculatedOptions) return 0;
    const currentOptionNumber = findRetirementOptionValueByKey(calculatedOptions, currentKey, 'optionNumber');
    const nextOptionNumber = findRetirementOptionValueByKey(calculatedOptions, nextKey, 'optionNumber');
    if (
      currentOptionNumber === undefined ||
      currentOptionNumber === null ||
      nextOptionNumber === undefined ||
      nextOptionNumber === null
    ) {
      return 0;
    }
    return +currentOptionNumber - +nextOptionNumber;
  };
}

function findDisplayedOption(quoteOption: RetirementQuotesV3Option, ...keys: string[]): RetirementQuotesV3Option {
  const [key, ...restKeys] = keys;
  const isLastKey = !restKeys.length;

  if (isLastKey && quoteOption.options) {
    return quoteOption.options[key];
  }

  return quoteOption.options ? findDisplayedOption(quoteOption.options[key], ...restKeys) : {};
}
