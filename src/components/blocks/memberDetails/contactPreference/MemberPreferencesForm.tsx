import { CircularProgress, Divider, Grid, ListItem as MuiListItem, Typography } from '@mui/material';

import { SubmitContactPreferenceParams, TypeToUpdate } from '../../../../api/mdp/types';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { CheckboxField } from '../../../form';
import { constructContactPreferencesMessageKey, useContactPreferencesForm } from '../hooks';

interface Props {
  text: string;
  description: string;
  initialPreferences: { email: boolean; sms: boolean; post: boolean };
  disabledFields: boolean[];
}
export function MemberPreferencesForm({ text, description, initialPreferences, disabledFields }: Props) {
  const submitPreferenceCb = useApiCallback((api, p: SubmitContactPreferenceParams) =>
    api.mdp.submitMemberContactPreference(p),
  );
  const { labelByKey, messageByKey } = useGlobalsContext();
  const { control, watch, handleFormChange } = useContactPreferencesForm(initialPreferences);
  const [disabledEmail, disabledPhone, disabledPost] = disabledFields;
  const watchPost = watch('post');
  const disabledKey = constructContactPreferencesMessageKey(disabledEmail, disabledPhone, disabledPost);

  return (
    <>
      <Divider />
      {disabledKey && <Grid mt={4}>{messageByKey(disabledKey)}</Grid>}
      <form onChange={handleChange} data-testid="my_details_comm_pref-form">
        <MuiListItem tabIndex={0} sx={{ py: 6, justifyContent: 'space-between' }}>
          <Grid container>
            <Grid item xs={6}>
              <Typography mr={2} flex={1}>
                {text}
              </Typography>
              <Typography variant="caption" mr={2} flex={1}>
                {description}
              </Typography>
            </Grid>
            <Grid item xs={6} container position="relative">
              <Grid item xs={12} lg={4} sx={{ mb: { xs: 4, lg: 0 } }}>
                <CheckboxField
                  disabled={disabledEmail || submitPreferenceCb.loading}
                  control={control}
                  name="email"
                  label={labelByKey('my_details_comm_pref_email')}
                />
              </Grid>
              <Grid item xs={12} lg={4} sx={{ mb: { xs: 4, lg: 0 } }}>
                <CheckboxField
                  disabled={disabledPhone || submitPreferenceCb.loading}
                  control={control}
                  name="sms"
                  label={labelByKey('my_details_comm_pref_sms')}
                />
              </Grid>
              <Grid item xs={12} lg={4} sx={{ mb: { xs: 4, lg: 0 } }}>
                <CheckboxField
                  disabled={disabledPost || submitPreferenceCb.loading}
                  control={control}
                  name="post"
                  label={labelByKey('my_details_comm_pref_post')}
                />
              </Grid>
              {submitPreferenceCb.loading && (
                <Grid
                  item
                  xs={12}
                  sm={3}
                  sx={{ pl: { xs: 8, sm: 0 }, right: '-8px' }}
                  display="flex"
                  position="absolute"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <CircularProgress id="loader" aria-live="assertive" />
                </Grid>
              )}
            </Grid>
          </Grid>
        </MuiListItem>
        {watchPost && <Grid>{messageByKey('my_details_comm_pref_info_message')}</Grid>}
      </form>
    </>
  );

  function handleChange(e: React.FormEvent<HTMLFormElement>) {
    const { name } = e.target as HTMLButtonElement;

    handleFormChange(name);
    submitPreferenceCb.execute({
      ...watch(),
      typeToUpdate: name === 'post' ? TypeToUpdate.Post : name === 'email' ? TypeToUpdate.Email : TypeToUpdate.Sms,
    });
  }
}
