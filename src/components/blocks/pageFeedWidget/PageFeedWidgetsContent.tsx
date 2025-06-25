import { Grid } from '@mui/material';
import { FileValue } from '../../../api/content/types/common';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { PageFeedCarousel } from './PageFeedCarousel';
import { PageFeedGrid } from './PageFeedGrid';
import { usePageFeedWidgetData } from './hooks';

interface Props {
  pageUrl: string;
  defaultImage?: FileValue;
  showAll: boolean;
  pageUrlsString?: string;
  header?: string;
  pageKey: string;
  journeyType?: JourneyTypeSelection;
}
export const PageFeedWidgetsContent: React.FC<Props> = ({
  pageUrl,
  defaultImage,
  showAll,
  pageUrlsString,
  header,
  pageKey,
  journeyType,
}) => {
  const pageUrls = pageUrlsString?.split('\n') ?? [pageUrl];
  const { loading, widgets, error } = usePageFeedWidgetData(pageUrls);

  if (loading) return null;

  if (!defaultImage || error) return null;

  return (
    <Grid container wrap="wrap" height="auto" data-testid="page-feed-widget">
      {showAll ? (
        <PageFeedGrid
          header={header}
          widgets={widgets}
          defaultImage={defaultImage}
          pageKey={pageKey}
          journeyType={journeyType}
        />
      ) : (
        <PageFeedCarousel
          header={header}
          widgets={widgets}
          defaultImage={defaultImage}
          pageKey={pageKey}
          journeyType={journeyType}
        />
      )}
    </Grid>
  );
};
