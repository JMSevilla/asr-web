import { ClickAwayListener, Divider, Grid, Grow, Paper, Popper, PopperProps } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Fragment, useState } from 'react';
import { MenuItem, SubMenuItem } from '../../../api/content/types/menu';
import { useDialogContext } from '../../../core/contexts/dialog/DialogContext';
import { useRouter } from '../../../core/router';
import { AnimatedArrowIcon } from '../../animations';
import { sortByOrderNo } from './utils';

interface Props {
  open: boolean;
  items: MenuItem[];
  anchorEl: PopperProps['anchorEl'];
  onClosed(): void;
  onLinkChanged(link: string): void;
  isItemActive(item: MenuItem | SubMenuItem): boolean;
}

export const NavigationMenuMobile: React.FC<Props> = ({
  open,
  items,
  anchorEl,
  isItemActive,
  onLinkChanged,
  onClosed,
}) => {
  const router = useRouter();
  const dialog = useDialogContext();
  const [expanded, setExpanded] = useState<number>(-1);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role="menu"
      placement="bottom-end"
      transition
      disablePortal
      popperOptions={{ strategy: 'absolute' }}
      modifiers={[
        {
          name: 'whole-page',
          fn: () => {},
          enabled: true,
          phase: 'main',
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            offset: '0px, 0px, 0px, 0px',
            overflow: 'hidden',
          },
        },
      ]}
      style={{ zIndex: 3 }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: 'right top' }}>
          <Paper
            sx={{
              mt: 1,
              height: theme => `calc(100vh - ${theme.sizes.mobileHeaderHeight})`,
              overflowY: 'scroll',
              boxShadow: 'unset',
            }}
          >
            <ClickAwayListener onClickAway={onClosed}>
              <Grid container width="100vw" maxWidth="100vw">
                <List
                  sx={{ width: '100%', bgcolor: 'background.paper' }}
                  disablePadding
                  component="nav"
                  role="navigation"
                >
                  {items.sort(sortByOrderNo).map((item, idx) => (
                    <Fragment key={idx}>
                      <ListItemButton
                        key={item.elements.name.value}
                        onClick={item.elements.subMenuItems?.values?.length ? toggleMenu(idx) : handleItemClick(item)}
                        sx={{
                          px: 6,
                          py: 4,
                          borderLeft: '4px solid',
                          borderLeftColor: isItemActive(item) ? 'appColors.primary' : 'transparent',
                        }}
                        alignItems="center"
                      >
                        <ListItemText
                          primary={item.elements.name.value}
                          sx={{ flex: 'unset', mr: 1 }}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                        {!!item.elements.subMenuItems?.values?.length && (
                          <AnimatedArrowIcon open={expanded === idx} color="inherit" size="medium" />
                        )}
                      </ListItemButton>
                      {items.length !== idx + 1 && <Divider sx={{ mx: 6 }} />}
                      {!!item.elements.subMenuItems?.values?.length && (
                        <Collapse in={expanded === idx} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding sx={{ width: '100%' }}>
                            {[item, ...item.elements.subMenuItems?.values]
                              .filter(subItem => subItem.elements.name.value !== item.elements.name.value)
                              .map(subItem => (
                                <Fragment key={subItem.elements.name.value}>
                                  <ListItemButton
                                    onClick={handleItemClick(subItem)}
                                    sx={{
                                      pl: 12,
                                      py: 4,
                                      borderLeft: '4px solid',
                                      borderLeftColor: isItemActive(subItem) ? 'appColors.primary' : 'transparent',
                                    }}
                                  >
                                    <ListItemText
                                      primary={subItem.elements.name.value}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                  </ListItemButton>
                                  <Divider sx={{ mx: 6 }} />
                                </Fragment>
                              ))}
                          </List>
                        </Collapse>
                      )}
                    </Fragment>
                  ))}
                </List>
              </Grid>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );

  function toggleMenu(index: number) {
    return () => setExpanded(prevIndex => (index === prevIndex ? -1 : index));
  }

  function handleItemClick(item: MenuItem | SubMenuItem) {
    return () => {
      if (item.elements.openDialog?.value?.elements) {
        dialog.openDialog(item.elements.openDialog);
        return onClosed();
      }
      onLinkChanged(item.elements.link.value);
      router.push(item.elements.link.value);
      onClosed();
    };
  }
};
