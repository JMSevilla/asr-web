import { CmsPage } from '../../../api/content/types/page';
import { callToActionValuesToCmsButtons } from '../../../cms/parse-cms';
import { useDataReplacerApi } from '../../../core/hooks/useDataReplacerApi';
import { AlertMessage } from '../AlertMessage';

enum MessageType {
  Info = 'Info',
  Problem = 'Problem',
  Success = 'Success',
  Warning = 'Warning',
  PrimaryTenant = 'Tenant (primary color)',
  Note = 'Note',
}

type Props = NonNullable<NonNullable<CmsPage>['content']['values']>[number]['elements'];

export const TopAlertMessage: React.FC<Props> = ({ dataSourceUrl, type, callToAction, text, icon }) => {
  const replacer = useDataReplacerApi(dataSourceUrl?.value);

  if (replacer.error) {
    return null;
  }

  return (
    <AlertMessage
      type={type?.value?.selection as MessageType}
      buttons={callToAction?.values ? callToActionValuesToCmsButtons(callToAction.values) : []}
      html={replacer.replaceDataInText(text?.value)}
      icon={icon?.value}
      loading={replacer.loading}
      ariaProps={replacer.elementProps(type as string)}
    />
  );
};
