import { CircularProgress, List, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { forwardRef, OlHTMLAttributes } from 'react';

const LOADER_SIZE = 48;

interface Props extends OlHTMLAttributes<HTMLUListElement> {
  loading?: boolean;
}

export const AddressSearchList = forwardRef<HTMLUListElement, Props>(
  ({ className, loading, children, ...props }, ref) => {
    return (
      <List
        data-testid="address-search-list"
        className={[loading ? 'loading' : undefined, className].filter(Boolean).join(' ')}
        {...props}
        sx={styles}
        ref={ref}
      >
        {children}
        {loading && <CircularProgress size={LOADER_SIZE} id="loader" />}
      </List>
    );
  },
);

const styles: SxProps<Theme> = {
  backgroundColor: theme => theme.palette.common.white,
  boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.08)',
  listStyle: 'none',
  paddingInlineStart: 0,
  marginBlockStart: 0,
  marginBlockEnd: 0,
  zIndex: 9000,
  padding: theme => theme.spacing(0, 4),
  '&.loading': {
    backgroundColor: theme => theme.palette.appColors.incidental?.['035'],
    '& > *': {
      cursor: 'wait',
    },
  },
  '& #loader': {
    position: 'absolute',
    left: `calc(50% - ${LOADER_SIZE / 2}px)`,
    top: `calc(50% - ${LOADER_SIZE / 2}px)`,
  },
};
