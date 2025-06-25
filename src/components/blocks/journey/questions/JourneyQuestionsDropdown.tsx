import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { Answer } from './types';

interface Props {
  answers: Answer[];
  value: string;
  loading: boolean;
  label?: string;
  placeholder?: string;
  onChange(event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, value: string): void;
}

export const JourneyQuestionsDropdown: React.FC<Props> = ({
  answers,
  value,
  loading,
  label,
  placeholder,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const wasFocused = useRef(false);

  return (
    <Box width={372} maxWidth="100%">
      {label && !label.includes && (
        <Box mb={2}>
          <Typography component="label">{label}</Typography>
        </Box>
      )}
      <FormControl sx={{ width: '100%' }}>
        {!value && placeholder && !placeholder.includes('[[') && (
          <InputLabel
            shrink={false}
            sx={{
              color: theme => theme.palette.appColors.essential[300] + ' !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {placeholder}
          </InputLabel>
        )}
        <Select
          data-testid="journey-options-dropdown"
          fullWidth
          open={open}
          defaultOpen={false}
          color="primary"
          labelId="journey-question"
          inputProps={{ shrink: 'false' }}
          IconComponent={KeyboardArrowDown}
          value={value}
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
          disabled={loading}
        >
          {answers.map(answer => (
            <MenuItem key={answer.answerKey} value={answer.answerKey} role="option">
              {answer.answer}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  function handleChange(event: SelectChangeEvent<string>) {
    if (loading) return;
    onChange(event, event.target.value);
  }
};
