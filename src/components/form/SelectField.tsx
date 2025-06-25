import { KeyboardArrowDown } from '@mui/icons-material';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { SelectProps } from '@mui/material/Select/Select';
import { useState } from 'react';
import { Control, Controller, ControllerFieldState, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { FieldError, InputLoader } from '../';
import { CmsTooltip } from '../../cms/types';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props<T extends object> extends SelectProps {
  name: Path<T>;
  control: Control<T, object>;
  tooltip?: CmsTooltip;
  isLoading?: boolean;
  'data-testid'?: string;
  label?: string | JSX.Element;
  options?: SelectOption[];
}

export const SelectField = <T extends FieldValues>({ name, control, ...props }: Props<T>) => (
  <Controller<T>
    name={name}
    control={control}
    render={({ formState: _, ...controllerProps }) => <SelectComponent {...controllerProps} {...props} />}
  />
);

interface ComponentProps<T extends FieldValues> extends Omit<Props<T>, 'name' | 'control' | 'defaultValue'> {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState?: ControllerFieldState;
}

const SelectComponent = <T extends FieldValues>({
  isLoading,
  field,
  fieldState,
  label,
  options = [],
  ...props
}: ComponentProps<T>) => {
  const [ref, setRef] = useState<HTMLInputElement | null>(null);
  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        {fieldState?.error?.message ? (
          <FieldError messageKey={fieldState.error.message} />
        ) : (
          <Typography component="label" htmlFor={field?.name}>
            {label ?? '[[label_name]]'}
          </Typography>
        )}
      </Grid>
      <Grid item>
        {isLoading ? (
          <InputLoader />
        ) : (
          <FormControl sx={{ width: '100%' }}>
            {!field.value && (
              <InputLabel
                shrink={false}
                sx={{
                  color: theme => theme.palette.appColors.essential[300] + ' !important',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: ref?.clientWidth ? ref.clientWidth - 46 : '100%',
                }}
              >
                {props.placeholder}
              </InputLabel>
            )}
            <Select
              {...props}
              {...field}
              fullWidth
              ref={setRef}
              color="primary"
              value={field.value ?? ''}
              data-testid={props['data-testid'] || `${field.name}-field`}
              IconComponent={KeyboardArrowDown}
              onChange={e => field.onChange(e.target.value)}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={`${option.label}_${index}`}
                  value={option.value}
                  selected={option.value == field.value}
                  id={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>
    </Grid>
  );
};
