import { Box, Grid, Theme, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { CmsTenant } from '../../api/content/types/tenant';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { FooterLinksGroup } from './FooterLinksGroup';
import { FooterLogo } from './FooterLogo';

interface Props {
  logo?: NonNullable<NonNullable<CmsTenant['footerLogo']>['renditions']>['default'];
  linkGroups?: NonNullable<NonNullable<CmsTenant['footer']>['value']>['elements']['linkGroups'];
  copyrightText?: string;
  hideNavigation?: boolean;
}

export const Footer: React.FC<Props> = ({ linkGroups, logo, copyrightText, hideNavigation }) => {
  const { isAuthenticated, isSingleAuth } = useAuthContext();
  const disableNavigation = hideNavigation || (isSingleAuth && !isAuthenticated);

  return (
    <footer role="contentinfo" data-testid="footer">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          backgroundColor: 'footer.light',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: 'divider',
        }}
      >
        <Grid
          container
          justifyContent="flex-start"
          columnSpacing={4}
          rowSpacing={16}
          m={0}
          pb={16}
          width="100%"
          maxWidth="100%"
          sx={footerContainerStyle}
        >
          {!disableNavigation &&
            linkGroups?.values?.map((group, index) => (
              <Grid
                container
                item
                xs={12}
                md={3}
                key={index}
                component="aside"
                id={`${group.elements.header.value?.toLowerCase()}Links`}
              >
                <FooterLinksGroup linkGroup={group} />
              </Grid>
            ))}
        </Grid>
        <Box display="flex" justifyContent="center" width="100%" sx={{ backgroundColor: 'footer.dark' }}>
          <Grid
            container
            minHeight={80}
            display="flex"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            sx={footerBottomStyle}
            rowSpacing={2}
            color="footer.darkText"
            maxWidth="100%"
          >
            <Grid item>
              <Typography id="copyright-text">{copyrightText}</Typography>
            </Grid>
            <Grid
              item
              maxWidth="100%"
              sx={{
                '& svg': {
                  maxWidth: '100%',
                },
              }}
            >
              <FooterLogo id="footer-logo" logo={logo} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </footer>
  );
};

const footerContainerStyle: SxProps<Theme> = {
  maxWidth: theme => theme.sizes.contentWidth,
  px: theme => ({
    xs: `calc(${theme.sizes.mobileContentPaddingX} - ${theme.spacing(4)})`,
    md: `calc(${theme.sizes.contentPaddingX} - ${theme.spacing(4)})`,
  }),
};

const footerBottomStyle: SxProps<Theme> = {
  width: theme => theme.sizes.contentWidth,
  px: theme => ({
    xs: theme.sizes.mobileContentPaddingX,
    md: theme.sizes.contentPaddingX,
  }),
  flexDirection: { xs: 'column-reverse', md: 'row' },
  pt: { xs: 8 },
  pb: { xs: 6 },
};
