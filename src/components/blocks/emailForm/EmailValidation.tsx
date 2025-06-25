import { Grid, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import ExternalPinInput from 'react-pin-input';
import { PrimaryButton } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { PinInput } from '../../form';
import { EmailValidationHeaderIcon } from './EmailValidationHeaderIcon';

interface Props {
  id?: string;
  enabled: boolean;
  defaultEmail?: string;
  isCloseButtonHidden: boolean;
  submitLoading: boolean;
  email: string;
  expiredToken: boolean;
  isCodeResent: boolean;
  onDefaultEmailClick: () => void;
  onContinue: () => void;
  onBackClick: () => void;
  onTokenChange: (token: string) => void;
  onTokenCompleted: (token: string) => void;
  onExpiredTokenClick: () => void;
}

export const EmailValidation: React.FC<Props> = ({
  id,
  onContinue,
  email = '',
  onBackClick,
  onTokenChange,
  onTokenCompleted,
  enabled,
  defaultEmail,
  onDefaultEmailClick,
  submitLoading,
  expiredToken,
  isCodeResent,
  onExpiredTokenClick,
}) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();
  const elem = useRef<ExternalPinInput>();
  const { setCustomHeader } = useJourneyIndicatorContext();

  useEffect(() => {
    setCustomHeader({
      title: isCodeResent
        ? labelByKey('email_confirmation_form_confirm_header_expired')
        : labelByKey('email_confirmation_form_confirm_header'),
      action: onBackClick,
      icon: EmailValidationHeaderIcon,
    });
  }, [isCodeResent]);

  return (
    <Grid id={id} container spacing={8}>
      <Grid item xs={12} container>
        <Typography variant="body1" component="div">
          {labelByKey(`email_confirmation_form_confirm_subheader`)}
        </Typography>
        &nbsp;
        <Typography variant="body1" fontWeight="bold" noWrap>
          {email}.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          {htmlByKey(`email_confirmation_form_confirm_description`)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <PinInput
          length={6}
          onChange={onTokenChange}
          onComplete={onTokenCompleted}
          ref={elem}
          ariaLabel={labelByKey('email_pin_input_label')}
        />
      </Grid>
      {defaultEmail && (
        <Grid item xs={12} my={8}>
          <Typography
            variant="body1"
            component="a"
            tabIndex={0}
            data-testid="email-form-revert"
            sx={{ display: 'block', '&:hover': { cursor: 'pointer' } }}
            onClick={onDefaultEmailClick}
            onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && onDefaultEmailClick()}
            noWrap
          >
            {`${labelByKey('email_confirmation_form_revert_back')}  ${defaultEmail}`}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} container spacing={4}>
        <Grid item>
          {expiredToken ? (
            <PrimaryButton onClick={handleTokenResend}>
              {labelByKey('email_confirmation_form_resend_token')}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={onContinue}
              disabled={!enabled || submitLoading}
              data-testid="email-validation-continue"
            >
              {labelByKey('continue')}
            </PrimaryButton>
          )}
        </Grid>
      </Grid>
    </Grid>
  );

  function handleTokenResend() {
    // wrong types inside lib
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    elem?.current?.retry();
    onExpiredTokenClick();
  }
};
