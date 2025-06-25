import { endOfToday, parse, startOfDay, sub } from 'date-fns';
import * as yup from 'yup';
import { ValidationError } from 'yup';
import { formatDate, isValidDate } from '../../../business/dates';
import { defaultDatePickerFormat } from '../../form';
import { maxFinancialAdviseDate, minFinancialAdviseDate } from '../financialAdviseForm/validation';

const minimumRawValueLength = 10;
export const maxPensionWiseDate = endOfToday();
export const minPensionWiseDate = startOfDay(sub(new Date(), { months: 12 }));

const pensionWiseDateSchema = yup
  .date()
  .min(minFinancialAdviseDate, 'pension_wise_date_min')
  .max(maxFinancialAdviseDate, 'pension_wise_date_max')
  .typeError('pension_wise_date_invalid_format')
  .default(null);

export const pensionWiseFormSchema = yup.object({
  pensionWiseDate: yup
    .string()
    .nullable()
    .test('format', '', (inputValue, context) => {
      const date = inputValue && formatDate(inputValue, defaultDatePickerFormat);

      if (!inputValue || date?.length !== minimumRawValueLength) return false;

      const parsedValue =
        date?.length === minimumRawValueLength ? parse(inputValue, defaultDatePickerFormat, new Date()) : undefined;

      const valueToValidate = isValidDate(parsedValue) ? parsedValue : null;

      try {
        pensionWiseDateSchema.validateSync(valueToValidate);
      } catch (e: unknown) {
        const error = e as ValidationError;

        return context.createError({ message: error.message });
      }

      return true;
    })
    .default(null),
});

export type PensionWiseFormType = yup.InferType<typeof pensionWiseFormSchema>;
