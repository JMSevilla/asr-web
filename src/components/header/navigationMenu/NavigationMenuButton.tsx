import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { forwardRef } from 'react';
import { SecondaryButton } from '../..';
import { AnimatedMenuIcon } from '../../animations';

interface Props {
  open: boolean;
  onClicked(): void;
}

export const NavigationMenuButton = forwardRef<HTMLButtonElement, Props>(({ open, onClicked }, ref) => (
  <SecondaryButton
    ref={ref}
    data-testid="navigation-menu-button"
    aria-haspopup="true"
    aria-controls={open ? 'navigation-menu' : undefined}
    aria-expanded={open ? 'true' : undefined}
    onClick={onClicked}
    sx={buttonStyle}
  >
    <AnimatedMenuIcon open={open} />
  </SecondaryButton>
));

const buttonStyle: SxProps<Theme> = {
  py: 0,
  px: 0,
  minWidth: 0,
  border: 'unset !important',
  background: 'transparent !important',

  '& .MuiTouchRipple-root span': {
    backgroundColor: 'transparent',
  },
};
