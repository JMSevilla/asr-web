import { CheckboxProps, FormControlLabel } from '@mui/material';
import { ForwardedRef, forwardRef } from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Path,
  UnpackNestedValue,
} from 'react-hook-form';
import { Checkbox } from '../';

interface Props<T extends object> {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  label?: string | JSX.Element;
  topPosition?: boolean;
  disabled?: boolean;
  onValueChange?(checked: boolean): void;
}

type ComponentProps<T extends object> = Pick<CheckboxProps, 'checked' | 'disabled' | 'color' | 'inputProps' | 'sx'> &
  Omit<ControllerRenderProps<T, Path<T>>, 'onChange' | 'onBlur'> & {
    label?: string | JSX.Element;
    topPosition?: boolean;
    onBlur?(): void;
    onChange(checked: boolean): void;
    onValueChange?(checked: boolean): void;
  };

export const CheckboxField = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  label,
  topPosition,
  disabled,
  onValueChange,
}: Props<T>) => (
  <Controller<T>
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field }) => (
      <CheckboxComponent<T>
        label={label}
        topPosition={topPosition}
        disabled={disabled}
        onValueChange={onValueChange}
        {...field}
      />
    )}
  />
);

export const CheckboxComponent = forwardRef(function Component<T extends object>(
  { label, topPosition, onChange, onValueChange, value, ...props }: Omit<ComponentProps<T>, 'ref'>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <FormControlLabel
      label={label}
      htmlFor={props.name}
      sx={{
        '& .html-container > *': { marginBlockEnd: 0 },
        marginRight: 2,
        marginLeft: 0,
        '.MuiCheckbox-root': { margin: 0, padding: 0, paddingRight: 4 },
        ...(topPosition ? { alignItems: 'flex-start' } : {}),
      }}
      control={<Checkbox {...props} value={!!value} checked={!!value} ref={ref} onChange={handleChange} />}
    />
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onValueChange?.(event.target.checked);
    onChange(event.target.checked);
  }
});
