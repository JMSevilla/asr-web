import { ClickAwayListener, Grow, Paper, Popper, PopperProps, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { MenuItem, SubMenuItem } from '../../../api/content/types/menu';
import { Membership } from '../../../api/mdp/types';
import { formatDate } from '../../../business/dates';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useDialogContext } from '../../../core/contexts/dialog/DialogContext';
import { useResolution } from '../../../core/hooks/useResolution';
import { useScroll } from '../../../core/hooks/useScroll';
import { useRouter } from '../../../core/router';
import { PrimaryButton } from '../../buttons';
import { AccountMenuList } from './AccountMenuList';
import { useContentScroller } from './hooks';

interface Props {
  member: Membership | null;
  anchorEl: PopperProps['anchorEl'];
  open: boolean;
  accountItem?: MenuItem;
  onClosed(): void;
  onLogout(): void;
}

export const AccountMenu: React.FC<Props> = ({ member, open, anchorEl, accountItem, onClosed, onLogout }) => {
  const { rawLabelByKey } = useGlobalsContext();
  const { isMobile } = useResolution();
  const scroll = useScroll();
  const router = useRouter();
  const dialog = useDialogContext();
  const contentScroller = useContentScroller(open);

  useEffect(() => {
    if (isMobile && open) {
      scroll.disableScroll();
      return;
    }
    scroll.enableScroll();
  }, [open, isMobile, scroll]);

  return (
    <Popper
      open={open}
      role="menu"
      anchorEl={anchorEl}
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
        <Grow {...TransitionProps} style={{ transformOrigin: 'right top' }}>
          <Paper
            elevation={0}
            sx={{
              height: { xs: '100vh', md: 'auto' },
              borderRadius: { xs: 0, md: '12px' },
              border: { xs: 'none', md: '1px solid' },
              borderColor: { xs: 'transparent', md: 'divider' },
              mt: { xs: 0, md: 2 },
            }}
          >
            <ClickAwayListener onClickAway={onClosed}>
              <Stack
                width={{ xs: '100vw', md: 'auto' }}
                minWidth={{ xs: '100vw', md: 400 }}
                maxWidth={{ xs: '100vw', md: 400 }}
                mt={{ xs: 1, md: 4 }}
              >
                <Stack
                  pt={{ xs: 6, md: 4 }}
                  px={4}
                  maxHeight="70vh"
                  overflow="auto"
                  borderBottom={contentScroller.bottomReached ? 0 : 1}
                  borderColor="divider"
                  ref={contentScroller.ref}
                  pb="2px"
                >
                  <Stack mb={6} ml={0.5}>
                    {member?.referenceNumber && (
                      <Stack direction="row" gap={1}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
                        >
                          {rawLabelByKey(`member_number`)}
                        </Typography>
                        <Typography variant="body1">{member?.referenceNumber}</Typography>
                      </Stack>
                    )}
                    {member?.status && (
                      <Stack direction="row" gap={1}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
                        >
                          {rawLabelByKey(`member_status`)}
                        </Typography>
                        <Typography variant="body1">{rawLabelByKey(`member_status:${member?.status}`)}</Typography>
                      </Stack>
                    )}
                    {!!rawLabelByKey(`date_joined`) && member?.dateJoinedScheme && (
                      <Stack direction="row" gap={1}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
                        >
                          {rawLabelByKey(`date_joined`)}
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(new Date(member?.dateJoinedScheme), 'dd/MM/yyyy')}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <AccountMenuList accountItem={accountItem} onItemClick={handleItemClick} />
                </Stack>
                <Stack pb={{ xs: 6, md: 4 }} px={4}>
                  <PrimaryButton
                    id="logoutButton"
                    data-testid="logout-button"
                    onClick={handleLogoutClick}
                    width="fit-content"
                    sx={{ mt: 6, alignSelf: 'flex-end' }}
                  >
                    {rawLabelByKey('logout')}
                  </PrimaryButton>
                </Stack>
              </Stack>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );

  async function handleItemClick(item: SubMenuItem) {
    item.elements.link.value && (await router.push(item.elements.link.value));
    item.elements.openDialog?.value && dialog.openDialog(item.elements.openDialog);
    onClosed();
  }

  function handleLogoutClick() {
    onClosed();
    onLogout();
  }
};
