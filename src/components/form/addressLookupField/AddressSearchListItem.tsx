import { ListItem, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { forwardRef, LiHTMLAttributes } from 'react';
import { AddressSummary } from '../../../api/mdp/types';

interface Props {
  suggestion: AddressSummary;
}
export const AddressSearchListItem = forwardRef<
  HTMLLIElement,
  React.PropsWithChildren<LiHTMLAttributes<HTMLLIElement> & Props>
>(({ value, suggestion, ...props }, ref) => {
  const regex = new RegExp(`(.*)(${value?.toString().replace(/\W/g, '')})(.*)`, 'i');
  const search = `${suggestion.text} ${suggestion.description}`;

  const result = search.match(regex);
  const [before, match, after] = result?.slice(1) ?? ['', '', ''];

  return (
    <ListItem sx={styles} ref={ref} {...props}>
      {result?.length === 4 ? (
        <>
          {before}
          <strong>{match}</strong>
          {after}
        </>
      ) : (
        search
      )}
    </ListItem>
  );
});

const styles: SxProps<Theme> = {
  cursor: 'pointer',
  marginTop: theme => theme.spacing(1) + ' !important',
  marginBottom: theme => theme.spacing(1) + ' !important',
  padding: '16px 0px',
  alignItems: 'unset',
  display: 'block',
};
