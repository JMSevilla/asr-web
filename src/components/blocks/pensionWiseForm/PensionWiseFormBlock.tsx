import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { CloseAppButton, ContentButtonBlock, PrimaryButton } from '../..';
import { JourneyTypeSelection, JourneyTypes } from '../../../api/content/types/page';
import { PensionWiseResponse, SubmitPensionWiseParams } from '../../../api/mdp/types';
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
import { PensionWiseFormType, maxPensionWiseDate, minPensionWiseDate, pensionWiseFormSchema } from './validation';

interface Props {
  id?: string;
  formKey: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  isCloseButtonHidden?: boolean;
  journeyType: JourneyTypeSelection;
}

export const PensionWiseFormBlock: React.FC<Props> = ({
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
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const submitPensionWiseCb = useApiCallback((api, args: SubmitPensionWiseParams) =>
    journeyType === JourneyTypes.TRANSFER2 ? api.mdp.transferPensionWiseSubmit(args) : api.mdp.submitPensionWise(args),
  );
  const shouldUseGenericData = +(findValueByKey('version', parameters) || 0) >= 2;
  const stepData = useJourneyStepData<SubmitPensionWiseParams | PensionWiseResponse>({
    pageKey,
    formKey,
    journeyType,
    personType: 'pension_wise',
    preventFetch: !shouldUseGenericData,
  });
  const pensionWiseDate = useApi(async api => {
    if (shouldUseGenericData) return Promise.reject();
    if (journeyType === JourneyTypes.TRANSFER2) return await api.mdp.transferPensionWise();
    return await api.mdp.pensionWise();
  });
  const { labelByKey, tooltipByKey, buttonByKey } = useGlobalsContext();
  const { handleSubmit, control, reset, setFocus, clearErrors } = useForm<PensionWiseFormType>({
    mode: 'onChange',
    resolver: yupResolver(pensionWiseFormSchema),
    defaultValues: pensionWiseFormSchema.getDefault(),
  });
  const { isValid, isDirty, errors } = useFormState({ control });

  const infoTooltip = tooltipByKey(`${formKey}_tooltip`);
  const saveAndExitButton = saveAndExitButtonKey ? buttonByKey(saveAndExitButtonKey) : null;

  useFormFocusOnError<PensionWiseFormType>(errors, setFocus);

  useEffect(() => {
    if (shouldUseGenericData && stepData.values?.pensionWiseDate) {
      reset({ pensionWiseDate: formatDate(zonedDate(stepData.values?.pensionWiseDate), defaultDatePickerFormat) });
      return;
    }
    if (pensionWiseDate.result?.data.pensionWiseDate) {
      reset({
        pensionWiseDate: formatDate(zonedDate(pensionWiseDate.result?.data.pensionWiseDate), defaultDatePickerFormat),
      });
      return;
    }
    reset({ pensionWiseDate: null });
  }, [pensionWiseDate.result?.data.pensionWiseDate, stepData.values?.pensionWiseDate, shouldUseGenericData]);

  return (
    <Grid id={id} container spacing={12}>
      <Grid item xs={12} lg={6}>
        <form data-testid="pension-wise-form">
          <DateField
            placeholder={labelByKey(`${formKey}_date_ghost`)}
            isLoading={pensionWiseDate.loading}
            name="pensionWiseDate"
            control={control}
            label={labelByKey(`${formKey}_date_label`)}
            maxDate={maxPensionWiseDate}
            minDate={minPensionWiseDate}
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
            loading={
              submitStepCb.loading ||
              submitPensionWiseCb.loading ||
              journeyNavigation.loading ||
              router.loading ||
              router.parsing
            }
            data-testid="continue"
          >
            {labelByKey('continue')}
          </PrimaryButton>
        </Grid>
        {saveAndExitButton && (
          <Grid item>
            <ContentButtonBlock {...saveAndExitButton} disabled={isDirty} />
          </Grid>
        )}
        {!isCloseButtonHidden && !saveAndExitButton && (
          <Grid item>
            <CloseAppButton disabled={isDirty} />
          </Grid>
        )}
      </Grid>
    </Grid>
  );

  async function onContinue(values: PensionWiseFormType) {
    if (!nextPageKey) {
      return;
    }

    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });

    if (!isDirty) {
      await journeyNavigation.goNext();
      return;
    }

    const pensionWiseDate = normalizeDate(parseDate(values.pensionWiseDate!, defaultDatePickerFormat)!);
    if (shouldUseGenericData && journeyType) {
      await stepData.save({ pensionWiseDate });
    } else {
      await submitPensionWiseCb.execute({ pensionWiseDate });
    }
    await journeyNavigation.goNext();
  }
};
