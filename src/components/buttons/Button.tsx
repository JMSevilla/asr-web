import { CircularProgress, Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import React, { forwardRef } from 'react';
import { ButtonType } from '../../api/content/types/common';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { usePopupContext } from '../../core/contexts/PopupContextProvider';
import { useTenantContext } from '../../core/contexts/TenantContext';
import { trackButtonClick } from '../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../core/mixpanel-tracker';
import { Tooltip } from '../Tooltip';
import { useCustomAction } from './hooks/useCustomAction';
import { usePostRequest } from './hooks/usePostRequest';

export interface ButtonProps
  extends Pick<
    MuiButtonProps,
    | 'className'
    | 'children'
    | 'fullWidth'
    | 'onClick'
    | 'sx'
    | 'onFocusVisible'
    | 'tabIndex'
    | 'variant'
    | 'role'
    | 'onKeyDown'
  > {
  width?: number | string;
  id?: string;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  type?: ButtonType;
  buttonActionType?: MuiButtonProps['type'];
  text?: string;
  pageKey?: string;
  linkKey?: string;
  journeyType?: JourneyTypeSelection;
  customActionKey?: string;
  notification?: string;
  disabledReason?: string;
  widthPercentage?: number;
  analyticsKey?: string;
  'data-testid'?: string;
  postRequestUrl?: string;
}

const LOADER_SIZE = 26;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      text,
      loading,
      disabled,
      className,
      width,
      fullWidth,
      sx,
      id,
      type,
      variant,
      linkKey,
      pageKey,
      customActionKey,
      disabledReason,
      notification,
      analyticsKey,
      journeyType,
      onClick,
      href,
      postRequestUrl,
      buttonActionType,
      ...props
    },
    ref,
  ) => {
    const popup = usePopupContext();
    const { tenant } = useTenantContext();
    const { labelByKey } = useGlobalsContext();
    const action = useCustomAction({
      actionKey: customActionKey,
      linkKey,
      pageKey,
      journeyType,
      shouldNavigate: !onClick,
    });
    const postRequest = usePostRequest({ url: postRequestUrl });
    const isLoading = loading || action?.loading || postRequest?.loading;
    const isDisabled = disabled || action?.disabled;
    const isDisabledOrLoading = isLoading || isDisabled;
    const disabledReasonId = `disabledReason-${Math.random().toString(36).substring(2, 15)}`;
    const role = !href ? { role: 'button' } : {};
    const increasedAccessibility = tenant?.increasedAccessibility?.value;
    const button = (
      <>
        <MuiButton
          ref={ref}
          id={id}
          data-testid={props['data-testid'] || id}
          custom-action-key={customActionKey}
          analytics-key={analyticsKey}
          className={[className, type, isLoading ? 'loading' : null, isDisabled ? 'disabled' : null]
            .filter(Boolean)
            .join(' ')}
          sx={{
            position: 'relative',
            width: fullWidth ? '100%' : width,
            minWidth: 140,
            height: 'fit-content',
            borderRadius: 0,
            fontWeight: increasedAccessibility ? 'accessibleText.fontWeight' : 'unset',
            fontSize: increasedAccessibility ? 'accessibleText.fontSize' : 'body1',
            '& #loader': {
              position: 'absolute',
              left: `calc(50% - ${LOADER_SIZE / 2}px)`,
              top: `calc(50% - ${LOADER_SIZE / 2}px)`,
            },
            ...sx,
          }}
          fullWidth={fullWidth}
          disabled={false}
          aria-label={text} // TODO: will be changed with ariaLabel prop from CMS
          aria-disabled={isDisabledOrLoading}
          disableRipple={isDisabledOrLoading}
          aria-describedby={disabledReasonId}
          variant={variantFromType(type)}
          onClick={handleClick}
          href={href}
          type={buttonActionType}
          {...role}
          {...props}
        >
          {children || text}
          {isLoading && (
            <CircularProgress
              size={LOADER_SIZE}
              id="loader"
              aria-live="assertive"
              data-loading-msg={labelByKey('button_loading_message')}
            />
          )}
        </MuiButton>
        {action?.node}
      </>
    );

    if (disabledReason && isDisabled) {
      return (
        <Tooltip html={disabledReason} disabledReasonId={disabledReasonId} forDisabledReason>
          {button}
        </Tooltip>
      );
    }

    return button;

    async function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      if (
        (e.target as HTMLAnchorElement).href?.startsWith('mailto:') ||
        (e.target as HTMLAnchorElement).href?.startsWith('tel:')
      ) {
        e.preventDefault();
        window.open((e.target as HTMLAnchorElement).href);
        return;
      }

      if (isDisabledOrLoading) {
        e.preventDefault();
        return;
      }

      if (analyticsKey) {
        trackButtonClick(analyticsKey);
        mixpanelTrackButtonClick({
          Category: analyticsKey,
        });
      }

      if (postRequestUrl && postRequest?.execute) {
        e.preventDefault();
        notification && popup.show(notification);
        await postRequest.execute();
      }

      if (action?.execute || onClick) {
        e.preventDefault();
        notification && popup.show(notification);
        action && (await action.execute());
        !action?.disableFurtherActions && onClick && onClick(e);
      }
    }
  },
);

const variantFromType = (type: ButtonProps['type']): MuiButtonProps['variant'] => {
  switch (type) {
    case 'Secondary':
    case 'SecondaryDarkBG':
      return 'outlined';
    case 'Primary':
    case 'PrimaryDarkBG':
    case 'Critical':
    case 'Success':
    default:
      return 'contained';
  }
};
