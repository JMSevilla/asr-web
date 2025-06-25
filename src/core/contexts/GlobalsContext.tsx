import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import { DialogElement } from '../../api/content/types/common';
import { CmsGlobals, PreloadedGlobals } from '../../api/content/types/globals';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { CmsTenant } from '../../api/content/types/tenant';
import { createCmsTokenParser, injectCmsTokenValues, injectTokensToText } from '../../cms/inject-tokens';
import { callToActionValuesToCmsButtons, parseBackgroundColor } from '../../cms/parse-cms';
import {
  CmsBadge,
  CmsButton,
  CmsError,
  CmsHtmlContent,
  CmsIcon,
  CmsLabel,
  CmsMessage,
  CmsModal,
  CmsTooltip,
  InterpolationTokens,
} from '../../cms/types';
import { InformationMessage, Message, MessageType, SelectOption, TextBlock, TimerMessage } from '../../components';
import { config } from '../../config';
import { useCachedCmsTokens } from './contentData/useCachedCmsTokens';
import { usePersistentAppState } from './persistentAppState/PersistentAppStateContext';

type ContextValue = {
  globals: CmsGlobals | null;
  preloadedLabelByKey(key: string, tokens?: InterpolationTokens): string;
  labelByKey(key: string, tokens?: InterpolationTokens): string;
  rawLabelByKey(key: string): string | undefined;
  errorByKey(key: string, tokens?: InterpolationTokens): string;
  buttonByKey(key: string): CmsButton | undefined;
  tooltipByKey(key: string): CmsTooltip | undefined;
  badgeByKey(key: string): CmsBadge | undefined;
  messageByKey(key: string, display?: 'default' | 'fromQuery'): ReactNode | undefined;
  rawMessageByKey(key: string): CmsMessage | undefined;
  modalByKey(key: string): CmsModal | undefined;
  dialogByKey(key: string): DialogElement | undefined;
  classifierByKey(key: string): SelectOption[] | undefined;
  htmlByKey(key: string, tokens?: InterpolationTokens): string | JSX.Element;
  iconByKey(key: string, tenantColor?: string): CmsIcon | undefined;
};

interface Props {
  tenant: CmsTenant | null;
  globals: CmsGlobals | null;
  stickOut?: boolean;
  preloadedGlobals: PreloadedGlobals;
}

const GlobalsContext = createContext<ContextValue>({
  globals: null,
  preloadedLabelByKey: () => '',
  labelByKey: () => '',
  errorByKey: () => '',
  buttonByKey: () => undefined,
  tooltipByKey: () => undefined,
  badgeByKey: () => undefined,
  messageByKey: () => undefined,
  rawMessageByKey: () => undefined,
  modalByKey: () => undefined,
  htmlByKey: () => '',
  dialogByKey: () => undefined,
  rawLabelByKey: () => undefined,
  classifierByKey: () => undefined,
  iconByKey: () => undefined,
});

