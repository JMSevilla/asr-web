import { Search } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { useState } from 'react';
import { FilterProps } from 'react-table';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { Input } from '../../form';

export function DefaultColumnFilter<T extends Record<string, unknown>>({
  column: { id },
  onChange,
  filterValue = '',
  labelPrefix = '',
}: FilterProps<T>) {
  const { labelByKey } = useGlobalsContext();
  const [value, setValue] = useState(filterValue);

  return (
    <Input
      name={id}
      value={value}
      onChange={handleChange}
      placeholder={labelByKey(`${labelPrefix}search_by_keyword`)}
      inputProps={{ maxLength: 60 }}
      startAdornment={
        <InputAdornment position="start">
          <Search sx={{ color: 'common.black' }} />
        </InputAdornment>
      }
    />
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
    onChange({ id, value: event.target.value ?? '' });
  }
}
