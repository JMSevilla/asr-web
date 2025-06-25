import { Box, Grid, List, Typography } from '@mui/material';
import React from 'react';

import { ListLoader } from '../../..';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useContactPreferencesDisabledFields, useContactPreferencesValues } from '../hooks';
import { MemberPreferencesForm } from './MemberPreferencesForm';

interface Props {
  id?: string;
}

export const MemberContactPreferenceBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey } = useGlobalsContext();
  const preferences = useContactPreferencesValues();
  const disabledFields = useContactPreferencesDisabledFields();

  if (preferences.loading || disabledFields.loading) {
    return <ListLoader id={id} loadersCount={1} />;
  }

  return (
    <Box id={id} mb={8}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" fontWeight="bold">
            {labelByKey('my_details_comm_pref')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List>
            <MemberPreferencesForm
              data-testid="my_details_comm_pref_ques"
              text={labelByKey('my_details_comm_pref_ques')}
              description={labelByKey('my_details_comm_pref_ques_desc')}
              initialPreferences={preferences!.result!.data}
              disabledFields={disabledFields.fields}
            />
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};
