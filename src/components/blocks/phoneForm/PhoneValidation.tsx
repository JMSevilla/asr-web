import { Grid, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { PrimaryButton } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { PinInput } from '../../form';
import { PhoneValidationHeaderIcon } from './PhoneValidationHeaderIcon';

interface Props {
  id?: string;
  enabled: boolean;
  defaultPhone?: string;
  defaultPhoneCode?: string;
  isCloseButtonHidden: boolean;
  submitLoading: boolean;
  phone: string;
  expiredToken: boolean;
  isCodeResent: boolean;
  phoneCode: string;
  onExpiredTokenClick: () => void;
  onDefaultPhoneClick: () => void;
  onContinue: () => void;
  onBackClick: () => void;
  onTokenChange: (token: string) => void;
  onTokenCompleted: (token: string) => void;
}

export const PhoneValidation: React.FC<Props> = ({
  id,
  onContinue,
  phone = '',
  onBackClick,
  onTokenChange,
  onTokenCompleted,
  enabled,
  defaultPhone,
  defaultPhoneCode,
  onDefaultPhoneClick,
  submitLoading,
  expiredToken,
  isCodeResent,
  onExpiredTokenClick,
  phoneCode,
}) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();
  const elem = useRef();
  const { setCustomHeader } = useJourneyIndicatorContext();

  useEffect(() => {
    setCustomHeader({
      title: isCodeResent
        ? labelByKey('phone_confirmation_form_confirm_header_expired')
        : labelByKey('phone_confirmation_form_confirm_header'),
      action: onBackClick,
      icon: PhoneValidationHeaderIcon,
    });
  }, [isCodeResent]);

  return (
    <Grid id={id} container spacing={8}>
      <Grid item xs={12} container>
        <Typography variant="body1" component="div">
          {labelByKey(`phone_confirmation_form_confirm_subheader`)}
        </Typography>
        &nbsp;
        <Typography variant="body1" fontWeight="bold">
          {phoneCode + phone}.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          {htmlByKey(`phone_confirmation_form_confirm_description`)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <PinInput
          length={6}
          onChange={onTokenChange}
          onComplete={onTokenCompleted}
          ref={elem}
          ariaLabel={labelByKey('phone_pin_input_label')}
        />
      </Grid>
      {defaultPhone && (
        <Grid item xs={12} my={8}>
          <Typography
            data-testid="phone-form-revert"
            variant="body1"
            component="a"
            tabIndex={0}
            sx={{ '&:hover': { cursor: 'pointer' } }}
            onClick={onDefaultPhoneClick}
            onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && onDefaultPhoneClick()}
          >
            {`${labelByKey('phone_confirmation_form_revert_back')}  ${defaultPhoneCode + defaultPhone}`}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} container spacing={4}>
        <Grid item>
          {expiredToken ? (
            <PrimaryButton onClick={handleTokenResend}>
              {labelByKey('phone_confirmation_form_resend_token')}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={onContinue} disabled={!enabled || submitLoading} data-testid="phone-form-continue">
              {labelByKey('continue')}
            </PrimaryButton>
          )}
        </Grid>
      </Grid>
    </Grid>
  );

  function handleTokenResend() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    elem?.current?.retry();
    onExpiredTokenClick();
  }
};
