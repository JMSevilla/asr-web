import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi } from '../../../core/hooks/useApi';
import { MessageType } from '../../topAlertMessages';
import { ContactPreferenceFormType, contactPreferencesFormSchema } from './validation';

export const useContactPreferencesValues = () => {
  const preferences = useApi(api => api.mdp.memberContactPreference());
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { errorByKey } = useGlobalsContext();

  useEffect(() => {
    const errors = preferences.error as string[] | undefined;

    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [preferences.error]);

  return preferences;
};

export const useContactPreferencesDisabledFields = () => {
  const emailResult = useApi(api => api.mdp.userEmail());
  const phoneResult = useApi(api => api.mdp.userPhone());
  const addressResult = useApi(api => api.mdp.userAddress());

  return {
    loading: emailResult.loading || phoneResult.loading || addressResult.loading,
    fields: [
      !emailResult?.result?.data.email,
      !phoneResult?.result?.data.number,
      !addressResult?.result?.data.streetAddress1,
    ],
  };
};

export const useContactPreferencesForm = (initialPreferences: { email: boolean; sms: boolean; post: boolean }) => {
  const form = useForm<ContactPreferenceFormType>({
    resolver: yupResolver(contactPreferencesFormSchema),
    mode: 'onChange',
    defaultValues: initialPreferences ?? contactPreferencesFormSchema.getDefault(),
    criteriaMode: 'all',
  });
  const handleFormChange = (name: string) => {
    switch (name) {
      case 'post': {
        form.setValue('post', true);
        form.setValue('email', false);
        form.setValue('sms', false);
        break;
      }
      case 'email': {
        const smsChecked = form.getValues('sms');
        !smsChecked && form.setValue('email', true);
        form.setValue('post', false);
        break;
      }
      case 'sms': {
        const emailChecked = form.getValues('email');
        !emailChecked && form.setValue('sms', true);
        form.setValue('post', false);
        break;
      }
    }
  };

  return {
    ...form,
    handleFormChange,
  };
};

export function constructContactPreferencesMessageKey(
  disabledEmail: boolean,
  disabledPhone: boolean,
  disabledPost: boolean,
) {
  const msg = 'my_details_comm_pref_disabled_info_message';

  if (disabledEmail && disabledPhone && disabledPost) return msg + '_email_phone_post';
  if (disabledEmail && disabledPhone) return msg + '_email_phone';
  if (disabledEmail && disabledPost) return msg + '_email_post';
  if (disabledPhone && disabledPost) return msg + '_phone_post';
  if (disabledEmail) return msg + '_email';
  if (disabledPhone) return msg + '_phone';
  if (disabledPost) return msg + '_post';

  return '';
}
