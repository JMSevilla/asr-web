import { CmsPage } from '../../../api/content/types/page';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useRouter } from '../../../core/router';
import { TopAlertMessage } from './TopAlertMessage';

enum MessageType {
  Info = 'Info',
  Problem = 'Problem',
  Success = 'Success',
  Warning = 'Warning',
  PrimaryTenant = 'Tenant (primary color)',
  Note = 'Note',
}

interface Props {
  page: CmsPage | null;
}

export const TopAlertMessages: React.FC<Props> = ({ page }) => {
  const { parsedQuery } = useRouter();
  const { messageByKey } = useGlobalsContext();
  const queryMessagePrefix = page?.pageKey.value ? `${page.pageKey.value}_` : '';
  const queryMessage =
    typeof parsedQuery['message'] === 'string' &&
    messageByKey(`${queryMessagePrefix}${parsedQuery['message']}`, 'fromQuery');
  const elements = page?.content.values
    ?.filter(contentValue => contentValue.type === 'Message' && contentValue.elements.showAlwaysOnTop?.value)
    .map(contentElement => contentElement.elements);

  if (queryMessage && typeof queryMessage !== 'string') {
    return <>{queryMessage}</>;
  }

  return (
    <>
      {elements?.map((element, index) => (
        <TopAlertMessage {...element} key={index} />
      ))}
    </>
  );
};
