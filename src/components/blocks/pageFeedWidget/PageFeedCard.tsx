import { FileValue, PageWidget } from '../../../api/content/types/common';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useCachedCmsAsset } from '../../../core/hooks/useCmsAsset';
import { useRouter } from '../../../core/router';
import { Button } from '../../buttons';
import { CardContainer } from './CardContainer';

interface Props {
  widget: PageWidget;
  defaultImage: FileValue;
  buttonKey: string;
  id: number;
}

export const PageFeedCard: React.FC<Props> = ({ widget, defaultImage, buttonKey, id }) => {
  const { buttonByKey } = useGlobalsContext();
  const router = useRouter();
  const image = useCachedCmsAsset(widget?.imageRelativeUrl ?? defaultImage.url);
  const readMore = buttonByKey(buttonKey);

  return (
    <CardContainer
      header={widget?.header ?? ''}
      image={image}
      id={id}
      content={widget?.content}
      buttons={
        <Button
          id={`desc-card-cta-${id}}`}
          aria-labelledby={`desc-card-cta-${id} desc-card-title-${id}`}
          {...readMore}
          href={widget.pageUrl}
          onClick={handleClick}
          data-testid="page-feed-read-more-btn"
        >
          {readMore?.text}
        </Button>
      }
    />
  );

  function handleClick() {
    widget?.pageUrl && router.push(widget.pageUrl);
  }
};
