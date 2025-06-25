import { Box, LinkProps, SxProps, Theme } from '@mui/material';
import qs from 'query-string';
import React, { MouseEvent } from 'react';
import { Button, LinkButton } from '../';
import { ButtonType, DialogElement, FileValue } from '../../api/content/types/common';
import { JourneyTypeSelection, JourneyTypes } from '../../api/content/types/page';
import { SubmitStepParams } from '../../api/mdp/types';
import { getHrefLink } from '../../business/links';
import { openInNewTab, openInNewWindow } from '../../business/navigation';
import { useTenantContext } from '../../core/contexts/TenantContext';
import { useDialogContext } from '../../core/contexts/dialog/DialogContext';
import { usePersistentAppState } from '../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApi, useApiCallback } from '../../core/hooks/useApi';
import { useResolution } from '../../core/hooks/useResolution';
import { useRouter } from '../../core/router';
import { ContentButtonText } from './ContentButtonText';

interface Props {
  id?: string;
  linkKey?: string;
  link?: string;
  anchor?: string;
  type?: ButtonType;
  text?: string | React.ReactNode;
  pageKey?: string;
  disabled?: boolean;
  disabledReason?: string;
  customActionKey?: string;
  queryParams?: { [key: string]: string };
  reuseUrlParameters?: boolean;
  openInTheNewTab?: boolean;
  icon?: FileValue;
  iconName?: string;
  rightSideIcon?: boolean;
  widthPercentage?: number;
  notification?: string;
  journeyType?: JourneyTypeSelection;
  dialogElement?: DialogElement;
  analyticsKey?: string;
  fileUrl?: string;
  loading?: boolean;
  linkFontSize?: LinkProps['fontSize'];
  postRequestUrl?: string;
  largeIcon?: boolean;
  onAsyncCallback?(): Promise<void>;
  buttonRef?: React.RefObject<HTMLAnchorElement | HTMLButtonElement>;
  sxProps?: SxProps<Theme>;
  customActionParams?: string;
}