export const GlobalsProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  tenant,
  globals,
  stickOut,
  preloadedGlobals,
}) => {
  const cmsTokens = useCachedCmsTokens();
  const persistentAppState = usePersistentAppState();
  const parsedGlobals = useMemo(
    () => ({
      preloadedLabels: parseContentLabels(preloadedGlobals.labels),
      labels: parseContentLabels(globals?.labels),
      buttons: parseContentButtons(globals?.buttons),
      modals: parseContentModals(globals?.modals),
      messages: parseMessages(globals?.messages),
      tooltips: parseContentTooltips(globals?.tooltips),
      badges: parseContentBadges(globals?.badges, tenant),
      errors: parseContentErrors(globals?.errors),
      contentHtmlBlocks: parseHtmlContent(globals?.contentHtmlBlocks),
      dialogs: parseDialogs(globals?.dialogs),
      classifiers: parseClassifiers(globals?.classifiers),
      icons: parseContentIcons(globals?.icons),
    }),
    [globals, preloadedGlobals],
  );

  const preloadedLabelByKey = useCallback(
    (key: string, tokens?: InterpolationTokens) => {
      const label = parsedGlobals.preloadedLabels?.find(l => l.key?.toLowerCase() === key.toLowerCase())?.value;
      if (label === undefined || label === null) {
        return `[[${key}]]`;
      }
      return tokenizeLabel(label, tokens);
    },
    [parsedGlobals.preloadedLabels, cmsTokens.data],
  );
  const labelByKey = useCallback(
    (key: string, tokens?: InterpolationTokens) => {
      const label = parsedGlobals.labels?.find(l => l.key?.toLowerCase() === key.toLowerCase())?.value;
      if (label === undefined || label === null) {
        return `[[${key}]]`;
      }
      return tokenizeLabel(label, tokens);
    },
    [parsedGlobals.labels, cmsTokens.data],
  );
  const rawLabelByKey = useCallback(
    (key: string) => parsedGlobals.labels?.find(l => l.key?.toLowerCase() === key.toLowerCase())?.value,
    [parsedGlobals.labels],
  );
  const errorByKey = useCallback(
    (key: string, tokens?: InterpolationTokens) => {
      const label = parsedGlobals.errors?.find(e => e.key?.toLowerCase() === key.toLowerCase())?.text;
      if (label === undefined || label === null) {
        return `[[${key}]]`;
      }
      return tokenizeLabel(label, tokens);
    },
    [parsedGlobals.errors],
  );
  const buttonByKey = useCallback(
    (key: string) =>
      parsedGlobals.buttons?.find(b => b.key?.toLowerCase() === key.toLowerCase()) || { text: `[[${key}]]` },
    [parsedGlobals.buttons],
  );
  const tooltipByKey = useCallback(
    (key: string) => parsedGlobals.tooltips?.find(t => t.key?.toLowerCase() === key.toLowerCase()),
    [parsedGlobals.tooltips],
  );
  const badgeByKey = useCallback(
    (key: string) => parsedGlobals.badges?.find(t => t.key?.toLowerCase() === key.toLowerCase()),
    [parsedGlobals.badges],
  );
  const modalByKey = useCallback(
    (key: string) => parsedGlobals.modals?.find(t => t.key?.toLowerCase() === key.toLowerCase()),
    [parsedGlobals.modals],
  );
  const dialogByKey = useCallback(
    (key: string) =>
      parsedGlobals?.dialogs?.find(t => t?.value?.elements?.dialogKey?.value?.toLowerCase() === key.toLowerCase()),
    [parsedGlobals.dialogs],
  );
  const classifierByKey = useCallback(
    (key: string) => {
      const classifier = parsedGlobals?.classifiers?.find(t => t.key?.toLowerCase() === key.toLowerCase());

      const combinedItems = [...(classifier?.items || []), ...(classifier?.assetItems || [])];

      return combinedItems;
    },
    [parsedGlobals.classifiers],
  );
  const messageByKey = useCallback(
    (key: string, display: 'default' | 'fromQuery' = 'default') => {
      const message = parsedGlobals.messages?.find(t => t.key?.toLowerCase() === key.toLowerCase());

      if (!message) {
        return `[[${key}]]`;
      }

      if (message.type === 'Info block') {
        return <InformationMessage html={message.html} buttons={message.buttons} header={message.header} />;
      }

      if (display === 'fromQuery') {
        return <TimerMessage type={message.type as MessageType} html={message.html} icon={message.icon} fromQuery />;
      }

      return (
        <Message type={message.type as MessageType} html={message.html} buttons={message.buttons} icon={message.icon} />
      );
    },
    [parsedGlobals.messages],
  );
  const rawMessageByKey = useCallback(
    (key: string) => parsedGlobals.messages?.find(t => t.key?.toLowerCase() === key.toLowerCase()),
    [parsedGlobals.messages],
  );

  const htmlByKey = useCallback(
    (key: string, tokens?: InterpolationTokens): string | JSX.Element => {
      const htmlBlock = parsedGlobals.contentHtmlBlocks?.find(t => t.key?.toLowerCase() === key.toLowerCase());

      if (!htmlBlock) {
        return `[[${key}]]`;
      }

      return (
        <TextBlock
          id={htmlBlock?.key}
          header={htmlBlock?.header}
          subHeader={htmlBlock?.subHeader}
          html={tokens ? injectTokensToText(htmlBlock.html, tokens) : htmlBlock.html}
          backgroundColor={htmlBlock?.backgroundColor}
          smallerFonts={stickOut}
          tokens={tokens}
        />
      );
    },
    [parsedGlobals.contentHtmlBlocks],
  );
  const iconByKey = useCallback(
    (key: string, tenantColor?: string) => {
      const icon = parsedGlobals.icons?.find(l => l.key?.toLowerCase() === key.toLowerCase());

      return replaceTenantColor(icon, tenantColor);
    },
    [parsedGlobals.icons],
  );

  return (
    <GlobalsContext.Provider
      value={{
        globals,
        preloadedLabelByKey,
        labelByKey,
        errorByKey,
        buttonByKey,
        tooltipByKey,
        badgeByKey,
        messageByKey,
        rawMessageByKey,
        htmlByKey,
        dialogByKey,
        rawLabelByKey,
        modalByKey,
        classifierByKey,
        iconByKey,
      }}
    >
      {children}
    </GlobalsContext.Provider>
  );

  function tokenizeLabel(label: string, tokens?: InterpolationTokens) {
    const labelIncludesTokens = label.includes('[[token:') && label.includes(']]');
    if (!labelIncludesTokens) {
      return label;
    }
    const tokenizedLabel = label && tokens ? tokenEnrichedLabel(label, tokens) : label;
    return tokenizedLabel && tenant
      ? injectCmsTokenValues(
          tokenizedLabel,
          createCmsTokenParser(tenant, {}, cmsTokens.data ?? null, persistentAppState),
        )
      : tokenizedLabel;
  }
};

