import { Grid, Link, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { FC } from 'react';
import { CmsPage } from '../../api/content/types/page';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';

interface Props {
  page: CmsPage | null;
}

const LINKS: { title: string; key: string; isAuth?: boolean }[] = [
  { title: 'skip_to_content', key: 'mainContent' },
  { title: 'skip_to_navigation', key: 'mainNavContainer' },
  { title: 'skip_to_logout', key: 'accountMenu', isAuth: true },
  { title: 'skip_to_help', key: 'startVirtualAssistant', isAuth: true },
];

export const AccessibilitySkipLinks: FC<Props> = ({ page }) => {
  const { isAuthenticated } = useAuthContext();
  const { labelByKey } = useGlobalsContext();

  const links = LINKS.filter(link => (isAuthenticated ? link : !link.isAuth));
  return (
    <Grid
      container
      height={0}
      sx={{
        a: {
          position: 'absolute',
          left: '-999px',

          '&:focus, &:active': {
            position: 'absolute',
            left: '0px',
            top: '0px',
            zIndex: 2147483647,
            width: 'auto',
            height: 'auto',
            minWidth: '',
            padding: 2,
            color: '#000',
          },
        },
      }}
    >
      <nav role="navigation" aria-label="Skip navigation" id="skipContainer">
        <Grid
          container
          component="ul"
          direction="column"
          alignItems="flex-start"
          rowSpacing={4}
          sx={{ listStyle: 'none' }}
        >
          {links.map(
            (link, idx) =>
              link?.key && (
                <Grid key={idx} component="li" item className="skip skip-content">
                  <Link href={`#${link.key}`} sx={linkItemStyle} className="icon icon-content">
                    <span>{labelByKey(link.title)}</span>
                  </Link>
                </Grid>
              ),
          )}
        </Grid>
      </nav>
    </Grid>
  );
};

const linkItemStyle: SxProps<Theme> = {
  textDecoration: 'underline',
  textUnderlineOffset: theme => theme.spacing(2),
  '&:hover': { color: 'appColors.secondary.light' },
};