export const ContentButtonBlock: React.FC<Props> = ({
  id,
  icon,
  iconName,
  rightSideIcon,
  anchor,
  type,
  text,
  link,
  linkKey,
  pageKey,
  disabled,
  disabledReason,
  customActionKey,
  customActionParams,
  journeyType,
  queryParams,
  notification,
  dialogElement,
  widthPercentage,
  openInTheNewTab,
  analyticsKey,
  reuseUrlParameters,
  fileUrl,
  loading,
  linkFontSize,
  postRequestUrl,
  largeIcon,
  onAsyncCallback,
  buttonRef,
  sxProps,
}) => {
  const router = useRouter();
  const { fastForward } = usePersistentAppState();
  const { tenant } = useTenantContext();
  const { isMobile } = useResolution();
  const tenantUrl = tenant?.tenantUrl.value.split('/')?.[1];
  const dialog = useDialogContext();
  const parsedUrl = useApi(api => (linkKey ? api.content.urlFromKey(linkKey) : Promise.reject()), [linkKey]);
  const submitRAStepCb = useApiCallback((api, p: SubmitStepParams) => api.mdp.submitJourneyStep(p));
  const submitTransferStepCb = useApiCallback((api, p: SubmitStepParams) => api.mdp.transferJourneySubmitStep(p));
  const submitBereavementStepCb = useApiCallback((api, p: SubmitStepParams) => api.mdp.bereavementJourneySubmitStep(p));
  const submitQSStepCb = useApiCallback(async (api, p: SubmitStepParams) => {
    const result = await api.mdp.quoteSelectionJourneySelections();
    return await api.mdp.quoteSelectionJourneySubmitStep({ ...p, selectedQuoteName: result.data.selectedQuoteName });
  });
  const width = widthPercentage ? `${widthPercentage}%` : isMobile ? ' 100%' : 'unset';
  const href = (tenantUrl ? '/' + tenantUrl : '') + (parsedUrl.result?.data.url || getHrefLink(link) || link) + anchor;
  const hrefProp = fileUrl || (href !== 'undefined' && href) ? { href: fileUrl || href } : {};

  if (type === 'Link') {
    const hasIcon = !!iconName || !!icon?.renditions?.default?.url || !!icon?.url;

    return (
      <LinkButton
        id={id}
        linkRef={buttonRef as React.RefObject<HTMLAnchorElement>}
        data-testid="content-button-block"
        width={width}
        variant="body1"
        disabled={disabled}
        customActionKey={customActionKey}
        customActionParams={customActionParams}
        href={fileUrl || href}
        onClick={onLinkClick}
        sx={hasIcon ? { display: 'inline-flex', alignItems: 'center', ...sxProps } : { ...sxProps }}
        notification={notification}
        linkKey={linkKey}
        pageKey={pageKey}
        journeyType={journeyType}
        fontSize={linkFontSize}
        text={
          <ContentButtonText
            text={text}
            icon={icon}
            iconName={iconName}
            isRightSided={rightSideIcon}
            isLargeIcon={largeIcon}
          />
        }
      />
    );
  }

  if (type === 'ButtonWithIcon') {
    const hasIcon = !!iconName || !!icon?.renditions?.default?.url || !!icon?.url;

    return (
      <Box display="flex" sx={hasIcon ? { display: 'inline-flex', alignItems: 'center', ...sxProps } : { ...sxProps }}>
        <LinkButton
          id={id}
          linkRef={buttonRef as React.RefObject<HTMLAnchorElement>}
          data-testid="content-button-block"
          width={width}
          variant="body1"
          disabled={disabled}
          customActionKey={customActionKey}
          customActionParams={customActionParams}
          href={fileUrl || href}
          onClick={onLinkClick}
          notification={notification}
          linkKey={linkKey}
          pageKey={pageKey}
          journeyType={journeyType}
          fontSize={linkFontSize}
          sx={{
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'none',
            },
          }}
          text={text}
        />
        <ContentButtonText
          icon={icon}
          iconName={iconName}
          isRightSided={rightSideIcon}
          isLargeIcon={largeIcon}
          isButtonWithIcon
          onClick={onLinkClick}
        />
      </Box>
    );
  }

  return (
    <Button
      id={id}
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      data-testid="content-button-block"
      customActionKey={customActionKey}
      analyticsKey={analyticsKey}
      notification={notification}
      loading={
        loading ||
        router.loading ||
        parsedUrl.loading ||
        submitRAStepCb.loading ||
        submitQSStepCb.loading ||
        submitBereavementStepCb.loading ||
        submitTransferStepCb.loading
      }
      disabled={disabled}
      journeyType={journeyType}
      disabledReason={disabledReason}
      onClick={navigate}
      width={width}
      type={type}
      linkKey={linkKey}
      pageKey={pageKey}
      sx={{ whiteSpace: { md: 'nowrap' }, ...sxProps }}
      postRequestUrl={postRequestUrl}
      {...hrefProp}
    >
      <ContentButtonText
        text={text}
        icon={icon}
        iconName={iconName}
        isRightSided={rightSideIcon}
        isWithinButton={true}
        isLargeIcon={largeIcon}
      />
    </Button>
  );

  async function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
    if (
      (e.target as HTMLAnchorElement).href?.startsWith('mailto:') ||
      (e.target as HTMLAnchorElement).href?.startsWith('tel:')
    ) {
      window.open((e.target as HTMLAnchorElement).href);
      return;
    }
    e.preventDefault();
    await navigate();
  }

  async function navigate() {
    if (onAsyncCallback) {
      return await onAsyncCallback();
    }

    if (getHrefLink(href)) {
      return null;
    }

    if (fileUrl && openInTheNewTab) {
      return openInNewWindow(fileUrl);
    }

    if (fileUrl) {
      return await router.push(fileUrl);
    }

    if (!!dialogElement?.value?.elements) {
      return dialog.openDialog(dialogElement);
    }

    if (!!journeyType && parsedUrl.result?.data.url && pageKey && linkKey) {
      return await navigateJourneyStep(parsedUrl.result?.data.url + anchor, pageKey, linkKey);
    }

    if ((!link || getHrefLink(link)) && !parsedUrl.result?.data.url) {
      return;
    }

    if (link || parsedUrl.result?.data.url) {
      return navigateToPage((tenantUrl ? '/' + tenantUrl : '') + (link || parsedUrl.result!.data.url) + anchor);
    }
  }

  async function navigateJourneyStep(redirectUrl: string, currentPageKey: string, nextPageKey: string) {
    journeyType === JourneyTypes.RETIREMENT && (await submitRAStepCb.execute({ currentPageKey, nextPageKey }));
    journeyType === JourneyTypes.BEREAVEMENT &&
      (await submitBereavementStepCb.execute({ currentPageKey, nextPageKey }));
    journeyType === JourneyTypes.QUOTES_SELECTION && (await submitQSStepCb.execute({ currentPageKey, nextPageKey }));
    journeyType === JourneyTypes.TRANSFER2 && (await submitTransferStepCb.execute({ currentPageKey, nextPageKey }));

    if (journeyType && fastForward.shouldGoToSummary(journeyType, nextPageKey)) {
      await router.parseUrlAndPush(fastForward.state[journeyType].summaryPageKey!);
      fastForward.reset(journeyType);
      return;
    }

    reuseUrlParameters ? await router.push({ url: redirectUrl, query: queryParams }) : await router.push(redirectUrl);
  }

  async function navigateToPage(redirectUrl: string) {
    const fullLink = reuseUrlParameters ? qs.stringifyUrl({ url: redirectUrl, query: queryParams }) : redirectUrl;

    openInTheNewTab ? openInNewTab(fullLink) : await router.push(fullLink);
  }
};
