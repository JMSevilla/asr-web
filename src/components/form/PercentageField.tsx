import { OutlinedInputProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldPathValue, FieldValues, Path, UnpackNestedValue } from 'react-hook-form';
import { CmsTooltip } from '../../cms/types';
import { TextFieldComponent } from './TextField';

interface Props<T extends object> {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  label?: string | JSX.Element;
  color?: OutlinedInputProps['color'];
  type?: OutlinedInputProps['type'];
  onFocus?: OutlinedInputProps['onFocus'];
  onBlur?: OutlinedInputProps['onBlur'];
  placeholder?: OutlinedInputProps['placeholder'];
  tooltip?: CmsTooltip;
  errorTooltip?: CmsTooltip;
  isLoading?: boolean;
  disabled?: boolean;
}

export const PercentageField = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  isLoading,
  ...props
}: Props<T>) => (
  <Controller<T>
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ formState: _, ...controllerProps }) => (
      <TextFieldComponent isLoading={isLoading} placeholder="%" {...controllerProps} {...props} />
    )}
  />
);
