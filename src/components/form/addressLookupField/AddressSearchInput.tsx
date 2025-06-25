import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, OutlinedInput, OutlinedInputProps, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { ComponentType } from 'react';

export const AddressSearchInput: ComponentType<OutlinedInputProps> = (props): JSX.Element => {
  return (
    <OutlinedInput
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      autoComplete="on"
      fullWidth
      sx={styles}
      {...props}
    />
  );
};

const styles: SxProps<Theme> = {
  width: '100%',
  border: 'none',
};
