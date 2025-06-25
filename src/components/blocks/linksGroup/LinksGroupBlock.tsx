import { Box, Grid, Typography } from '@mui/material';
import { LinkItem } from './LinkItem';

interface Props {
  id?: string;
  links?: Array<{
    labelHeader?: string;
    groupItems?: Array<{
      label?: string;
      html?: string;
      link?: string;
    }>;
  }>;
  backgroundColor?: string | null;
}

export const LinksGroupBlock: React.FC<Props> = ({ id, links, backgroundColor }) => (
  <Grid
    id={id}
    container
    rowSpacing={12}
    data-testid="link-panel"
    sx={{
      backgroundColor,
      '& .link-item:not(:nth-last-of-type(-n+2))>div, .link-item:nth-of-type(2n):not(:last-child)>div': {
        borderBottom: `1px solid`,
        borderColor: 'divider',
        paddingBottom: 12,
      },
      '& .link-item:nth-of-type(2n - 1)>div': {
        paddingRight: 6,
      },
    }}
  >
    {links?.map((link, index) => (
      <Grid key={index} item lg={6} className="link-item">
        <Box height="100%">
          <Typography variant="h3" fontWeight="bold" mb={6}>
            {link.labelHeader}
          </Typography>
          <Grid container spacing={6}>
            {link.groupItems?.map((item, index) => (
              <Grid item xs={12} key={index}>
                <LinkItem label={item.label} html={item.html} link={item.link} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    ))}
  </Grid>
);