export const useGlobalsContext = () => useContext(GlobalsContext);

const parseClassifiers = (classifiers: CmsGlobals['classifiers']) =>
  classifiers?.map(classifier => ({
    key: classifier.elements.classifierKey?.value,
    items: classifier.elements.classifierItem.values.map<SelectOption>(item => ({
      value: item.key.value,
      label: item.value.value,
    })),
    assetItems: classifier.elements.assetItems?.values.map<SelectOption>(item => ({
      value: item.key.value,
      label: item.value?.url ?? '', // Temporary solution until the access-key endpoint is updated
    })),
  }));

const parseContentModals = (modals: CmsGlobals['modals']) =>
  modals?.map<CmsModal>(modal => ({
    header: modal.elements.header.value,
    text: modal.elements.text.value,
    linkText: modal.elements.linkText.value,
    buttons: modal.elements.callToAction.values
      ? callToActionValuesToCmsButtons(modal.elements.callToAction.values)
      : [],
    key: modal.elements.modalInformationKey.value,
    isAlternateStyle: modal.elements?.showInAlternateStyle?.value,
    hideCloseInAlternateStyle: modal.elements?.hideCloseInAlternateStyle?.value,
    panel: modal.elements?.panel?.value,
  }));

const parseDialogs = (dialogs: CmsGlobals['dialogs']) => dialogs?.map(value => ({ value }));

const parseContentTooltips = (tooltips: CmsGlobals['tooltips']) =>
  tooltips?.map<CmsTooltip>(tooltip => ({
    header: tooltip.elements.headerText.value,
    html: tooltip.elements.contentText.value,
    text: tooltip.elements.linkText.value,
    key: tooltip.elements.tooltipKey.value,
    makeInline: tooltip.elements.makeInline?.value,
  }));

