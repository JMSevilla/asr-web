import { Grid } from '@mui/material';
import { FileValue } from '../../../api/content/types/common';
import { CardsValues, JourneyTypeSelection } from '../../../api/content/types/page';
import { PageFeedCarousel } from './PageFeedCarousel';
import { PageFeedGrid } from './PageFeedGrid';
import { PageFeedWidgetsContent } from './PageFeedWidgetsContent';

interface Props {
  pageUrl: string;
  defaultImage?: FileValue;
  showAll: boolean;
  pageUrlsString?: string;
  header?: string;
  cards?: CardsValues[];
  pageKey: string;
  journeyType?: JourneyTypeSelection;
}
export const PageFeedWidgetsBlock: React.FC<Props> = ({
  pageUrl,
  defaultImage,
  showAll,
  pageUrlsString,
  header,
  cards,
  pageKey,
  journeyType,
}) => {
  if (!defaultImage) return null;

  if (!!cards?.length) {
    return (
      <Grid container wrap="wrap" height="auto" data-testid="page-feed-cards-widget">
        {showAll ? (
          <PageFeedGrid
            header={header}
            cards={cards}
            defaultImage={defaultImage}
            pageKey={pageKey}
            journeyType={journeyType}
          />
        ) : (
          <PageFeedCarousel
            header={header}
            cards={cards}
            defaultImage={defaultImage}
            pageKey={pageKey}
            journeyType={journeyType}
          />
        )}
      </Grid>
    );
  }

  return (
    <PageFeedWidgetsContent
      pageUrlsString={pageUrlsString}
      showAll={showAll}
      header={header}
      pageUrl={pageUrl}
      defaultImage={defaultImage}
      pageKey={pageKey}
      journeyType={journeyType}
    />
  );
};
