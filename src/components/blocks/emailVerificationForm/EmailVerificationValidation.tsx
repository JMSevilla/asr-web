import { Grid, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import ExternalPinInput from 'react-pin-input';
import { PrimaryButton } from '../..';
import { PanelListItem } from '../../../api/content/types/page';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { PinInput } from '../../form';
import { Tooltip } from '../../Tooltip';
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
  panelList?: PanelListItem[];
}

export const EmailVerificationValidation: React.FC<Props> = ({
  id,
  onContinue,
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
  panelList,
}) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const { panelByKey } = usePanelBlock(panelList);

  const { setCustomHeader } = useJourneyIndicatorContext();
  const elem = useRef<ExternalPinInput>();

  useEffect(() => {
    setCustomHeader({
      title: isCodeResent
        ? labelByKey('email_verification_form_confirm_header_expired')
        : labelByKey('email_verification_form_confirm_header'),
      action: onBackClick,
      icon: EmailValidationHeaderIcon,
    });
  }, [isCodeResent]);

  const [panel1, panel2] = [panelByKey('email_verification_form_panel3'), panelByKey('email_verification_form_panel4')];
  const tooltip = tooltipByKey('email_verification_form_confirm_tooltip');

  return (
    <Grid id={id} container spacing={12} data-testid="email_verification_form">
      {panel1 && (
        <Grid item xs={12}>
          {panel1}
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {labelByKey('email_verification_form_pin_input_label')}
          </Grid>
          <Grid item xs={12} ml={{ xs: '-8px', md: '-12px' }}>
            <PinInput
              length={6}
              onChange={onTokenChange}
              onComplete={onTokenCompleted}
              ref={elem}
              ariaLabel={labelByKey('email_verification_form_pin_input_label')}
            />
          </Grid>
          <Grid item xs={12}>
            <Tooltip header={tooltip?.header} html={tooltip?.html} underlinedText>
              {tooltip?.text}
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      {defaultEmail && (
        <Grid item xs={12}>
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
            {`${labelByKey('email_verification_form_revert_back')}  ${defaultEmail}`}
          </Typography>
        </Grid>
      )}
      {panel2 && (
        <Grid item xs={12}>
          {panel2}
        </Grid>
      )}
      <Grid item xs={12}>
        {expiredToken ? (
          <PrimaryButton data-testid="expired-token-button" onClick={handleTokenResend}>
            {labelByKey('email_verification_form_resend_token')}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={onContinue}
            disabled={!enabled || submitLoading}
            data-testid="email-validation-continue"
          >
            {labelByKey('email_verification_form_continue')}
          </PrimaryButton>
        )}
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
