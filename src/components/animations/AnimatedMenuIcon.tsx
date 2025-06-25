import { styled } from '@mui/material';

interface Props {
  open: boolean;
}

export function AnimatedMenuIcon({ open }: Props) {
  return (
    <StyledBurger open={open}>
      <span />
      <span />
      <span />
    </StyledBurger>
  );
}

interface StyleProps {
  open?: boolean;
}

const StyledBurger = styled('span')<StyleProps>(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: 22.5,
  height: 22.5,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  zIndex: 10,

  '&:focus': {
    outline: 'none',
  },

  '& span': {
    width: 22.5,
    height: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
    transition: theme.transitions.create('all', { easing: 'ease-out', duration: 100 }),
    position: 'relative',
    transformOrigin: '1px',

    '&:first-of-type': {
      transform: open ? 'rotate(45deg) translateX(3px)' : 'rotate(0) translateX(0px)',
    },

    '&:nth-of-type(2)': {
      opacity: open ? 0 : 1,
      transform: open ? 'translate(2.4px,-7.8px) rotate(45deg)' : 'translate(0px, 0px) rotate(0)',
    },

    '&:nth-of-type(3)': {
      transform: open ? 'rotate(-45deg) translateX(3px)' : 'rotate(0) translateX(0px)',
    },
  },
}));
