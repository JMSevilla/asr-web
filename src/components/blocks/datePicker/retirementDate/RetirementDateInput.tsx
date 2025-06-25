import { DesktopDatePicker } from '@mui/lab';
import { Box, CircularProgress, IconButtonProps, InputLabel, TextField, Typography } from '@mui/material';
import { isBefore, subDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { InputLoader } from '../../..';
import { formatDate, isValidDate } from '../../../../business/dates';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';

interface Props {
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  shouldDisableDate?: (date: Date) => boolean;
  displayEmpty?: boolean;
  loading: boolean;
  onChanged(date: Date | undefined): void;
}

export const RetirementDateInput: React.FC<Props> = ({
  selectedDate,
  minDate,
  maxDate,
  displayEmpty,
  loading,
  onChanged,
  shouldDisableDate,
}) => {
  const { labelByKey } = useGlobalsContext();
  const [value, setValue] = useState<Date | undefined>(selectedDate);
  const [lastValidSelectedDate, setLastValidSelectedDate] = useState<Date>();
  const [displayedCalendarOfDate, setDisplayedCalendarOfDate] = useState(selectedDate);
  const popperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldPreventDateUpdate = useRef(false);

  useEffect(() => {
    if (selectedDate) {
      setValue(selectedDate);
      setLastValidSelectedDate(selectedDate);
      setDisplayedCalendarOfDate(selectedDate);
    }
  }, [selectedDate?.toUTCString()]);

  return (
    <Box width={220}>
      <Box mb={2}>
        <Typography component={InputLabel} htmlFor="retirement-date" color="text.primary">
          {labelByKey('options_date_picker')}
        </Typography>
      </Box>
      {loading ? (
        <InputLoader />
      ) : (
        <DesktopDatePicker
          loading={loading}
          inputFormat="dd-MM-yyyy"
          value={displayEmpty ? value || null : value}
          mask="__-__-____"
          disabled={displayEmpty ? false : !selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          shouldDisableDate={shouldDisableDate}
          allowSameDateSelection
          renderLoading={() => <CircularProgress color="primary" />}
          onChange={handleChange}
          onAccept={handleAccept}
          defaultCalendarMonth={minDate}
          onOpen={() => {
            shouldPreventDateUpdate.current = true;
            setTimeout(addMissingAriaProps, 200);
          }}
          onYearChange={() => {
            shouldPreventDateUpdate.current = false;
            setTimeout(enableTabNavigationOnDays, 200);
            setTimeout(addMissingAriaProps, 200);
          }}
          onMonthChange={date => {
            setDisplayedCalendarOfDate(date);
            setTimeout(enableTabNavigationOnDays, 200);
            setTimeout(addMissingAriaProps, 200);
          }}
          getOpenDialogAriaText={date => (date && formatDate(date, 'dd-MM-yyyy')) || ''}
          onClose={handleSubmit}
          inputRef={inputRef}
          OpenPickerButtonProps={
            {
              'aria-label': labelByKey('options_date_picker_icon_aria'),
              'data-testid': 'calendar-view-button',
            } as Partial<IconButtonProps<'button', {}>>
          }
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
              color="primary"
              data-testid="retirement-date-input"
              title={labelByKey('options_date_picker')}
              sx={{
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
              }}
              onBlur={handleSubmit}
              onKeyDown={e => e.key === 'Enter' && inputRef.current?.blur()}
              inputProps={{
                ...params.inputProps,
                placeholder: 'DD - MM - YYYY',
              }}
            />
          )}
        />
      )}
    </Box>
  );

  function handleSubmit() {
    if (!lastValidSelectedDate && !displayEmpty) {
      return;
    }

    if (lastValidSelectedDate) {
      setValue(lastValidSelectedDate);
      !shouldPreventDateUpdate.current && onChanged(lastValidSelectedDate);
    }

    shouldPreventDateUpdate.current = false;
  }

  function handleAccept(acceptedDate: Date | null) {
    if (!acceptedDate || !dateAcceptable(acceptedDate)) {
      return;
    }

    setValue(acceptedDate);
    setLastValidSelectedDate(acceptedDate);
    !shouldPreventDateUpdate.current && onChanged(acceptedDate);
  }

  function handleChange(date: Date | null) {
    const inputDate = date || undefined;
    if (displayEmpty) {
      setValue(inputDate);

      if (!inputDate) {
        setLastValidSelectedDate(undefined);
        onChanged(undefined);
        return;
      }

      if (dateAcceptable(inputDate)) {
        setLastValidSelectedDate(inputDate);
        onChanged(inputDate);
      }
    } else {
      if (!inputDate) {
        return;
      }

      setValue(inputDate);

      if (minDate && maxDate && dateAcceptable(inputDate)) {
        setLastValidSelectedDate(inputDate);
      }

      if (shouldDisableDate && isValidDate(inputDate)) {
        setLastValidSelectedDate(inputDate);
        onChanged(inputDate);
      }
    }
  }

  function dateAcceptable(date: Date) {
    return isValidDate(date) && minDate && subDays(minDate, 1) <= date && maxDate && !isBefore(maxDate, date);
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
