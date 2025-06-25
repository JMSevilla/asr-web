import { Grid, PopperProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { CmsMenu, MenuItem, SubMenuItem } from '../../../api/content/types/menu';
import { useResolution } from '../../../core/hooks/useResolution';
import { useScroll } from '../../../core/hooks/useScroll';
import { useRouter } from '../../../core/router';
import { NavigationMenuItem } from './NavigationMenuItem';
import { NavigationMenuMobile } from './NavigationMenuMobile';
import { filterBySide, filterMenuItems, sortByOrderNo } from './utils';

interface Props {
  open: boolean;
  headerMenu?: CmsMenu | null;
  anchorEl: PopperProps['anchorEl'];
  onClosed(): void;
  pageKey?: string;
}

export const NavigationMenu: React.FC<Props> = ({ open, anchorEl, headerMenu, onClosed, pageKey }) => {
  const menuItems = headerMenu?.value?.filter(filterMenuItems);
  const leftPositionedItems = menuItems?.filter(filterBySide('Left')).sort(sortByOrderNo);
  const rightPositionedItems = menuItems?.filter(filterBySide('Right')).sort(sortByOrderNo);
  const scroll = useScroll();
  const router = useRouter();
  const { isMobile } = useResolution();
  const [selectedLink, setSelectedLink] = useState<string>(router.asPath);

  useEffect(() => {
    setSelectedLink(router.asPath.split('?')[0]);
  }, [router.asPath]);

  useEffect(() => {
    if (isMobile && open) {
      scroll.disableScroll();
      return;
    }
    scroll.enableScroll();
  }, [open, isMobile, scroll]);

  if (isMobile) {
    return (
      <NavigationMenuMobile
        open={open}
        anchorEl={anchorEl}
        onClosed={onClosed}
        onLinkChanged={setSelectedLink}
        isItemActive={isItemActive}
        items={menuItems ?? []}
      />
    );
  }

  return (
    <Grid
      id="mainNavContainer"
      container
      justifyContent="flex-start"
      spacing={8}
      component="nav"
      role="navigation"
      height={82}
      sx={{ outline: 'none' }}
    >
      {leftPositionedItems?.map(item => (
        <Grid item key={item.elements.name.value} display="flex" alignItems="flex-end" justifyContent="flex-start">
          <NavigationMenuItem
            item={item}
            isItemActive={isItemActive}
            onLinkChanged={setSelectedLink}
            pageKey={pageKey}
          />
        </Grid>
      ))}
      <Grid item flex={1} />
      {rightPositionedItems?.map(item => (
        <Grid item key={item.elements.name.value} display="flex" alignItems="flex-end" justifyContent="flex-end">
          <NavigationMenuItem
            item={item}
            isItemActive={isItemActive}
            onLinkChanged={setSelectedLink}
            pageKey={pageKey}
          />
        </Grid>
      ))}
    </Grid>
  );

  function isItemActive(item: MenuItem | SubMenuItem) {
    const hideActiveStatus = item.elements.hideActiveStatus?.value;
    if (hideActiveStatus) {
      return false;
    }

    const link = item.elements.link.value;
    const relatedLinks = item.elements.relatedLinks.value;
    if (selectedLink) {
      return Boolean(link === selectedLink || relatedLinks?.includes(selectedLink));
    }

    const currentPath = router.asPath?.split('?')[0];
    return Boolean(link === currentPath || (currentPath.length > 1 && relatedLinks?.includes(currentPath)));
  }
};
