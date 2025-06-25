import { Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Button, MessageType, Tooltip } from '../../..';
import { JourneyTypeSelection } from '../../../../api/content/types/page';
import { isTrue } from '../../../../business/boolean';
import { createAllowedDateChecker } from '../../../../business/dates';
import { findValueByKey } from '../../../../business/find-in-array';
import { normalizeRetirementDate } from '../../../../business/retirement';
import { ParsedButtonProps } from '../../../../cms/parse-cms';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useTenantContext } from '../../../../core/contexts/TenantContext';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { useRetirementContext } from '../../../../core/contexts/retirement/RetirementContext';
import { retirementApplicationStatusParams } from '../../../../core/contexts/retirement/utils';
import { logger } from '../../../../core/datadog-logs';
import { useApi, useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useFormSubmissionBindingHooks } from '../../../../core/hooks/useFormSubmissionBindingHooks';
import { trackButtonClick } from '../../../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../../../core/mixpanel-tracker';
import { useRouter } from '../../../../core/router';
import { RetirementAgeInput } from './RetirementAgeInput';
import { RetirementDateInput } from './RetirementDateInput';
import { useDateCalculations } from './useDateCalculations';
import { useDateExplanationMessage } from './useDateExplanationMessage';

interface Props {
  id: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  buttons: ParsedButtonProps[];
}

let timer: NodeJS.Timeout;

