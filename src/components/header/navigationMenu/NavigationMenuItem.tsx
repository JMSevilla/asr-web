import { Box, Grid, Typography } from '@mui/material';
import PopupState, { bindHover, bindMenu } from 'material-ui-popup-state';
import HoverMenu from 'material-ui-popup-state/HoverMenu';
import React, { useRef } from 'react';
import { MenuItem, SubMenuItem } from '../../../api/content/types/menu';
import { useDialogContext } from '../../../core/contexts/dialog/DialogContext';
import { useRouter } from '../../../core/router';
import { AnimatedArrowIcon } from '../../animations';
import { MenuNavigationItem } from './MenuNavigationItem';

interface Props {
  item: MenuItem;
  onLinkChanged(link: string): void;
  isItemActive(item: MenuItem | SubMenuItem): boolean;
  pageKey?: string;
}

export const NavigationMenuItem: React.FC<Props> = ({ isItemActive, onLinkChanged, item, pageKey }) => {
  const router = useRouter();
  const dialog = useDialogContext();
  const firstMenuSubItemRef = useRef<HTMLLIElement>(null);
  const items = item.elements.subMenuItems?.values;

  return (
    <PopupState variant="popover" disableAutoFocus popupId="navigation-menu-item">
      {popupState => (
        <Grid aria-label={item.elements.name.value}>
          <Typography
            className="nav-button"
            tabIndex={0}
            color="text.primary"
            component="a"
            display="flex"
            alignItems="flex-end"
            variant="body1"
            role="button"
            sx={{
              pb: 4,
              mb: '-1px',
              cursor: 'pointer',
              borderBottom: '4px solid',
              borderBottomColor: isActive(popupState.isOpen, item) ? 'appColors.primary' : 'transparent',
              transition: theme => theme.transitions.create(['border', 'color']),
              '&:hover': { color: 'appColors.primary', borderBottomColor: 'appColors.primary' },
            }}
            onClick={e => handleItemClick(e, item, popupState.close)}
            onKeyDown={e => handleKeyDown(e, popupState.close)}
            onFocus={popupState.open}
            data-testid="navigation-menu-item"
            {...bindHover(popupState)}
          >
            {item.elements.name.value}
            {!!items?.length && (
              <Box mb={-3} ml={1}>
                <AnimatedArrowIcon open={popupState.isOpen} color="inherit" width={26} />
              </Box>
            )}
          </Typography>
          {!!items?.length && (
            <HoverMenu
              tabIndex={0}
              MenuListProps={{ 'aria-labelledby': 'menu-item-submenu' }}
              {...bindMenu(popupState)}
            >
              {items.map((item, idx) => (
                <MenuNavigationItem
                  id={idx}
                  item={item}
                  firstMenuSubItemRef={firstMenuSubItemRef}
                  handleItemClick={handleItemClick}
                  close={popupState.close}
                  length={items.length}
                  active={isItemActive(item)}
                  queryParams={router.parsedQuery as { [key: string]: string }}
                  pageKey={pageKey}
                  isButton={!!item?.elements?.buttonAsMenuItem?.value}
                />
              ))}
            </HoverMenu>
          )}
        </Grid>
      )}
    </PopupState>
  );

  function isActive(isOpen: boolean, item: MenuItem) {
    return (isOpen && !!items?.length) || isItemActive(item) || !!items?.some(subItem => isItemActive(subItem));
  }

  function handleKeyDown(e: React.KeyboardEvent, callback: VoidFunction) {
    if (e.code === 'Enter') {
      handleItemClick(e, item, callback);
      return;
    }
    if (e.code === 'Escape' || e.code === 'Tab') {
      callback();
      return;
    }
    if (e.code === 'ArrowDown') {
      firstMenuSubItemRef.current?.focus();
    }
  }

  function handleItemClick(
    e: React.MouseEvent | React.KeyboardEvent,
    item: MenuItem | SubMenuItem,
    callback?: VoidFunction,
    buttonRef?: React.RefObject<HTMLButtonElement | HTMLAnchorElement>,
  ) {
    (e.currentTarget as HTMLButtonElement).blur();

    if (buttonRef?.current) {
      buttonRef.current.click();
      return;
    }

    if (item.elements.openDialog?.value?.elements) {
      dialog.openDialog(item.elements.openDialog);
      return callback && callback();
    }

    const linkValue = item.elements.link.value;
    if (!linkValue) {
      return callback && callback();
    }

    const isExternalLink = linkValue.startsWith('http');
    const link = isExternalLink ? linkValue : ['/', linkValue].join('').replace(/\/+/g, '/');
    onLinkChanged(link);
    router.push(link);
    callback && callback();
  }
};
