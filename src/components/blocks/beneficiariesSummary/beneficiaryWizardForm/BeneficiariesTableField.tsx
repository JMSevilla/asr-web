import { Grid, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FieldArrayPath } from 'react-hook-form/dist/types';
import { CellProps, Column, Hooks, Row, useTable } from 'react-table';
import { DeleteIcon, EditIcon, ListLoader } from '../../../';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useResolution } from '../../../../core/hooks/useResolution';
import { CheckIcon } from '../../../icons';
import { BeneficiariesFormType, BeneficiaryFormType } from './types';

interface Props extends Record<string, unknown> {
  columns: Column<BeneficiaryFormType>[];
  onRemoveRow?: (row: Row<BeneficiaryFormType>) => void;
  onEditClick?: (row: Row<BeneficiaryFormType>) => void;
  isLoading?: boolean;
  data: BeneficiaryFormType[];
}

interface BeneficiariesTableFieldProps {
  name: FieldArrayPath<BeneficiariesFormType>;
  editable?: boolean;
  columns: Column<BeneficiaryFormType>[];
  onRemoveRow: (row: Row<BeneficiaryFormType>) => void;
  onEditClick: (row: Row<BeneficiaryFormType>) => void;
  isLoading: boolean;
}

export function BeneficiariesTableField({ name, onRemoveRow, onEditClick, ...other }: BeneficiariesTableFieldProps) {
  const { control, watch } = useFormContext<BeneficiariesFormType>();

  const { fields } = useFieldArray<BeneficiariesFormType>({
    control,
    name,
  });

  const watchFieldArray = watch(name);
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  }) as BeneficiaryFormType[];

  return (
    <BeneficiariesTable
      {...other}
      arrayFieldName={name}
      data={controlledFields}
      onEditClick={onEditClick}
      onRemoveRow={onRemoveRow}
    />
  );
}

export function BeneficiariesTable({ data, columns, isLoading, onRemoveRow, onEditClick, editable, ...other }: Props) {
  const { isMobile } = useResolution();
  const { labelByKey } = useGlobalsContext();
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow, visibleColumns } =
    useTable<BeneficiaryFormType>(
      {
        columns,
        data,
        editable,
        ...other,
      },
      (hooks: Hooks<BeneficiaryFormType & Record<string, any>>) => {
        hooks.visibleColumns.push(columns => {
          return [
            ...columns,
            {
              accessor: 'edit',
              Cell: ({ row, editable }: CellProps<BeneficiaryFormType>) =>
                editable && (
                  <Grid container wrap="nowrap" justifyContent="flex-end">
                    <Grid
                      minWidth={24}
                      item
                      pr={6}
                      sx={{ cursor: 'pointer', path: { fill: theme => theme.palette.primary.main } }}
                      onClick={() => onEditClick?.(row)}
                      data-testid={`beneficiaries.${row.index}.edit-btn`}
                    >
                      <EditIcon aria-label="Edit" />
                    </Grid>
                    <Grid
                      item
                      minWidth={17}
                      sx={{ cursor: 'pointer', path: { fill: theme => theme.palette.primary.main } }}
                      onClick={() => onRemoveRow?.(row)}
                      data-testid={`beneficiaries.${row.index}.delete-btn`}
                    >
                      <DeleteIcon aria-label="Delete" />
                    </Grid>
                  </Grid>
                ),
            },
          ];
        });
      },
    );

  return isMobile ? (
    <Table {...getTableProps()} sx={{ borderCollapse: 'collapse' }}>
      <TableBody {...getTableBodyProps()}>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={visibleColumns.length}>
              <ListLoader loadersCount={4} isFullWidth={true} spacing={4} />
            </TableCell>
          </TableRow>
        )}
        {!isLoading &&
          rows.map(row => {
            prepareRow(row);

            return (
              <TableRow {...row.getRowProps()} test-id={row.index} sx={{}}>
                <TableCell
                  colSpan={6}
                  sx={{
                    borderTop: theme => (row.id === '0' ? `1px solid ${theme.palette.appColors.essential['100']}` : ''),
                    borderBottom: theme => `1px solid ${theme.palette.appColors.essential['100']}`,
                    height: 106,
                    padding: 0,
                  }}
                >
                  {row.cells.map(cell => {
                    return (
                      <Grid container py={4}>
                        <Grid item xs={6}>
                          <Typography fontWeight="bold">{cell.render('Header')}</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          justifyContent="flex-end"
                          display="flex"
                          sx={{ textAlign: 'right', wordBreak: 'break-word' }}
                        >
                          {cell.column.id === 'isPensionBeneficiary' &&
                          cell.row.values.isPensionBeneficiary &&
                          !editable ? (
                            <CheckIcon />
                          ) : (
                            cell.render('Cell')
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
      <TableFooter>
        {footerGroups.map(group => (
          <TableRow {...group.getFooterGroupProps()}>
            {group.headers.map((column, index) => (
              <TableCell
                {...column.getFooterProps()}
                rowSpan={index === 2 || index === 0 ? 5 : 0}
                sx={{
                  paddingLeft: 0,
                  textAlign: index === 2 ? 'right' : 'left',
                  display: index > 2 ? 'none' : 'table-cell',
                }}
              >
                <Typography fontWeight="bold" variant="body1" color="black">
                  {column.render('Footer')}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableFooter>
    </Table>
  ) : (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
            {headerGroup.headers.map(column => (
              <TableCell
                {...column.getHeaderProps()}
                sx={{
                  borderBottom: theme => `1px solid ${theme.palette.appColors.essential['100']}`,
                  padding: 6,
                  paddingLeft: 0,
                }}
              >
                {
                  <Typography fontWeight="bold" variant="body1">
                    {column.render('Header')}
                  </Typography>
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        <>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={visibleColumns.length}>
                <ListLoader loadersCount={4} isFullWidth={true} spacing={4} />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && editable && rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                align="left"
                sx={{
                  borderBottom: theme => `1px solid ${theme.palette.appColors.essential['100']}`,
                  height: 106,
                  paddingLeft: 0,
                }}
              >
                <Typography variant="body1" my={6}>
                  {labelByKey('beneficiary_summary_no_data')}
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            rows.map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        colSpan={1}
                        sx={{
                          borderBottom: theme => `1px solid ${theme.palette.appColors.essential['100']}`,
                          height: 106,
                          paddingLeft: 0,
                        }}
                      >
                        {
                          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {cell.render('Cell')}
                          </Typography>
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </>
      </TableBody>
      {rows.length > 0 && (
        <TableFooter>
          {footerGroups.map(group => (
            <TableRow {...group.getFooterGroupProps()}>
              {group.headers.map(column => (
                <TableCell
                  {...column.getFooterProps()}
                  sx={{
                    paddingLeft: 0,
                  }}
                >
                  <Typography fontWeight="bold" variant="body1" color="black">
                    {column.render('Footer')}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      )}
    </Table>
  );
}
