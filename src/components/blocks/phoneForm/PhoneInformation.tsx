import { Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { PrimaryButton } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { CheckedMark } from '../../icons';

interface Props {
  id?: string;
  submitLoading: boolean;
  phone: string;
  phoneCode: string;
  onContinue: () => void;
  onBackClick: () => void;
}

export const PhoneInformation: React.FC<Props> = ({
  id,
  onContinue,
  phone = '',
  onBackClick,
  submitLoading,
  phoneCode,
}) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();
  const { setCustomHeader } = useJourneyIndicatorContext();

  useEffect(() => {
    setCustomHeader({
      title: labelByKey('phone_confirmation_form_information_header'),
      action: onBackClick,
      icon: CheckedMark as React.FC,
    });
  }, []);

  return (
    <Grid id={id} container spacing={8}>
      <Grid item xs={12} container>
        <Typography variant="body1" fontWeight="bold">
          {phoneCode + phone}
        </Typography>
        &nbsp;
        <Typography variant="body1" component="div">
          {labelByKey(`phone_confirmation_form_information_subheader`)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          {htmlByKey(`phone_confirmation_form_information_body`)}
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={4}>
        <Grid item>
          <PrimaryButton onClick={onContinue} disabled={submitLoading} data-testid="phone-form-continue">
            {labelByKey('continue')}
          </PrimaryButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
