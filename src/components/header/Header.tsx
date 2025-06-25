import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CmsMenu } from '../../api/content/types/menu';
import { CmsTenant } from '../../api/content/types/tenant';
import { Membership } from '../../api/mdp/types';
import { formatFullName, formatInitials } from '../../business/names';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { useResolution } from '../../core/hooks/useResolution';
import { useRouter } from '../../core/router';
import { CobrandingLogo } from './CobrandingLogo';
import { HeaderLogo } from './HeaderLogo';
import { HeaderLogoNavigation } from './HeaderLogoNavigation';
import { AccountMenu } from './accountMenu/AccountMenu';
import { AccountMenuButton } from './accountMenu/AccountMenuButton';
import { NavigationMenu } from './navigationMenu/NavigationMenu';
import { NavigationMenuButton } from './navigationMenu/NavigationMenuButton';
import { TaskListBell } from './taskList/TaskListBell';

interface Props {
  menuData: CmsMenu | null;
  tenant: CmsTenant | null;
  useRawLogoUrl?: boolean;
  onLogout(): void;
  pageKey?: string;
  membershipData: Membership | null;
  hideNavigation?: boolean;
}

export const Header: React.FC<Props> = ({
  tenant,
  useRawLogoUrl,
  onLogout,
  menuData,
  pageKey,
  membershipData,
  hideNavigation = false,
}) => {
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);
  const accountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { isSingleAuth, isAuthenticated } = useAuthContext();
  const { isMobile } = useResolution();

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [router.asPath]);

  const disableNavigation = hideNavigation || (isSingleAuth && !isAuthenticated);
  const menu = !disableNavigation ? menuData : null;
  const membership = !disableNavigation ? membershipData : null;
  const accountItem = menu?.value?.find(item => item.elements.position.value?.selection === 'Account');
  const showNotificationBell = isAuthenticated && !hideNavigation && !!membership;

  return (
    <>
      <Box
        role="banner"
        component="header"
        width="100%"
        display="flex"
        justifyContent="center"
        zIndex={999}
        sx={{
          backgroundColor: 'background.default',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'divider',
          ...(isMobile ? { position: 'fixed', top: 0, left: 0, right: 0 } : {}),
        }}
      >
        <Grid
          container
          px={8}
          width="100%"
          position="relative"
          display="flex"
          alignItems="flex-end"
          justifyContent="flex-end"
          sx={{
            maxWidth: theme => theme.sizes.contentWidth,
            height: theme => ({ xs: theme.sizes.mobileHeaderHeight, md: theme.sizes.headerHeight }),
            maxHeight: theme => ({ xs: theme.sizes.mobileHeaderHeight, md: theme.sizes.headerHeight }),
          }}
        >
          <Grid item container alignItems="flex-end" spacing={6} height={{ xs: 'auto', md: 80 }}>
            <Grid item container alignItems="flex-end" xs>
              <Grid item>
                <HeaderLogoNavigation
                  href={isAuthenticated ? router.staticRoutes.hub : router.staticRoutes.home}
                  shouldNavigateToNewTab={!isAuthenticated}
                  disableNavigation={disableNavigation}
                >
                  <HeaderLogo useRawLogoUrl={useRawLogoUrl} tenant={tenant} disableNavigation={disableNavigation} />
                </HeaderLogoNavigation>
              </Grid>
              <Grid item>
                <HeaderLogoNavigation
                  id="cobranding_logo_button"
                  href={isAuthenticated ? router.staticRoutes.hub : router.staticRoutes.home}
                  shouldNavigateToNewTab={!isAuthenticated}
                  disableNavigation={disableNavigation}
                >
                  <CobrandingLogo tenant={tenant} disableNavigation={disableNavigation} />
                </HeaderLogoNavigation>
              </Grid>
            </Grid>
            {showNotificationBell && (
              <Grid item alignSelf="center">
                <TaskListBell />
              </Grid>
            )}
            {!disableNavigation && (
              <>
                {isAuthenticated && (
                  <Grid item alignSelf="center" display={{ xs: 'none', md: 'inline-block' }}>
                    <Typography data-testid="user_name" variant="body2">
                      {formatFullName(membership)}
                    </Typography>
                  </Grid>
                )}
                {isAuthenticated && !!membership && (
                  <Grid item alignSelf="center">
                    <AccountMenuButton
                      userInitials={formatInitials(membership)}
                      ref={accountMenuButtonRef}
                      open={accountMenuOpen}
                      onClicked={handleAccountMenuButtonClick}
                    />
                  </Grid>
                )}
                {isMobile && (
                  <Grid item>
                    <NavigationMenuButton
                      open={navigationMenuOpen}
                      ref={navigationMenuButtonRef}
                      onClicked={handleNavigationMenuButtonClick}
                    />
                  </Grid>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12} position="relative">
            {!disableNavigation && (
              <>
                {isAuthenticated && (
                  <AccountMenu
                    member={membership}
                    onLogout={onLogout}
                    open={accountMenuOpen}
                    onClosed={handleAccountMenuClose}
                    anchorEl={accountMenuButtonRef.current}
                    accountItem={accountItem}
                  />
                )}
                <NavigationMenu
                  open={navigationMenuOpen}
                  anchorEl={navigationMenuButtonRef.current}
                  onClosed={handleNavigationMenuClose}
                  headerMenu={menu}
                  pageKey={pageKey}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );

  function handleAccountMenuButtonClick() {
    setAccountMenuOpen(open => !open);
  }

  function handleAccountMenuClose() {
    setAccountMenuOpen(false);
  }

  function handleNavigationMenuButtonClick() {
    setNavigationMenuOpen(open => !open);
  }

  function handleNavigationMenuClose() {
    setNavigationMenuOpen(false);
  }
};
