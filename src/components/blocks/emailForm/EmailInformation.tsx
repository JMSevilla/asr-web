import { Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { PrimaryButton } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { CheckedMark } from '../../icons';

interface Props {
  id?: string;
  submitLoading: boolean;
  email: string;
  onContinue: () => void;
  onBackClick: () => void;
}

export const EmailInformation: React.FC<Props> = ({ id, onContinue, email = '', onBackClick, submitLoading }) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();
  const { setCustomHeader } = useJourneyIndicatorContext();

  useEffect(() => {
    setCustomHeader({
      title: labelByKey('email_confirmation_form_information_header'),
      action: onBackClick,
      icon: CheckedMark as React.FC,
    });
  }, []);

  return (
    <Grid id={id} container spacing={8}>
      <Grid item xs={12} container>
        <Typography variant="body1" fontWeight="bold" noWrap>
          {email}
        </Typography>
        &nbsp;
        <Typography variant="body1" component="div">
          {labelByKey(`email_confirmation_form_information_subheader`)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          {htmlByKey(`email_confirmation_form_information_body`)}
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={4}>
        <Grid item>
          <PrimaryButton onClick={onContinue} disabled={submitLoading} data-testid="email-information-continue">
            {labelByKey('continue')}
          </PrimaryButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
