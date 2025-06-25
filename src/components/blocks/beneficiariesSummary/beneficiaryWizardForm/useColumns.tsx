import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { FieldArrayPath, UseFormReturn } from 'react-hook-form';
import { CellProps, Column, TableInstance } from 'react-table';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { CheckboxField, NumberField } from '../../../form';
import { BeneficiariesFormType, BeneficiaryFormType } from './types';

type TableCellProps = CellProps<BeneficiaryFormType & { id: string }> & {
  arrayFieldName: FieldArrayPath<BeneficiariesFormType>;
};

export function useBeneficiariesSummaryFormColumns(
  beneficiaries: BeneficiaryFormType[],
  form?: UseFormReturn<BeneficiariesFormType>,
) {
  const { labelByKey } = useGlobalsContext();

  return useMemo(
    () =>
      [
        {
          Header: labelByKey('benef_summary_name'),
          accessor: (item: BeneficiaryFormType) =>
            item.relationship === 'Charity'
              ? item?.charityName ?? ''
              : [item?.forenames, item?.surname].filter(Boolean).join(' '),
          Footer: () => {
            return <>{labelByKey('benef_summary_total')} </>;
          },
        },
        {
          Header: labelByKey('benef_summary'),
          accessor: 'relationship',
        },
        {
          Header: labelByKey('benef_summary_lumpsum'),
          accessor: 'lumpSumPercentage',
          Cell: ({ row, editable, arrayFieldName }: TableCellProps) =>
            editable ? (
              <Box width={85} height={54}>
                <NumberField
                  key={row.original.id as string}
                  name={`${arrayFieldName}.${row.index}.lumpSumPercentage`}
                  control={form?.control!}
                  allowLeadingZeros={true}
                  decimalScale={2}
                  suffix="%"
                  isAllowed={({ floatValue }) => (0 <= floatValue! && floatValue! <= 100) || floatValue === undefined}
                  hideLabel
                  defaultValue={0}
                  onBlur={e => {
                    if (!e.target.value) {
                      const values = form?.getValues('beneficiaries');
                      const updatedValues =
                        values?.map(value =>
                          value.id === row.original.id || value.valueId === row.original.valueId
                            ? { ...value, lumpSumPercentage: 0 }
                            : { ...value },
                        ) ?? [];

                      form?.setValue('beneficiaries', updatedValues);
                    }
                  }}
                />
              </Box>
            ) : (
              `${row.values.lumpSumPercentage}%`
            ),
          Footer: (info: TableInstance<BeneficiaryFormType>) => {
            const total = info.data.reduce((sum: number, data: BeneficiaryFormType) => {
              const lumpSum = data?.lumpSumPercentage ? parseFloat(data.lumpSumPercentage.toString()) : 0;
              return lumpSum + sum;
            }, 0);

            return (
              info.data.length > 0 && (
                <Typography
                  fontWeight={700}
                  pl={info.editable ? 4 : 0}
                  sx={{
                    color: info.data.length && parseFloat(total.toFixed(2)) !== 100 ? 'error.main' : 'common.black',
                  }}
                >
                  {total.toFixed(2)}%
                </Typography>
              )
            );
          },
        },
        {
          Header: labelByKey('benef_summary_pension'),
          accessor: 'isPensionBeneficiary',
          Cell: ({ row, update, arrayFieldName, editable, ...other }: TableCellProps) => {
            if (editable && row.original.relationship !== 'Charity') {
              return (
                <CheckboxField
                  key={row.original.id as string}
                  onValueChange={() => resetIsPensionCheckboxes({ arrayFieldName, row, ...other }, form)}
                  control={form?.control!}
                  name={`${arrayFieldName}.${row.index}.isPensionBeneficiary`}
                />
              );
            }
            if (row.values.isPensionBeneficiary) return labelByKey('yes');
            return '';
          },
        },
      ] as Column<BeneficiaryFormType>[],
    [beneficiaries],
  );
}

function resetIsPensionCheckboxes(
  { arrayFieldName, data }: TableCellProps,
  form?: UseFormReturn<BeneficiariesFormType>,
) {
  data?.forEach((v: BeneficiaryFormType, i: number) => {
    form?.setValue(`${arrayFieldName}.${i}.isPensionBeneficiary`, false);
  });
}
