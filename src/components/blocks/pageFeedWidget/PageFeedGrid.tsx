import { Grid, Typography } from '@mui/material';
import { FileValue, PageWidget } from '../../../api/content/types/common';
import { CardsValues, JourneyTypeSelection } from '../../../api/content/types/page';
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

export const PageFeedGrid: React.FC<Props> = ({ widgets, defaultImage, header, cards, pageKey, journeyType }) => {
  return (
    <Grid container spacing={6} component="section" data-testid="page-feed-grid">
      <Grid item xs={12}>
        <Typography variant="h2">{header}</Typography>
      </Grid>
      <Grid container item spacing={6}>
        {!!cards?.length
          ? cards?.map((card, index) => (
              <Grid key={index} item xs={12} md={4}>
                <PageFeedCmsCard
                  id={index + 1}
                  card={card}
                  defaultImage={defaultImage}
                  pageKey={pageKey}
                  journeyType={journeyType}
                />
              </Grid>
            ))
          : widgets?.map((widget, index) => (
              <Grid key={index} item xs={12} md={4}>
                <PageFeedCard
                  id={index + 1}
                  widget={widget}
                  defaultImage={defaultImage}
                  buttonKey="page-feed-widgets-read-more"
                />
              </Grid>
            ))}
      </Grid>
    </Grid>
  );
};
