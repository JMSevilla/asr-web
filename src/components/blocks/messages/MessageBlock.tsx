import { useDataReplacerApi } from '../../../core/hooks/useDataReplacerApi';
import { InformationMessage } from './InformationMessage';
import { Message } from './Message';
import { MessageProps } from './types';

interface Props extends MessageProps {
  sourceUrl?: string;
  isInfoBlock?: boolean;
}

export const MessageBlock: React.FC<Props> = ({ isInfoBlock, sourceUrl, ...props }) => {
  const replacer = useDataReplacerApi(sourceUrl);

  if (isInfoBlock) {
    return (
      <InformationMessage
        {...props}
        html={replacer.replaceDataInText(props.html)}
        loading={replacer.loading}
        dataReplaceProps={replacer.elementProps}
      />
    );
  }

  return (
    <Message
      {...props}
      html={replacer.replaceDataInText(props.html)}
      loading={replacer.loading}
      dataReplaceProps={replacer.elementProps}
    />
  );
};
