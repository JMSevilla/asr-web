import { SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { FileValue, PageWidget } from '../../../api/content/types/common';
import { CardsValues, JourneyTypeSelection } from '../../../api/content/types/page';
import { CarouselContainer } from './CarouselContainer';
import { PageFeedCard } from './PageFeedCard';
import { PageFeedCmsCard } from './PageFeedCmsCard';

interface Props {
  widgets?: PageWidget[];
  defaultImage: FileValue;
  header?: string;
  cards?: CardsValues[];
  pageKey: string;
  journeyType?: JourneyTypeSelection;
}

export const PageFeedCarousel: React.FC<Props> = ({ widgets, defaultImage, header, cards, pageKey, journeyType }) => {
  const length = !!cards?.length ? cards.length : widgets?.length ?? 0;

  return (
    <CarouselContainer length={length} header={header} data-testid="page-feed-carousel">
      {!!cards?.length
        ? cards?.map((card, index) => (
            <SwiperSlide key={index}>
              <PageFeedCmsCard
                id={index + 1}
                card={card}
                defaultImage={defaultImage}
                pageKey={pageKey}
                journeyType={journeyType}
              />
            </SwiperSlide>
          ))
        : widgets?.map((widget, index) => (
            <SwiperSlide key={index}>
              <PageFeedCard
                id={index + 1}
                widget={widget}
                defaultImage={defaultImage}
                buttonKey="page-feed-widgets-read-more"
              />
            </SwiperSlide>
          ))}
    </CarouselContainer>
  );
};