const parseContentBadges = (badges: CmsGlobals['badges'], tenant: CmsTenant | null) =>
  badges?.map<CmsBadge>(badge => ({
    key: badge.elements.badgeKey.value,
    text: badge.elements.title.value,
    backgroundColor: parseBackgroundColor(tenant, badge.elements.themeColorForBackground),
    color: parseBackgroundColor(tenant, badge.elements.elementColor),
    urls: badge.elements?.dataSourceUrl?.value,
    makeInline: badge.elements?.makeInline?.value,
    addBorder: badge.elements?.addBorder?.value ?? false,
  }));

const parseContentButtons = (buttons: CmsGlobals['buttons']) =>
  buttons?.map(button => ({
    customActionKey: button.elements.customActionKey?.value,
    analyticsKey: button.elements.analyticsKey?.value,
    anchor: button.elements.anchor?.value ? `#${encodeURIComponent(button.elements.anchor?.value).trim()}` : '',
    linkKey: button.elements.pageKey?.value,
    link: button.elements.buttonLink?.value,
    text: button.elements.buttonText?.value,
    type: button.elements.buttonType?.value?.selection,
    key: button.elements.buttonKey?.value,
    openInTheNewTab: button.elements.openInTheNewTab?.value,
    icon: button.elements.icon,
    widthPercentage: button.elements?.widthPercentage?.value,
    dialogElement: button.elements.openDialog,
    notification: button.elements.notification?.value,
    disabledReason: button.elements.disabledReason?.value,
    fileUrl: button.elements?.openFile?.url ? config.value.CMS_URL + button.elements.openFile.url : '',
    pageKey: button.elements.pageKey?.value,
    journeyType: (button.elements.journeyType?.value?.selection?.toLowerCase() ||
      button.elements.journeyType?.value) as JourneyTypeSelection | undefined,
  }));

const parseContentLabels = (labels: CmsGlobals['labels']) =>
  labels?.map<CmsLabel>(label => ({
    key: label.elements.labelKey.value,
    value: label.elements.labelText.value,
    linkTarget: label.elements?.linkTarget?.value ?? undefined,
  }));

const parseContentErrors = (errors: CmsGlobals['errors']) =>
  Array.from(errors ?? []).map<CmsError>(error => ({
    key: error.elements?.errorKey.value,
    text: error.elements?.text.value,
    alt: error.elements?.alternateTexts.value,
  }));

const parseMessages = (messages: CmsGlobals['messages']) =>
  Array.from(messages ?? []).map<CmsMessage>(message => ({
    key: message.elements?.messageKey?.value,
    type: message.elements?.type.value?.selection ?? '',
    header: message.elements?.header?.value ?? '',
    html: message.elements?.text.value,
    icon: message.elements?.icon?.value,
    buttons: message.elements?.callToAction?.values?.length
      ? callToActionValuesToCmsButtons(message.elements.callToAction.values)
      : [],
  }));

const parseHtmlContent = (contents: CmsGlobals['contentHtmlBlocks']) =>
  Array.from(contents ?? []).map<CmsHtmlContent>(content => ({
    key: content.elements?.contentBlockKey.value,
    header: content.elements?.header.value,
    subHeader: content.elements?.subHeader?.value,
    html: content.elements?.content.value,
    backgroundColor: content.elements?.themeColorForBackground?.value,
  }));

const parseContentIcons = (icons: CmsGlobals['icons']) =>
  icons?.map<CmsIcon>(icon => ({
    key: icon.elements?.iconKey?.value,
    name: icon.elements?.iconName?.value,
    width: icon.elements?.width?.value,
    height: icon.elements?.height?.value,
    color: icon.elements?.color?.value,
    svgData: icon.elements?.svgData?.value,
  }));

const replaceTenantColor = (icon?: CmsIcon, tenantColor?: string) => {
  if (icon?.color === 'tenant' && tenantColor) {
    return {
      ...icon,
      color: tenantColor,
    };
  }

  return icon;
};

const tokenEnrichedLabel = (label: string, tokens: InterpolationTokens) => {
  Object.entries(tokens).forEach(([key, value]) => {
    label = label?.replace(`[[token:${key}]]`, value ?? `[[token:${key}]]`);
  });
  return label;
};
