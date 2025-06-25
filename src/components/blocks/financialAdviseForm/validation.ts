import { endOfToday, parse, startOfDay, sub } from 'date-fns';
import * as yup from 'yup';
import { ValidationError } from 'yup';
import { formatDate, isValidDate } from '../../../business/dates';
import { defaultDatePickerFormat } from '../../form';

const minimumRawValueLength = 10;
export const maxFinancialAdviseDate = endOfToday();
export const minFinancialAdviseDate = startOfDay(sub(new Date(), { months: 12 }));

const financialAdviseDateSchema = yup
  .date()
  .min(minFinancialAdviseDate, 'financial_advise_date_min')
  .max(maxFinancialAdviseDate, 'financial_advise_date_max')
  .typeError('financial_advise_invalid_format')
  .default(null);

export const financialAdviseFormSchema = yup.object({
  financialAdviseDate: yup
    .string()
    .nullable()
    .test('format', '', (inputValue, context) => {
      const date = inputValue && formatDate(inputValue, defaultDatePickerFormat);

      if (!inputValue || date?.length !== minimumRawValueLength) return false;

      const parsedValue =
        date?.length === minimumRawValueLength ? parse(inputValue, defaultDatePickerFormat, new Date()) : undefined;

      const valueToValidate = isValidDate(parsedValue) ? parsedValue : null;

      try {
        financialAdviseDateSchema.validateSync(valueToValidate);
      } catch (e: unknown) {
        const error = e as ValidationError;

        return context.createError({ message: error.message });
      }

      return true;
    })
    .default(null),
});

export type FinancialAdviseFormType = yup.InferType<typeof financialAdviseFormSchema>;
