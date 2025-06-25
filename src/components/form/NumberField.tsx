import { Grid, OutlinedInputProps, Typography } from '@mui/material';
import { FocusEvent, useState } from 'react';
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Path,
  UnpackNestedValue,
} from 'react-hook-form';
import NumberFormat, { NumberFormatPropsBase } from 'react-number-format';
import { Input } from '.';
import { InputLoader } from '../';
import { CmsTooltip } from '../../cms/types';
import { ErrorTooltip } from '../ErrorTooltip';
import { Tooltip } from '../Tooltip';
import { FieldError } from './index';

interface Props<T extends object> {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  label?: string | JSX.Element;
  color?: OutlinedInputProps['color'];
  type?: OutlinedInputProps['type'];
  startAdornment?: OutlinedInputProps['startAdornment'];
  placeholder?: OutlinedInputProps['placeholder'];
  tooltip?: CmsTooltip;
  errorTooltip?: CmsTooltip;
  isLoading?: boolean;
  decimalScale?: number;
  allowLeadingZeros?: boolean;
  thousandSeparator?: boolean;
  format?: string;
  mask?: string | string[];
  onFocus?: OutlinedInputProps['onFocus'];
  onBlur?: OutlinedInputProps['onBlur'];
  onEnter?(): void;
  prefix?: string;
  suffix?: string;
  showErrorBelowLabel?: boolean;
  hideLabel?: boolean;
  asStringValue?: boolean;
  isAllowed?: NumberFormatPropsBase<T>['isAllowed'];
  allowEmpty?: boolean;
  boldLabelFirstWord?: boolean;
  fixedDecimalScale?: boolean;
  'data-testid'?: string;
}

export const NumberField = <T extends FieldValues>({ name, control, ...props }: Props<T>) => (
  <Controller<T>
    name={name}
    control={control}
    render={({ formState: _, ...controllerProps }) => <NumberFieldComponent {...controllerProps} {...props} />}
  />
);

interface ComponentProps<T extends object> extends Omit<Props<T>, 'name' | 'control' | 'defaultValue'> {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState?: ControllerFieldState;
  defaultValue?: number;
}

const NumberFieldComponent = <T extends object>({
  label,
  tooltip,
  field: rawField,
  fieldState,
  errorTooltip,
  defaultValue,
  placeholder,
  isLoading,
  decimalScale,
  allowLeadingZeros,
  thousandSeparator,
  format,
  mask,
  onFocus,
  onBlur,
  onEnter,
  showErrorBelowLabel,
  prefix,
  suffix,
  allowEmpty,
  hideLabel = false,
  asStringValue = true,
  isAllowed,
  boldLabelFirstWord,
  fixedDecimalScale,
  ...props
}: ComponentProps<T>) => {
  const field = { ...rawField, inputRef: rawField?.ref, ref: undefined };
  const [isFocused, setIsFocus] = useState(false);
  const showErrorTooltip =
    !hideLabel && isFocused && fieldState?.error?.types && Object.keys(fieldState.error.types).length > 1;
  const hideError = (allowEmpty && field.value === '') || field.value === null;

  return (
    <Grid container spacing={2} direction="column">
      {!hideLabel && <Grid item>{fieldState?.error?.message ? showErrorBelowLabelFn() : renderLabelFn()}</Grid>}

      <Grid item>
        {isLoading ? (
          <InputLoader />
        ) : (
          <ErrorTooltip open={showErrorTooltip} tooltip={errorTooltip}>
            <>
              <NumberFormat
                customInput={Input}
                inputProps={{ id: field?.name, 'data-testid': props?.['data-testid'] ?? field?.name }}
                value={String(field.value)}
                name={field.name}
                onValueChange={values => field.onChange(asStringValue ? values.value : values.floatValue)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                decimalScale={decimalScale}
                thousandSeparator={thousandSeparator}
                allowNegative={false}
                defaultValue={defaultValue}
                placeholder={placeholder}
                prefix={prefix}
                suffix={suffix}
                allowLeadingZeros={allowLeadingZeros}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && onEnter && onEnter()}
                format={format}
                mask={mask}
                isAllowed={isAllowed}
                fixedDecimalScale={fixedDecimalScale}
              />
              {fieldState?.error?.message && !showErrorBelowLabel && !hideError && (
                <FieldError messageKey={fieldState?.error?.message} />
              )}
            </>
          </ErrorTooltip>
        )}
      </Grid>

      {tooltip?.text && (
        <Grid item>
          <Tooltip header={tooltip.header} html={tooltip.html} underlinedText>
            {tooltip.text}
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );

  function handleFocus(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) {
    setIsFocus(true);
    onFocus && onFocus(e);
  }

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) {
    setIsFocus(false);
    onBlur && onBlur(e);
  }

  function renderLabelFn() {
    return (
      <Typography component="label" htmlFor={field?.name} color={fieldState?.error && 'error'}>
        {label ?? '[[label_name]]'}
      </Typography>
    );
  }

  function showErrorBelowLabelFn() {
    if (showErrorBelowLabel && label) {
      return (
        <>
          {renderLabelFn()}
          {!hideError && <FieldError messageKey={fieldState?.error?.message!} />}
        </>
      );
    }

    return renderLabelFn();
  }
};
