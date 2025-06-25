import { ClickAwayListener, Grid, Grow, Paper, Popper, PopperProps, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { KeyboardEvent, MouseEvent } from 'react';
import { PageMenuItem } from './types';

interface Props {
  open: boolean;
  items: PageMenuItem[];
  anchorEl: PopperProps['anchorEl'];
  blockInViewIndex: number;
  onClosed(): void;
  onItemClicked(e: MouseEvent | KeyboardEvent, index: number): void;
}

export const PageMenuMobile: React.FC<Props> = ({
  open,
  items,
  anchorEl,
  blockInViewIndex,
  onItemClicked,
  onClosed,
}) => {
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
      style={{ zIndex: 2 }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: 'top' }}>
          <Paper
            sx={{
              height: theme => `calc(100vh - ${theme.sizes.mobileHeaderHeight})`,
              overflowY: 'scroll',
              boxShadow: 'unset',
            }}
          >
            <ClickAwayListener onClickAway={onClosed}>
              <Grid container width="100vw" maxWidth="100vw">
                <List sx={{ width: '100%', bgcolor: 'background.paper' }} disablePadding component="ul" role="menu">
                  {items.map((item, idx) => (
                    <ListItemButton
                      key={idx}
                      onClick={e => handleItemClick(e, idx)}
                      sx={{
                        pl: 12,
                        pr: 6,
                        py: 4,
                        borderLeft: '4px solid',
                        borderLeftColor: blockInViewIndex === idx ? 'appColors.primary' : 'transparent',
                      }}
                      alignItems="center"
                      divider={items.length !== idx + 1}
                      component="li"
                    >
                      <Typography
                        variant="body2"
                        component="a"
                        color="inherit"
                        sx={{ textDecoration: 'none' }}
                        href={'#' + item.key.value}
                      >
                        {item.value.value}
                      </Typography>
                    </ListItemButton>
                  ))}
                </List>
              </Grid>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );

  function handleItemClick(e: MouseEvent, index: number) {
    onItemClicked(e, index);
    onClosed();
  }
};
