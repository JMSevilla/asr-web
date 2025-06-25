import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { CloseAppButton, ContentButtonBlock, PrimaryButton } from '../..';
import { JourneyTypeSelection, JourneyTypes } from '../../../api/content/types/page';
import { FinancialAdviseResponse, SubmitFinancialAdviseParams } from '../../../api/mdp/types';
import { formatDate, normalizeDate, parseDate, zonedDate } from '../../../business/dates';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { useRouter } from '../../../core/router';
import { DateField, defaultDatePickerFormat } from '../../form';
import {
  FinancialAdviseFormType,
  financialAdviseFormSchema,
  maxFinancialAdviseDate,
  minFinancialAdviseDate,
} from './validation';

interface Props {
  id?: string;
  formKey: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  isCloseButtonHidden?: boolean;
  journeyType: JourneyTypeSelection;
}

export const FinancialAdviseFormBlock: React.FC<Props> = ({
  id,
  formKey,
  pageKey,
  parameters,
  isCloseButtonHidden,
  journeyType,
}) => {
  const router = useRouter();
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const saveAndExitButtonKey = findValueByKey('save_and_exit_button', parameters);
  const shouldUseGenericData = +(findValueByKey('version', parameters) || 0) >= 2;
  const stepData = useJourneyStepData<SubmitFinancialAdviseParams | FinancialAdviseResponse>({
    pageKey,
    formKey,
    journeyType,
    personType: 'financial_advice',
    preventFetch: !shouldUseGenericData,
  });
  const financialAdviseDate = useApi(async api => {
    if (shouldUseGenericData) return Promise.reject();
    if (journeyType === JourneyTypes.TRANSFER2) return await api.mdp.transferFinancialAdvice();
    return await api.mdp.financialAdvice();
  });
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const submitFinancialAdviseCb = useApiCallback((api, args: SubmitFinancialAdviseParams) =>
    journeyType === JourneyTypes.TRANSFER2
      ? api.mdp.transferFinancialAdviceSubmit(args)
      : api.mdp.submitFinancialAdvise(args),
  );

  const { labelByKey, tooltipByKey, buttonByKey } = useGlobalsContext();
  const { handleSubmit, control, reset, setFocus, clearErrors } = useForm<FinancialAdviseFormType>({
    mode: 'onChange',
    resolver: yupResolver(financialAdviseFormSchema),
    defaultValues: financialAdviseFormSchema.getDefault(),
  });
  const { isValid, isDirty, errors } = useFormState({ control });
  const infoTooltip = tooltipByKey(`${formKey}_tooltip`);
  const saveAndExitButton = saveAndExitButtonKey ? buttonByKey(saveAndExitButtonKey) : null;

  useFormFocusOnError<FinancialAdviseFormType>(errors, setFocus);

  useEffect(() => {
    if (shouldUseGenericData && stepData.values?.financialAdviseDate) {
      reset({
        financialAdviseDate: formatDate(zonedDate(stepData.values.financialAdviseDate), defaultDatePickerFormat),
      });
      return;
    }
    if (financialAdviseDate.result?.data.financialAdviseDate) {
      reset({
        financialAdviseDate: formatDate(
          zonedDate(financialAdviseDate.result.data.financialAdviseDate),
          defaultDatePickerFormat,
        ),
      });
      return;
    }
    reset({ financialAdviseDate: null });
  }, [
    financialAdviseDate.result?.data.financialAdviseDate,
    stepData.values?.financialAdviseDate,
    shouldUseGenericData,
  ]);

  return (
    <Grid id={id} container spacing={12}>
      <Grid item xs={12} lg={6}>
        <form data-testid="financial-advise-form">
          <DateField
            placeholder={labelByKey(`${formKey}_date_ghost`)}
            isLoading={financialAdviseDate.loading}
            name="financialAdviseDate"
            control={control}
            label={labelByKey(`${formKey}_date_label`)}
            maxDate={maxFinancialAdviseDate}
            minDate={minFinancialAdviseDate}
            tooltip={infoTooltip}
            onBlur={() => clearErrors()}
            returnRawValue
          />
        </form>
      </Grid>
      <Grid item xs={12} mt={8} container spacing={4}>
        <Grid item>
          <PrimaryButton
            onClick={handleSubmit(onContinue)}
            disabled={!isValid}
            loading={submitStepCb.loading || submitFinancialAdviseCb.loading || router.loading}
            data-testid="continue"
          >
            {labelByKey('continue')}
          </PrimaryButton>
        </Grid>
        {saveAndExitButton ? (
          <Grid item>
            <ContentButtonBlock {...saveAndExitButton} disabled={isDirty} />
          </Grid>
        ) : !isCloseButtonHidden ? (
          <Grid item>
            <CloseAppButton disabled={isDirty} />
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );

  async function onContinue(values: FinancialAdviseFormType) {
    if (!nextPageKey) {
      return;
    }

    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });

    if (!isDirty) {
      await journeyNavigation.goNext();
      return;
    }

    const financialAdviseDate = normalizeDate(parseDate(values.financialAdviseDate!, defaultDatePickerFormat)!);
    if (shouldUseGenericData && journeyType) {
      await stepData.save({ financialAdviseDate });
    } else {
      await submitFinancialAdviseCb.execute({ financialAdviseDate });
    }
    await journeyNavigation.goNext();
  }
};