export const RetirementDateBlock: React.FC<Props> = ({ id, pageKey, parameters, buttons }) => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const { tenant } = useTenantContext();
  const personType = findValueByKey('person_type', parameters) ?? '';
  const customMaxDateMonths = findValueByKey('max_date_months', parameters);
  const shouldSyncStatusOnDateChange = isTrue(findValueByKey('sync_status_to_date_input', parameters));
  const isMaxDateAsDefault = isTrue(findValueByKey('use_available_retirement_date_range_to_as_default', parameters));
  const { buttonByKey, labelByKey, tooltipByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const {
    selectedRetirementDate,
    setSelectedRetirementDate,
    quotesOptions,
    quotesOptionsLoading,
    onRetirementDateChanged,
  } = useRetirementContext();
  const { membership } = useContentDataContext();
  const dateInfoTooltip = tooltipByKey('explore_retirement_options_date_tooltip');
  const savedRetirementDate = useApi(async api => normalizeRetirementDate((await api.mdp.retirementDate()).data));
  const checkDBUserRAStatusCb = useApiCallback((api, date: Date) =>
    api.mdp.checkDBUserRetirementApplicationStatus(retirementApplicationStatusParams(tenant), date),
  );
  const pdfDownloadCb = useApiCallback(api => api.mdp.retirementQuoteDocument());
  const startJourneyCb = useApiCallback(
    async (api, journeyParams: { pageKey: string; linkKey: string; journeyType: JourneyTypeSelection }) => {
      const { pageKey, linkKey, journeyType } = journeyParams;
      if (pageKey && linkKey && journeyType) {
        await api.mdp.genericJourneyStart(journeyType, {
          currentPageKey: pageKey,
          nextPageKey: linkKey,
          removeOnLogin: true,
        });
      }
    },
  );

  const dateCalc = useDateCalculations(
    savedRetirementDate.result,
    customMaxDateMonths,
    isMaxDateAsDefault,
    selectedRetirementDate,
  );
  const allowedDates = savedRetirementDate.result?.guaranteedQuoteEffectiveDateList ?? [];
  const dateExplanationMessage = useDateExplanationMessage(
    shouldSyncStatusOnDateChange ? checkDBUserRAStatusCb.result?.data : quotesOptions,
    quotesOptions?.quotes?.quotation,
  );
  const [canRecalculate, setCanRecalculate] = useState(false);
  const [shouldDisplayMessage, setShouldDisplayMessage] = useState(false);
  const [optionsUpdated, setOptionsUpdated] = useState(false);
  const loading =
    quotesOptionsLoading ||
    savedRetirementDate.loading ||
    pdfDownloadCb.loading ||
    router.loading ||
    cachedAccessKey.loading;
  const calculateButton = buttonByKey('explore_retirement_options_date_calculate_btn');
  const protectedQuotesButton = buttonByKey('ADV_View_protected_quotes_button');
  const isCalculateButtonDisabled = useCallback(() => {
    return (
      !dateCalc.selectedDate || dateCalc.selectedDate.getTime() === dateCalc.lastValidDate?.getTime() || !canRecalculate
    );
  }, [dateCalc.selectedDate, dateCalc.lastValidDate, canRecalculate]);
  const contentAccessKey = cachedAccessKey.data?.contentAccessKey
    ? JSON.parse(cachedAccessKey.data?.contentAccessKey)
    : undefined;

  useFormSubmissionBindingHooks({
    key: `${id}_${personType}`,
    isValid: !loading,
    cb: () => Promise.resolve({}),
    initDependencies: [loading],
  });

  useEffect(() => {
    if (shouldSyncStatusOnDateChange && checkDBUserRAStatusCb.status === 'not-requested' && dateCalc.selectedDate) {
      checkDBUserRAStatusCb.execute(dateCalc.selectedDate);
    }
  }, [shouldSyncStatusOnDateChange, dateCalc.selectedDate]);

  useEffect(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const isLoading = shouldSyncStatusOnDateChange ? checkDBUserRAStatusCb.loading : quotesOptionsLoading;
      const dataExists = shouldSyncStatusOnDateChange ? checkDBUserRAStatusCb.result?.data : quotesOptions;
      setShouldDisplayMessage(
        !!(
          dataExists &&
          !isLoading &&
          dateExplanationMessage &&
          !savedRetirementDate.loading &&
          membership?.status?.toLowerCase() === 'deferred'
        ),
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [
    quotesOptions,
    dateExplanationMessage,
    membership?.status,
    quotesOptionsLoading,
    savedRetirementDate.loading,
    checkDBUserRAStatusCb.loading,
    checkDBUserRAStatusCb.result?.data,
    shouldSyncStatusOnDateChange,
  ]);

  useEffect(() => {
    if (quotesOptions?.isCalculationSuccessful) {
      dateCalc.confirmSelectedDateIsValid();
    }
  }, [quotesOptions?.isCalculationSuccessful]);

  return (
    <Grid container item xs={12} spacing={6} id={id} alignItems="flex-end">
      <Grid item data-testid="date-picker">
        <RetirementDateInput
          loading={savedRetirementDate.loading}
          selectedDate={dateCalc.selectedDate}
          shouldDisableDate={date => !createAllowedDateChecker(allowedDates, dateCalc.dateFrom, dateCalc.dateTo)(date)}
          onChanged={handleDateChange}
        />
      </Grid>
      {!customMaxDateMonths && (
        <Grid item data-testid="age-picker">
          <RetirementAgeInput
            loading={savedRetirementDate.loading}
            selectedAge={dateCalc.selectedAge}
            options={dateCalc.ageOptions}
            onChanged={handleAgeChange}
          />
        </Grid>
      )}
      {!!buttons.length ? (
        buttons.map((button, index) => (
          <Grid item key={index}>
            <Button
              {...button}
              data-testid={button.key}
              onClick={() => handleButtonClick(button)}
              loading={loading}
              disabled={loading}
            />
          </Grid>
        ))
      ) : (
        <Grid item>
          {calculateButton && (
            <Button
              data-testid="calculate-button"
              {...calculateButton}
              onClick={() => handleCalculateSubmit()}
              disabled={isCalculateButtonDisabled()}
              loading={loading}
            />
          )}
        </Grid>
      )}
      {protectedQuotesButton?.type && (
        <Grid item>
          <Button data-testid="protected-quotes-button" {...protectedQuotesButton} />
        </Grid>
      )}
      <span data-testid="hidden-text" className="visually-hidden" aria-live="assertive" {...assertiveMessageProps()} />
      {dateInfoTooltip?.text && (
        <Grid item xs={12}>
          <Tooltip header={dateInfoTooltip.header} html={dateInfoTooltip.html} underlinedText>
            {dateInfoTooltip.text}
          </Tooltip>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        sx={{
          mt: shouldDisplayMessage ? 6 : 0,
          opacity: shouldDisplayMessage ? 1 : 0,
          maxHeight: shouldDisplayMessage ? 1000 : 0,
          transition: theme => theme.transitions.create('all'),
        }}
      >
        <Typography variant="firstLevelValue" data-testid="date-explanation-message">
          {dateExplanationMessage}
        </Typography>
      </Grid>
    </Grid>
  );

  async function handleButtonClick(button: ParsedButtonProps) {
    if (button.key?.includes('retirement_date_quote_calculate_and_download_btn')) {
      await handleQuoteSubmit(button.linkKey, button.journeyType);
    } else {
      await handleCalculateSubmit();
    }
  }

  async function handleQuoteSubmit(nextPageKey?: string, journeyType?: JourneyTypeSelection) {
    if (!nextPageKey || !journeyType) {
      logger.error('Cannot proceed with quote submission due to missing parameters');
      return;
    }

    await handleCalculateSubmit(!!nextPageKey);

    if (quotesOptions?.isCalculationSuccessful) {
      try {
        await pdfDownloadCb.execute();
      } catch (e) {
        logger.error('Error downloading retirement quote', e as object);
        await handleUnsuccessfulCalculation(nextPageKey, journeyType);
      }
    } else {
      await handleUnsuccessfulCalculation(nextPageKey, journeyType);
    }
  }

  async function handleUnsuccessfulCalculation(nextPageKey: string, journeyType?: JourneyTypeSelection) {
    if (contentAccessKey.wordingFlags.includes('overTheRetirementQuoteLimit')) {
      await router.parseUrlAndPush(nextPageKey);
      return;
    }

    if (!journeyType) {
      logger.error('JourneyType is not defined.');
      return;
    }

    // Initiate the journey before navigation as we're transitioning into a page within a journey
    await startJourneyCb.execute({ pageKey, linkKey: nextPageKey, journeyType });
    await cachedAccessKey.refresh();
    await router.parseUrlAndPush(nextPageKey);
  }

  async function handleCalculateSubmit(supressNotifications: boolean = false) {
    setOptionsUpdated(false);
    mixpanelTrackButtonClick({
      Category: 'calculate retirement date',
    });
    trackButtonClick('calculate retirement date');

    if (!dateCalc.selectedDate) return;
    setCanRecalculate(false);
    const result = await onRetirementDateChanged(dateCalc.selectedDate);

    if (result?.isCalculationSuccessful) {
      setOptionsUpdated(true);
      dateCalc.confirmSelectedDateIsValid();
      hideNotifications();
      selectedRetirementDate && setSelectedRetirementDate(undefined);
      return;
    }

    if (!result?.isCalculationSuccessful && dateCalc.lastValidDate && !supressNotifications) {
      showNotifications([{ type: MessageType.Problem, message: errorByKey('unsuccessful_calculation_error') }]);
      dateCalc.changeDate(dateCalc.lastValidDate);
      onRetirementDateChanged(dateCalc.lastValidDate);
    }
  }

  function handleAgeChange(age: number) {
    if (shouldSyncStatusOnDateChange) {
      const currentDate = dateCalc.calculateDateByAge(age);
      currentDate && checkDBUserRAStatusCb.execute(currentDate);
    }
    setCanRecalculate(true);
    dateCalc.changeAge(age);
  }

  function handleDateChange(date: Date) {
    if (shouldSyncStatusOnDateChange) {
      checkDBUserRAStatusCb.execute(date);
    }
    setCanRecalculate(true);
    dateCalc.changeDate(date);
  }

  function assertiveMessageProps() {
    if (loading) {
      return { 'data-loading-msg': labelByKey('explore_retirement_options_date_loading') };
    }
    if (optionsUpdated) {
      return { 'data-loading-msg': labelByKey('explore_retirement_options_date_updated') };
    }
    return {};
  }
};
