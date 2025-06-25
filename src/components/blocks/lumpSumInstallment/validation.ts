import { isAfter, isBefore, isEqual, isSameYear } from 'date-fns';
import * as yup from 'yup';
import { getNextTaxDate } from '../../../business/dates';

interface Options {
  prefix: string;
  maxLumpSum: number;
  retirementDate: Date;
  minDate: Date;
  maxDate: Date;
}

export const changeLumpSumSchema = ({ prefix, maxLumpSum, retirementDate, minDate, maxDate }: Options) =>
  yup.object({
    firstPaymentAmount: yup
      .number()
      .typeError(`${prefix}_only_digits`)
      .min(0.01, `${prefix}_low_amount_error`)
      .max(maxLumpSum, `${prefix}_high_amount_error`)
      .required(`${prefix}_mandatory`),
    secondPaymentDate: yup
      .date()
      .typeError(`${prefix}_invalid_date`)
      .min(minDate, `${prefix}_invalid_min_date`)
      .max(maxDate, `${prefix}_invalid_max_date`)
      .default(getDefaultDateFromMinMax(retirementDate, minDate, maxDate)),
  });

export type ChangeLumpSumForm = yup.InferType<ReturnType<typeof changeLumpSumSchema>>;

export function getDefaultDateFromMinMax(retirementDate: Date, minDate: Date, maxDate: Date) {
  const defaultPaymentDate =
    isSameYear(retirementDate, maxDate) && (isBefore(retirementDate, maxDate) || isEqual(retirementDate, maxDate))
      ? getNextTaxDate(false)
      : getNextTaxDate();

  if (isBefore(defaultPaymentDate, minDate) || isEqual(defaultPaymentDate, minDate)) {
    return minDate;
  }

  if (isAfter(defaultPaymentDate, maxDate) || isEqual(defaultPaymentDate, maxDate)) {
    return maxDate;
  }

  return defaultPaymentDate;
}
