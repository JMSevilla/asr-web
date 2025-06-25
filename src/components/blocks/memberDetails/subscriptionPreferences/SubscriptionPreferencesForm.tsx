import { Grid, Stack } from '@mui/material';
import { SubmitContactPreferenceParams, TypeToUpdate } from '../../../../api/mdp/types';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useFormSubmissionBindingHooks } from '../../../../core/hooks/useFormSubmissionBindingHooks';
import { CheckboxField } from '../../../form';
import { constructContactPreferencesMessageKey, useContactPreferencesForm } from '../hooks';

interface Props {
  prefix?: string;
  initialPreferences: { email: boolean; sms: boolean; post: boolean };
  disabledFields: boolean[];
}
export function SubscriptionPreferencesForm({ prefix, initialPreferences, disabledFields }: Props) {
  const submitPreferenceCb = useApiCallback((api, p: SubmitContactPreferenceParams) =>
    api.mdp.submitMemberContactPreference(p),
  );
  const { labelByKey, messageByKey } = useGlobalsContext();
  const { control, watch, formState, handleFormChange } = useContactPreferencesForm(initialPreferences);
  const [disabledEmail, disabledPhone, disabledPost] = disabledFields;
  const disabledKey = constructContactPreferencesMessageKey(disabledEmail, disabledPhone, disabledPost);
  const key = `${prefix}_form`;
  const postValue = watch('post');
  const postEmailMessage = messageByKey('subscription_preferences_form_info_message_email_sms')

  useFormSubmissionBindingHooks({ key, isValid: formState.isValid, isDirty: formState.isDirty, cb: () => onSubmit() });

  return (
    <>
      {disabledKey && <Grid>{messageByKey(disabledKey)}</Grid>}
      <Stack component="form" onChange={handleChange} data-testid={key} gap={4}>
        <CheckboxField
          disabled={disabledEmail}
          control={control}
          name="email"
          label={labelByKey('my_details_comm_pref_email')}
        />
        <CheckboxField
          disabled={disabledPhone}
          control={control}
          name="sms"
          label={labelByKey('my_details_comm_pref_sms')}
        />
        <CheckboxField
          disabled={disabledPost}
          control={control}
          name="post"
          label={labelByKey('my_details_comm_pref_post')}
        />
        {postValue && <Grid>{messageByKey('subscription_preferences_form_info_message')}</Grid>}
        {!postValue && typeof postEmailMessage !== 'string' && <Grid>{postEmailMessage}</Grid>}
      </Stack>
    </>
  );

  async function onSubmit() {
    const { email, sms, post } = watch();

    await submitPreferenceCb.execute({
      email,
      sms,
      post,
      typeToUpdate: post ? TypeToUpdate.Post : email ? TypeToUpdate.Email : TypeToUpdate.Sms,
    });
  }

  function handleChange(e: React.FormEvent<HTMLFormElement>) {
    const { name } = e.target as HTMLButtonElement;
    handleFormChange(name);
  }
}
