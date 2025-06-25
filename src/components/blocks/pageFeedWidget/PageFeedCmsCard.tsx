import { FileValue } from '../../../api/content/types/common';
import { CardsValues, JourneyTypeSelection } from '../../../api/content/types/page';
import { parseButtonProps } from '../../../cms/parse-cms';
import { useCachedCmsAsset } from '../../../core/hooks/useCmsAsset';
import { ContentButtonBlock } from '../ContentButtonBlock';
import { CardContainer } from './CardContainer';

interface Props {
  card: CardsValues;
  defaultImage: FileValue;
  id: number;
  pageKey: string;
  journeyType?: JourneyTypeSelection;
}

export const PageFeedCmsCard: React.FC<Props> = ({ card, defaultImage, id, pageKey, journeyType }) => {
  const image = useCachedCmsAsset(card?.elements?.image?.url ?? defaultImage.url);

  return (
    <CardContainer
      header={card?.elements?.title?.value}
      image={image}
      id={id}
      content={card?.elements?.description?.value}
      buttons={
        card.elements?.callToAction?.value?.elements && (
          <ContentButtonBlock
            id={`desc-card-cta-${id}}`}
            aria-labelledby={`desc-card-cta-${id} desc-card-title-${id}`}
            data-testid="page-feed-read-more-btn"
            {...parseButtonProps(card.elements?.callToAction?.value?.elements, journeyType)}
            pageKey={pageKey}
          />
        )
      }
    />
  );
};
