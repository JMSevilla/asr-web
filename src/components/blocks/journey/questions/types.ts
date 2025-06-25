import { PanelListItem } from '../../../../api/content/types/page';

export interface Answer {
  answer: string;
  answerKey: string;
  nextPageKey: string;
  descriptionPanels?: PanelListItem[];
}

export const TO_CONTACTS_PATHS = ['bereav_nextOfKin_about', 'bereav_exec_about'];
