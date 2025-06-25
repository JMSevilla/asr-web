import { Box, Grid, Typography } from '@mui/material';
import { OrderedAccordion } from '../..';
import { OrderedListItemElement } from '../../../api/content/types/page';

interface Props {
  id?: string;
  header?: string;
  listItems?: { elements: OrderedListItemElement }[];
  isHiddenNumbers?: boolean;
}

export const OrderedAccordionsList: React.FC<Props> = ({ id, header, listItems, isHiddenNumbers }) => {
  return (
    <Box id={id}>
      {header && (
        <Typography mb={6} variant="h2">
          {header}
        </Typography>
      )}
      <Grid container>
        {listItems?.map((item, idx) => (
          <Grid key={idx} item xs={12}>
            <OrderedAccordion
              number={isHiddenNumbers ? undefined : idx + 1}
              header={item?.elements?.header?.value}
              html={item?.elements?.content?.value}
              opened={item?.elements?.showInAccordion?.value?.selection === 'Open'}
              isLast={listItems.length === idx + 1}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
