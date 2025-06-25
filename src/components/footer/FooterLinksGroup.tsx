import { Grid, Theme, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';
import { CmsTenant } from '../../api/content/types/tenant';
import { Link } from '../Link';

interface Props {
  linkGroup: NonNullable<
    NonNullable<NonNullable<CmsTenant['footer']>['value']>['elements']['linkGroups']['values']
  >[number];
}

export const FooterLinksGroup: React.FC<Props> = ({ linkGroup }) => (
  <>
    <Typography color="footer.text" component="h4" variant="h5" fontWeight={700} gutterBottom>
      {linkGroup.elements.header.value}
    </Typography>
    <Grid
      item
      container
      component="ul"
      direction="column"
      alignItems="flex-start"
      rowSpacing={4}
      sx={{ listStyle: 'none', marginLeft: '-38px' }}
    >
      {linkGroup.elements.items.values?.map((item, idx) => (
        <Grid component="li" key={idx} item sx={{ '> a': { textDecoration: 'none' } }}>
          {item?.elements?.headerLink.value && (
            <Link
              className="footer-link"
              color="footer.text"
              variant="body2"
              sx={linkItemStyle}
              href={item.elements.headerLink.value}
            >
              {item?.elements?.header.value}
            </Link>
          )}
        </Grid>
      ))}
    </Grid>
  </>
);

const linkItemStyle: SxProps<Theme> = {
  textDecoration: 'underline',
  textUnderlineOffset: theme => theme.spacing(2),
  '&:hover': { color: 'appColors.secondary.light' },
};
