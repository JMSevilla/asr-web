import { IconButton, Theme, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { forwardRef } from 'react';

interface Props {
  open: boolean;
  userInitials: string;
  onClicked(): void;
}

export const AccountMenuButton = forwardRef<HTMLButtonElement, Props>(({ open, userInitials, onClicked }, ref) => (
  <IconButton
    id="accountMenu"
    ref={ref}
    data-testid="account-menu-button"
    aria-haspopup="true"
    aria-controls={open ? 'account-menu' : undefined}
    aria-expanded={open ? 'true' : undefined}
    onClick={onClicked}
    onFocusVisible={onClicked}
    sx={buttonStyle}
    size="small"
    disableRipple
    disableTouchRipple
  >
    <Typography component="span" variant="caption">
      {userInitials}
    </Typography>
  </IconButton>
));

const buttonStyle: SxProps<Theme> = {
  height: '33px !important',
  width: '33px !important',
  maxWidth: '33px !important',
  maxHeight: '33px !important',
  minHeight: '33px !important',
  minWidth: '33px !important',
  boxSizing: 'border-box',
  py: 0,
  px: '0px !important',
  bgcolor: 'appColors.primary',
  color: 'primary.contrastText',
  borderRadius: '100px',
  border: 'unset !important',
  borderColor: theme => theme.palette.appColors.primary,

  alignItems: 'center',
  justifyContent: 'center',

  '&:hover': {
    backgroundColor: 'primary.dark',
  },

  '& span': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};
