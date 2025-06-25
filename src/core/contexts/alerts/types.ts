import { Alert } from '../../../api/mdp/types';
import { MessageType } from '../../../components';

export type PriorityAlert = Alert & { type: MessageType };
export type NonPriorityAlert = Alert & { title: string; introText: string; messageText?: string };

export type IncludedAlertsBlocks = { priority: boolean; nonPriority: boolean };
export type AlertsLists = { priority: PriorityAlert[]; nonPriority: NonPriorityAlert[] };
