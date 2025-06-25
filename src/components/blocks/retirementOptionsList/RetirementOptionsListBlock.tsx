import { Grid, Stack, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import { MessageType } from '../..';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { RetirementOptionsListItem } from '../../../api/content/types/retirement';
import { JourneyStepParams } from '../../../api/mdp/types';
import { isTrue } from '../../../business/boolean';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useCachedCmsTokens } from '../../../core/contexts/contentData/useCachedCmsTokens';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useFormSubmissionState } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useRouter } from '../../../core/router';
import { OptionLoader } from './OptionLoader';
import { RetirementOption } from './RetirementOption';
import { useRetirementOptionsList } from './useRetirementOptionsList';

interface Props {
  id: string;
  pageKey: string;
  journeyType: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}

export const RetirementOptionsListBlock: React.FC<Props> = ({ id, pageKey, journeyType, parameters }) => {
  const classes = useStyles();
  const router = useRouter();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { errorByKey, htmlByKey } = useGlobalsContext();
  const isRootLevel = isTrue(findValueByKey('isRootLevel', parameters));
  const shouldSortByOptionNumber = isTrue(findValueByKey('sort_by_option_number', parameters));
  const shouldHideTransferOptions = isTrue(findValueByKey('transfer_hide', parameters));
  const customProtectedQuoteHtmlKey = findValueByKey('quote_protected_custom_html_key ', parameters);
  const hideADVProtectedQuotesBadge = isTrue(findValueByKey('hide_ADV_protected_quotes_badge ', parameters));
  const cachedAccessKey = useCachedAccessKey();
  const options = useRetirementOptionsList({
    pageKey,
    journeyType,
    rootLevelList: isRootLevel,
    shouldSortByOptionNumber,
    onCalculationFailed: handleCalculationFailed,
  });
  const cachedCmsTokens = useCachedCmsTokens();
  const formSubmissionState = useFormSubmissionState();
  const submitStepCb = useApiCallback((api, p: JourneyStepParams) => api.mdp.quoteSelectionJourneySubmitStep(p));

  useEffect(() => {
    const errors = submitStepCb.error as unknown as string[];
    if (errors) showNotifications(errors.map(error => ({ type: MessageType.Problem, message: errorByKey(error) })));
    if (!errors) hideNotifications();
    return hideNotifications;
  }, [showNotifications, hideNotifications, submitStepCb.error]);

  if (options.loading || options.failedCalcActionInProcess) {
    return (
      <Grid
        className={classes.gridContainer}
        container
        id={id}
        component="section"
        data-testid="options-loader"
        spacing={0}
        pt={10}
      >
        {Array.from(Array(4).keys()).map(key => (
          <Grid key={key} item xs={12}>
            <OptionLoader />
          </Grid>
        ))}
      </Grid>
    );
  }

  const optionLoading =
    submitStepCb.loading ||
    cachedAccessKey.loading ||
    cachedCmsTokens.loading ||
    router.loading ||
    router.parsing ||
    formSubmissionState.isSubmitting;

  return (
    <Grid className={classes.gridContainer} container id={id} data-testid="options-list" spacing={0} pt={10}>
      {options.list.map((option, idx) => (
        <Grid key={idx} item xs={12} component="section">
          <Stack gap={20}>
            {!!shouldDisplayOptionType(idx) && htmlByKey(`options_list_type_${option.elements.type!.value}`)}
            <RetirementOption
              index={+(options.optionNumberByKey(option.elements.key.value) || idx + 1)}
              option={option}
              pageKey={pageKey}
              loading={optionLoading}
              findSummaryItemValue={options.valueByKey}
              onItemActionClicked={navigateToOption(option)}
              quoteExpiryDate={options.quoteExpiryDate}
              customProtectedQuoteHtmlKey={customProtectedQuoteHtmlKey}
              hideADVProtectedQuotesBadge={hideADVProtectedQuotesBadge}
            />
          </Stack>
        </Grid>
      ))}
      {options.transferDependantListLoading ? (
        <Grid item xs={12}>
          <OptionLoader />
        </Grid>
      ) : (
        options.transferDependantList.map((option, idx) => (
          <Grid key={idx} item xs={12} component="section">
            <RetirementOption
              index={+(options.optionNumberByKey(option.elements.key.value) || options.list.length + idx + 1)}
              option={option}
              pageKey={pageKey}
              loading={optionLoading}
              findSummaryItemValue={options.valueOfTransferDependantByKey}
              onItemActionClicked={navigateToOption(option)}
              quoteExpiryDate={options.quoteExpiryDate}
              customProtectedQuoteHtmlKey={customProtectedQuoteHtmlKey}
              hideADVProtectedQuotesBadge={hideADVProtectedQuotesBadge}
            />
          </Grid>
        ))
      )}
      {shouldHideTransferOptions ? null : options.transferLoading ? (
        <Grid item xs={12}>
          <OptionLoader />
        </Grid>
      ) : options.transferOption ? (
        <Grid item xs={12} component="section">
          <RetirementOption
            index={
              +(
                options.optionNumberByKey(options.transferOption.elements.key.value) ||
                options.list.length + options.transferDependantList.length + 1
              )
            }
            option={options.transferOption}
            pageKey={pageKey}
            loading={optionLoading}
            findSummaryItemValue={options.valueOfTransferByKey}
            onItemActionClicked={navigateToOption(options.transferOption)}
            hideADVProtectedQuotesBadge={hideADVProtectedQuotesBadge}
          />
        </Grid>
      ) : null}
    </Grid>
  );

  function navigateToOption(option: RetirementOptionsListItem) {
    return async () => {
      const nextPageKey = option.elements.callToAction?.value?.elements.pageKey?.value || option.elements.link.value;
      await submitStepCb.execute({
        nextPageKey,
        currentPageKey: pageKey,
        selectedQuoteName: [options.selectedQuoteName, option.elements.key.value].filter(Boolean).join('.'),
      });

      if (cachedAccessKey.data?.schemeType === 'DC') {
        await cachedAccessKey.refresh();
      } else {
        await Promise.all([cachedAccessKey.refresh(), cachedCmsTokens.refresh()]);
      }

      await router.parseUrlAndPush(nextPageKey);
    };
  }

  async function handleCalculationFailed() {
    await cachedAccessKey.refresh();
    router.reload();
  }

  function shouldDisplayOptionType(index: number) {
    return options.list[index]?.elements.type?.value !== options.list[index - 1]?.elements.type?.value;
  }
};

const useStyles = makeStyles<Theme>(theme => ({
  gridContainer: {
    '& > *': {
      paddingBottom: theme.spacing(20),
      '&:last-child': {
        paddingBottom: 0,
      },
    },
  },
}));
