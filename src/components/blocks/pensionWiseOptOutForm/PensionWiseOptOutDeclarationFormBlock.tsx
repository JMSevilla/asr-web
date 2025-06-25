import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ContentButtonBlock } from '../..';
import { SubmitOptOutPensionWiseParams, SubmitStepParams } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';
import { PrimaryButton } from '../../buttons';
import { CloseAppButton } from '../../closeApp';
import { CheckboxField } from '../../form';
import { PensionWiseOptOutDeclarationFormType, PensionWiseOptOutDeclarationSchema } from './validation';

interface Props {
  id?: string;
  formKey: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
  isCloseButtonHidden?: boolean;
}

export const PensionWiseOptOutDeclarationFormBlock: React.FC<Props> = ({
  id,
  formKey,
  parameters,
  isCloseButtonHidden,
  pageKey,
}) => {
  const router = useRouter();
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const saveAndExitButtonKey = findValueByKey('save_and_exit_button', parameters);
  const submitStepCb = useApiCallback((api, args: SubmitStepParams) => api.mdp.submitJourneyStep(args));
  const submitPensionWiseCb = useApiCallback((api, args: SubmitOptOutPensionWiseParams) =>
    api.mdp.submitPensionWiseOptOut(args),
  );
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const { handleSubmit, control, reset, formState } = useForm<PensionWiseOptOutDeclarationFormType>({
    mode: 'onChange',
    resolver: yupResolver(PensionWiseOptOutDeclarationSchema),
    defaultValues: PensionWiseOptOutDeclarationSchema.getDefault(),
  });

  const pensionWiseOptOut = useApi(async api => {
    const result = await api.mdp.pensionWiseOptOut();
    reset({ optOutPensionWise: !!result.data.optOutPensionWise });
    return result;
  });

  const saveAndExitButton = saveAndExitButtonKey ? buttonByKey(saveAndExitButtonKey) : null;

  return (
    <Grid id={id} container spacing={12}>
      <Grid item lg={12}>
        <form data-testid="pension-wise-opt-out-declaration-form">
          <CheckboxField
            control={control}
            name="optOutPensionWise"
            disabled={formState.isSubmitting || pensionWiseOptOut.loading}
            label={labelByKey(`${formKey}_checkbox_label`)}
          />
        </form>
      </Grid>
      <Grid item xs={12} container spacing={4}>
        <Grid item>
          <PrimaryButton
            onClick={handleSubmit(onContinue)}
            disabled={!formState.isValid}
            loading={
              submitStepCb.loading ||
              submitPensionWiseCb.loading ||
              pensionWiseOptOut.loading ||
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
            <ContentButtonBlock {...saveAndExitButton} disabled={formState.isDirty} />
          </Grid>
        )}
        {!isCloseButtonHidden && !saveAndExitButton && (
          <Grid item>
            <CloseAppButton disabled={formState.isDirty} />
          </Grid>
        )}
      </Grid>
    </Grid>
  );

  async function onContinue(values: PensionWiseOptOutDeclarationFormType) {
    if (!nextPageKey) {
      return;
    }

    if (!formState.isDirty) {
      await router.parseUrlAndPush(nextPageKey);
      return;
    }

    await submitPensionWiseCb.execute({ optOutPensionWise: values.optOutPensionWise! });
    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    await router.parseUrlAndPush(nextPageKey);
  }
};
