import { Box } from '@mui/material';
import React from 'react';

import { ListLoader } from '../../..';
import { useContactPreferencesDisabledFields, useContactPreferencesValues } from '../hooks';
import { SubscriptionPreferencesForm } from './SubscriptionPreferencesForm';

interface Props {
  id?: string;
}

export const SubscriptionPreferencesBlock: React.FC<Props> = ({ id }) => {
  const preferences = useContactPreferencesValues();
  const disabledFields = useContactPreferencesDisabledFields();

  if (preferences.loading || disabledFields.loading) {
    return <ListLoader id={id} loadersCount={1} />;
  }

  return (
    <Box id={id} data-testid="subscription-preferences-form-block">
      <SubscriptionPreferencesForm
        prefix={id}
        initialPreferences={preferences!.result!.data}
        disabledFields={disabledFields.fields}
      />
    </Box>
  );
};
