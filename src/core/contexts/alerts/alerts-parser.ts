import { Alert } from '../../../api/mdp/types';
import { MessageType } from '../../../components';
import { AlertsLists, IncludedAlertsBlocks, NonPriorityAlert, PriorityAlert } from './types';

export const parseAlerts = (alerts: Alert[]) =>
  alerts
    .sort((a, b) => a.alertID - b.alertID)
    .reduce<{ priority: PriorityAlert[]; nonPriority: NonPriorityAlert[] }>(
      (acc, alert) => {
        const parsedAlert = parseAlert(alert);
        if ('type' in parsedAlert) return { ...acc, priority: [...acc.priority, parsedAlert] };
        return { ...acc, nonPriority: [...acc.nonPriority, parsedAlert] };
      },
      { priority: [], nonPriority: [] },
    );

const parseAlert = (alert: Alert): PriorityAlert | NonPriorityAlert => {
  const typeRegex = /\[\[type:([^\]]+)\]\]/;
  const typeMatch = alert.messageText.match(typeRegex);
  const messageText = fixLinksInAlertHtml(alert.messageText);
  if (typeMatch) {
    return {
      ...alert,
      type: MessageType[typeMatch[1] as keyof typeof MessageType] || MessageType.PrimaryTenant,
      messageText: messageText.replace(typeRegex, '').trim(),
    };
  }

  const titleRegex = /\[\[title:([^\]]+)\]\]/;
  const titleMatch = messageText.match(titleRegex);
  if (titleMatch) {
    const firstParagraph = `<p>${messageText.match(/<p>(.*?)<\/p>/)?.[1]}</p>`;
    const parsedText = messageText.replace(titleRegex, '').replace(firstParagraph, '').trim();
    return {
      ...alert,
      title: titleMatch[1],
      introText: firstParagraph,
      messageText: parsedText,
    };
  }

  return { ...alert, title: '', introText: '', messageText: alert.messageText.trim() };
};

export const fixLinksInAlertHtml = (html: string) =>
  html
    // Add target="_self" to links that don't have target attribute
    .replace(/<a(?![^>]*\starget=)([^>]*)\shref=(['"])([^'"]+)\2([^>]*)>/gi, '<a$1 href=$2$3$2$4 target="_self">')
    // Add rel="noopener noreferrer" to links with target="_blank" that don't have rel attribute
    .replace(
      /<a(?![^>]*\srel=)([^>]*)\starget=(['"])_blank\2([^>]*)>/gi,
      '<a$1 target=$2_blank$2$3 rel="noopener noreferrer">',
    );

export const areAlertsListsEmpty = (list: AlertsLists | undefined, blocksInPage: IncludedAlertsBlocks) => {
  if (!list) {
    return false;
  }

  if (blocksInPage.priority && blocksInPage.nonPriority) {
    return !list.priority.length && !list.nonPriority.length;
  }

  if (blocksInPage.priority) {
    return !list.priority.length;
  }

  if (blocksInPage.nonPriority) {
    return !list.nonPriority.length;
  }

  return false;
};
