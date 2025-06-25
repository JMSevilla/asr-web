import { MessageType } from '../..';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { CmsButton } from '../../../cms/types';
export interface MessageProps {
  id?: string;
  html?: string;
  icon?: string;
  buttons?: CmsButton[];
  type?: MessageType;
  header?: string;
  loading?: boolean;
  journeyType?: JourneyTypeSelection;
  dataReplaceProps?: (key?: string, path?: string) => { 'aria-tag'?: undefined } | { 'aria-tag': string | undefined };
}
