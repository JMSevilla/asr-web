import { DesktopDatePicker } from '@mui/lab';
import { CircularProgress, OutlinedInputProps, TextField, Theme } from '@mui/material';
import { BaseTextFieldProps } from '@mui/material/TextField/TextField';
import { SxProps } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';
import { formatDate } from '../../../business/dates';

interface Props {
  id?: string;
  minDate?: Date;
  maxDate?: Date;
  isLoading?: boolean;
  value?: Date | null;
  label?: string;
  buttonAriaLabel?: string;
  onFocus?: OutlinedInputProps['onFocus'];
  onBlur?: OutlinedInputProps['onBlur'];
  disabled?: boolean;
  placeholder?: string;
  inputProps?: BaseTextFieldProps & { 'data-testid'?: string };
  onYearChange?(date: Date | null): void;
  onOpen?(): void;
  onMonthChange?(): void;
  onChange(date: Date | null, rawValue: string | null): void;
  onAccept?(date: Date | null): void;
  onCLose?(): void;
}

export const defaultDatePickerFormat = 'dd-MM-yyyy';
const NUMERIC_REGEX = /^[0-9]+$/;

const defaultDatePickerProps = {
  inputFormat: defaultDatePickerFormat,
  mask: '__-__-____',
  renderLoading: () => <CircularProgress color="primary" />,
  allowSameDateSelection: true
};

export const DatePicker: React.FC<Props> = ({
  id,
  buttonAriaLabel,
  minDate,
  value,
  maxDate,
  isLoading,
  label,
  onChange,
  onCLose,
  onAccept,
  onBlur,
  onFocus,
  onOpen,
  onMonthChange,
  onYearChange,
  disabled,
  placeholder,
  inputProps,
}) => {
  const [displayedCalendarOfDate, setDisplayedCalendarOfDate] = useState(value);
  const popperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setDisplayedCalendarOfDate(value);
    }
  }, [value]);

  return (
    <DesktopDatePicker
      {...defaultDatePickerProps}
      loading={isLoading}
      value={value || null}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
      onAccept={onAccept}
      onChange={(value, raw) => {
        const rawValue = raw ?? (value && formatDate(value, defaultDatePickerProps.inputFormat));
        onChange(value, rawValue!);
      }}
      onOpen={() => {
        onOpen?.();
        setTimeout(addMissingAriaProps, 200);
      }}
      onYearChange={date => {
        onYearChange?.(date);
        setTimeout(enableTabNavigationOnDays, 200);
        setTimeout(addMissingAriaProps, 200);
      }}
      onMonthChange={date => {
        onMonthChange?.();
        setDisplayedCalendarOfDate(date);
        setTimeout(enableTabNavigationOnDays, 200);
        setTimeout(addMissingAriaProps, 200);
      }}
      getOpenDialogAriaText={date => (date && formatDate(date)) || ''}
      onClose={onCLose}
      inputRef={inputRef}
      OpenPickerButtonProps={{ 'aria-label': buttonAriaLabel }}
      componentsProps={{
        leftArrowButton: {
          'aria-controls': 'dateGrid',
          'aria-label': displayedCalendarOfDate ? prevMonthName(displayedCalendarOfDate) : undefined,
        },
        rightArrowButton: {
          'aria-controls': 'dateGrid',
          'aria-label': displayedCalendarOfDate ? nextMonthName(displayedCalendarOfDate) : undefined,
        },
      }}
      PopperProps={{ ref: popperRef, disablePortal: true }}
      renderInput={params => (
        <TextField
          {...params}
          {...inputProps}
          inputProps={{
            ...{ ...params.inputProps, value: value ? params.inputProps?.value : value },
            placeholder: placeholder ?? params.inputProps?.placeholder,
          }}
          id={id}
          color="primary"
          title={label}
          sx={textFieldStyles}
          onFocus={onFocus}
          value={value ? value : null}
          onBlur={onBlur}
          onKeyDown={handleInputKeyPress}
        />
      )}
    />
  );

  function handleInputKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      return inputRef.current?.blur();
    }
    if (e.key.length === 1 && !NUMERIC_REGEX.test(e.key)) {
      e.preventDefault();
    }
  }

  function enableTabNavigationOnDays() {
    const daysButtons = popperRef.current?.querySelectorAll<HTMLButtonElement>(
      'div[role="cell"]  > button:not([disabled])',
    );
    Array.from(daysButtons ?? []).forEach(btn => btn.setAttribute('tabIndex', '0'));
  }

  function addMissingAriaProps() {
    const presentationBox = popperRef.current?.querySelector<HTMLDivElement>('div[role="presentation"]');
    presentationBox?.setAttribute('id', 'monthShowing');
    const calendarGrid = popperRef.current?.querySelector<HTMLDivElement>('div[role="grid"]');
    calendarGrid?.setAttribute('aria-labelledby', 'monthShowing');
    calendarGrid?.setAttribute('aria-controls', 'dateGrid');
    calendarGrid?.setAttribute('aria-live', 'polite');
    calendarGrid?.setAttribute('id', 'dateGrid');
  }
};

const textFieldStyles: SxProps<Theme> = {
  '&:focus': {
    border: theme => `2px solid ${theme.palette.appColors.essential['1000']}`,
    outline: theme => `2px solid ${theme.palette.appColors.ui_rag['Amber.400']}`,
  },
  '.MuiIconButton-root': {
    marginRight: '-6px',
    boxSizing: 'border-box',
    outline: '2px solid transparent',
    border: '2px solid transparent',
    '&:focus svg': {
      borderRadius: 0,
      backgroundColor: 'none',
      border: theme => `2px solid ${theme.palette.appColors.essential['1000']}`,
      outline: theme => `2px solid ${theme.palette.appColors.ui_rag['Amber.400']}`,
    },
  },
  '.Mui_focusVisable': {
    transition: 'none',
  },
  svg: {
    color: 'appColors.primary',
    marginRight: '2px',
  },
};

const prevMonthName = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() === 0 ? 12 : date.getMonth() - 1, date.getMonth()).toLocaleString(
    'en-US',
    { month: 'long' },
  );

const nextMonthName = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() === 0 ? 2 : date.getMonth() + 1, date.getMonth()).toLocaleString(
    'en-US',
    { month: 'long' },
  );
