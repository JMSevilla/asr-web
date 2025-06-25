import { SxProps, Table, TableBody, TableCell, TableContainer, TableRow, Theme, Typography } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import React, { ReactElement, useRef } from 'react';
import { AnimatedBoxSkeleton, DataTableHeader, DataTableSx, usePanelCardContext } from '../..';
import { ActionColumnCustomizationType } from '../../../api/content/types/page';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { UseDataTableParamsResult } from '../../blocks/dataTable/dataTableV2/hooks';
import { ActionColumnProps } from '../../blocks/dataTable/types';
import { DataTableHead } from './DataTableHead';
import { DataTablePaginatedFooter } from './DataTablePaginatedFooter';
import { DataTableRow } from './DataTableRow';
import { useCardTableRowLimit } from './hooks/useCardTableRowLimit';

interface Props<T> {
  'data-testid'?: string;
  id?: string;
  data: T[];
  sx?: DataTableSx;
  loading?: boolean;
  isRowSelectable?: boolean;
  tableHeaders: DataTableHeader[];
  tableColumns?: UseDataTableParamsResult['columns'];
  pagination?: {
    pageNumber?: number;
    pageSize?: number;
    totalCount: number;
    defaultPageSize: number;
  };
  actionableColumn?: string | null;
  actionableStatus?: string | null;
  actionColumnCustomization?: ActionColumnCustomizationType['values'] | null;
  rowsPerPageOptions?: Array<number | { value: number; label: string }>;
  onRowSelect?(index: number): void;
  selectedRowIndex?: number | null;
  bodyRowComponent?(data: T, key: number, sx?: SxProps<Theme>): ReactElement;
  sortColumn?: string;
  sortAscending?: boolean;
  onSort?: (column: string) => void;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  actionColumn?: ActionColumnProps;
}

export const DataTableV2 = <T extends unknown>({
  id,
  sx,
  data,
  loading,
  isRowSelectable,
  tableHeaders,
  tableColumns,
  bodyRowComponent,
  pagination,
  onPageChange,
  rowsPerPageOptions,
  onRowsPerPageChange,
  onRowSelect,
  selectedRowIndex,
  sortColumn,
  sortAscending,
  onSort,
  actionColumn,
  ...props
}: Props<T>) => {
  const { labelByKey } = useGlobalsContext();
  const lastDataItemsCount = useRef(data.length || pagination?.pageSize || pagination?.defaultPageSize);
  const { isCard } = usePanelCardContext();
  const isEmpty = data.length === 0;
  const evenColumnWidth = tableColumns ? 100 / tableColumns.length : undefined;

  const { containerRef, limitedData } = useCardTableRowLimit<T>({
    isCard,
    data,
    loading,
  });

  if (data.length) {
    lastDataItemsCount.current = limitedData.length;
  }

  return (
    <>
      <TableContainer
        id={id}
        sx={{ overflowX: 'auto', width: '100%' }}
        ref={containerRef}
        data-testid="table-container"
      >
        <Table
          data-testid={props['data-testid']}
          aria-label="data table"
          sx={isCard ? cardTableSxProps : nonCardTableSxProps}
        >
          {!loading && !isEmpty && (
            <DataTableHead
              tableHeaders={tableHeaders}
              sx={sx}
              loading={loading}
              isEmpty={isEmpty}
              sortColumn={sortColumn}
              sortAscending={sortAscending}
              onSort={onSort}
              evenColumnWidth={evenColumnWidth}
            />
          )}
          <TableBody>
            {!isCard &&
              loading &&
              Array.from(Array(lastDataItemsCount.current).keys()).map((key, idx) => (
                <TableRow key={key} sx={sx?.bodyCell?.cell} data-testid={`data-table-loader-row-${idx + 1}`}>
                  <TableCell colSpan={tableHeaders.length}>
                    <AnimatedBoxSkeleton height={26} light={idx % 2 === 1} />
                  </TableCell>
                </TableRow>
              ))}
            {!loading &&
              limitedData.map((row, index) => {
                return (
                  bodyRowComponent?.(row, index, sx?.bodyCell?.cell) ?? (
                    <DataTableRow
                      id={id}
                      key={index}
                      data={row}
                      rowKey={index}
                      tableColumns={tableColumns || []}
                      isRowSelectable={isRowSelectable}
                      selectedRowIndex={selectedRowIndex}
                      evenColumnWidth={evenColumnWidth}
                      onRowSelect={onRowSelect}
                      sx={sx?.bodyCell?.cell}
                      actionColumn={actionColumn}
                    />
                  )
                );
              })}
          </TableBody>
          {pagination && pagination.totalCount > pagination.defaultPageSize && onPageChange && (
            <DataTablePaginatedFooter
              tableHeadersLength={tableHeaders.length}
              pagination={{
                ...pagination,
                pageNumber: pagination?.pageNumber ?? 1,
                pageSize: pagination?.pageSize ?? pagination.defaultPageSize,
              }}
              rowsPerPageOptions={rowsPerPageOptions}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          )}
        </Table>
      </TableContainer>
      {!isCard && !isEmpty && !loading && !!pagination && (
        <Typography variant="body2" fontWeight="bold" py={5}>
          {labelByKey('table_pagination_total_label', { pagination_total: pagination.totalCount.toString() })}
        </Typography>
      )}
    </>
  );
};

const cardTableSxProps: SxProps<Theme> = {
  fontSize: theme => ({
    xs: theme.typography.body2.fontSize,
    md: theme.typography.body1.fontSize,
  }),
  [`&& .${tableCellClasses.root}`]: {
    borderBottomColor: theme => theme.palette.divider,
    py: 0,
  },
  '& th': { height: '48px' },
  '& tr': { height: { xs: '33px', md: '48px' } },
};

const nonCardTableSxProps: SxProps<Theme> = {
  [`& .${tableCellClasses.root}`]: {
    borderBottomColor: theme => theme.palette.divider,
  },
};
