import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { InputLoader } from '../../..';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';

interface Props {
  selectedAge?: number;
  options: number[];
  onChanged(age: number): void;
  loading?: boolean;
}

export const RetirementAgeInput: React.FC<Props> = ({ selectedAge, options, onChanged, loading }) => {
  const { labelByKey } = useGlobalsContext();
  const [value, setValue] = useState<number>();
  const [open, setOpen] = useState(false);
  const wasFocused = useRef(false);

  useEffect(() => {
    setValue(selectedAge);
  }, [selectedAge]);

  return (
    <Box width={140} data-testid="retirement-age">
      <Box mb={2}>
        <Typography component={InputLabel} id="retirement-age" color="text.primary">
          {labelByKey('options_age_picker')}
        </Typography>
      </Box>
      {loading || !selectedAge ? (
        <InputLoader />
      ) : (
        <Select
          fullWidth
          open={open}
          data-testid="retirement-age-input"
          color="primary"
          defaultOpen={false}
          labelId="retirement-age"
          inputProps={{ shrink: 'false' }}
          IconComponent={KeyboardArrowDown}
          title={labelByKey('options_age_picker')}
          value={value ?? options[options.length - 1]}
          onChange={handleChange}
          onFocus={() => {
            if (!open && !wasFocused.current) {
              wasFocused.current = true;
              setOpen(true);
            }
          }}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onBlur={() => (wasFocused.current = false)}
          MenuProps={{ sx: { maxHeight: 230 } }}
        >
          {options.map(age => (
            <MenuItem key={age} value={age} role="option">
              {age}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  );

  function handleChange(event: SelectChangeEvent<number>) {
    const age = +event.target.value;

    setValue(age);
    onChanged(age);
  }
};
