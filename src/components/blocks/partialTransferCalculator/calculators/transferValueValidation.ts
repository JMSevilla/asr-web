import * as yup from 'yup';

export const TransferValueSchema = (minimumPartialTransferValue: number, maximumPartialTransferValue: number) =>
  yup.object({
    requestedTransferValue: yup
      .number()
      .min(minimumPartialTransferValue, 'PT_enter_transfer_amount_min_error')
      .max(maximumPartialTransferValue, 'PT_enter_transfer_amount_max_error')
      .required('PT_enter_transfer_amount_mandatory'),
  });

export type TransferValueCalculatorForm = yup.InferType<ReturnType<typeof TransferValueSchema>>;
