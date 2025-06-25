import { yupResolver } from '@hookform/resolvers/yup';
import { ClickAwayListener } from '@mui/base';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NumberField, Tooltip } from '../..';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { LifetimeAllowanceResponse, SubmitLTAParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useFormFocusOnError } from '../../../core/hooks/useFormFocusOnError';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { useRouter } from '../../../core/router';
import { LTAPercentageFormType, ltaPercentageFormSchema } from './validation';

interface Props {
  id: string;
  formKey: string;
  pageKey: string;
  journeyType: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
  isCloseButtonHidden?: boolean;
}

export const LTAPercentageFormBlock: React.FC<Props> = ({ id, journeyType, formKey, pageKey, parameters }) => {
  const router = useRouter();
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const exitPageKey = findValueByKey('lta_exit_page', parameters) ?? '';
  const shouldUseGenericData = +(findValueByKey('version', parameters) || 0) >= 2;
  const cachedAccessKey = useCachedAccessKey();
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const infoTooltip = tooltipByKey(`${formKey}_info_tooltip`);
  const stepData = useJourneyStepData<LifetimeAllowanceResponse>({
    pageKey,
    formKey,
    journeyType,
    personType: 'percentage',
    preventFetch: !shouldUseGenericData,
  });
  const lifeTimeAllowance = useApi(async api => {
    if (shouldUseGenericData) return Promise.reject();
    return await api.mdp.lifetimeAllowance();
  });
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const submitLTACb = useApiCallback((api, args: SubmitLTAParams) => api.mdp.submitLifetimeAllowance(args));
  const { handleSubmit, control, reset, setFocus, clearErrors, formState } = useForm<LTAPercentageFormType>({
    mode: 'onChange',
    resolver: yupResolver(ltaPercentageFormSchema),
    defaultValues: ltaPercentageFormSchema.getDefault(),
  });

  useFormSubmissionBindingHooks({
    key: id,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    cb: () => handleSubmit(onContinue)(),
  });

  useFormFocusOnError<LTAPercentageFormType>(formState.errors, setFocus);

  useEffect(() => {
    if (shouldUseGenericData && stepData.values?.percentage) {
      reset({ percentage: stepData.values.percentage });
      return;
    }
    if (lifeTimeAllowance.result?.data.percentage) {
      reset({ percentage: lifeTimeAllowance.result.data.percentage });
      return;
    }
    reset({ ...ltaPercentageFormSchema.getDefault() });
  }, [lifeTimeAllowance.result?.data.percentage, stepData.values?.percentage, shouldUseGenericData]);

  return (
    <Stack gap={12} flexDirection="column" flexWrap="nowrap">
      <Stack
        gap={6}
        component="form"
        data-testid="lta-percentage-form"
        sx={{ '& .MuiOutlinedInput-root': { width: theme => theme.sizes.numberFieldWidth } }}
      >
        <ClickAwayListener onClickAway={() => clearErrors()}>
          <Box>
            <NumberField
              name="percentage"
              control={control}
              label={
                <>
                  {labelByKey(`${formKey}_percentage_used`)}{' '}
                  <Tooltip header={infoTooltip?.header} html={infoTooltip?.html} disabledClick />
                </>
              }
              onBlur={() => clearErrors()}
              decimalScale={2}
              placeholder="%"
              suffix="%"
              asStringValue={false}
            />
          </Box>
        </ClickAwayListener>
        {cachedAccessKey.data?.schemeType !== 'DC' && (
          <Typography
            component="a"
            color="primary"
            data-testid="exit"
            sx={{ textDecoration: 'underline', textUnderlineOffset: 6, cursor: 'pointer' }}
            onClick={onExit}
            onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && onExit()}
          >
            {labelByKey(`${formKey}_LTA_exit`)}
          </Typography>
        )}
      </Stack>
    </Stack>
  );

  async function onExit() {
    if (!exitPageKey) {
      return;
    }

    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey: exitPageKey });
    await router.parseUrlAndPush(exitPageKey);
  }

  async function onContinue(values: LTAPercentageFormType) {
    if (!nextPageKey) {
      return;
    }

    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });

    if (!formState.isDirty) {
      await router.parseUrlAndPush(nextPageKey);
      return;
    }

    if (shouldUseGenericData && journeyType) {
      await stepData.save({ percentage: values.percentage });
    } else {
      await submitLTACb.execute({ percentage: values.percentage });
    }

    await router.parseUrlAndPush(nextPageKey);
  }
};
