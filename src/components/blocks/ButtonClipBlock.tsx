import { Grid } from '@mui/material';
import { ContentButtonBlock } from '..';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { ParsedButtonProps } from '../../cms/parse-cms';

interface Props {
  id?: string;
  buttons: ParsedButtonProps[];
  journeyType?: JourneyTypeSelection;
  pageKey?: string;
}

export const ButtonClipBlock: React.FC<Props> = ({ id, buttons, journeyType, pageKey }) => (
  <Grid container spacing={4} id={id} data-testid="button-clip">
    {buttons.map((button, idx) => (
      <Grid
        item
        key={idx}
        width={{
          xs: '100%',
          md: button.widthPercentage ? `${button.widthPercentage}%` : 'unset',
        }}
      >
        <ContentButtonBlock
          {...button}
          pageKey={pageKey}
          journeyType={button.journeyType || journeyType}
          widthPercentage={button.widthPercentage ? 100 : undefined}
        />
      </Grid>
    ))}
  </Grid>
);
