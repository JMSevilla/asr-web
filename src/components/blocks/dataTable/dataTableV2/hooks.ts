import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTableColumn } from '../../../../api/content/types/page';
import { NA_SYMBOL } from '../../../../business/constants';
import { currencyValue } from '../../../../business/currency';
import { formatDate } from '../../../../business/dates';
import { formatUrlParameters } from '../../../../business/url';
import { ParsedButtonProps, parseButtonProps } from '../../../../cms/parse-cms';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useTenantContext } from '../../../../core/contexts/TenantContext';
import { useSingleAuthStorage } from '../../../../core/contexts/auth/singleAuth/hooks/useSingleAuthStorage';
import { logger } from '../../../../core/datadog-logs';
import { useApi } from '../../../../core/hooks/useApi';
import { useSessionStorage } from '../../../../core/hooks/useSessionStorage';
import { DataTableHeader } from '../../../table/types';
import { DataTableResponse, DataTableRow } from '../types';
import { PaginatedSortResult, usePaginatedSort } from './reducer';

export type UseDataTableParamsParams = {
  sourceUrl: string;
  paramName: string;
  pageSize?: number;
  columns: DataTableColumn[];
  withLabelPrefix: boolean;
  tableKey: string;
  defaultOrderingColumn?: string;
  defaultOrderingOrder?: string;
};

type CachedDataTableRow = {
  [key: string]: DataTableRow;
};

export type UseDataTableParamsResult = {
  columns: {
    name: string;
    dataField?: string;
    align?: DataTableHeader['align'];
    width?: DataTableHeader['width'];
    parseValue: (row?: DataTableRow) => string;
    originalValue: (row?: DataTableRow) => string;
    sort?: {
      sorted: boolean;
      ascending: boolean;
      onClick: () => void;
    };
    actionButton?: ParsedButtonProps;
  }[];
  paginatedSort: PaginatedSortResult;
  rows: DataTableRow[];
  loading: boolean;
  totalRows: number;
  selectedRowIndex: number | null;
  setSelectedRowIndex: (index: number | null) => void;
  selectedRowData: DataTableRow | null;
};

export const useCachedDataTableRow = () => useSessionStorage<CachedDataTableRow>('dataTableRef', {});

export const useCachedSelectedRow = () => useSessionStorage<DataTableRow | undefined>('selectedRow', undefined);

export const DEFAULT_PAGE_SIZE = 10;

export const useDataTableParams = (params: Partial<UseDataTableParamsParams>): UseDataTableParamsResult => {
  const { tenant } = useTenantContext();
  const { labelByKey } = useGlobalsContext();
  const [submittedRow] = useCachedDataTableRow();

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<DataTableRow | null>(null);

  const initializationComplete = useRef(false);

  const paginatedSort = usePaginatedSort(
    params.columns || [],
    params.pageSize || DEFAULT_PAGE_SIZE,
    params.defaultOrderingColumn,
    params.defaultOrderingOrder,
  );

  const dataSource = useDataSource({ ...params, tenantUrl: tenant.tenantUrl.value });

  const columns =
    params.columns?.map(col => ({
      name: col.header?.value,
      dataField: col.dataField?.value,
      align: (col.alignment.value?.selection.toLowerCase() as DataTableHeader['align']) || 'left',
      width: col.widthPercentage?.value ? `${col.widthPercentage.value}%` : undefined,
      parseValue: rowValue(col, labelByKey, params.tableKey, params.withLabelPrefix),
      originalValue: rowOriginalValue(col),
      sort: col.enableSortability?.value
        ? {
          sorted: Boolean(
            paginatedSort.sortBy === col.header?.value ||
            (params.defaultOrderingColumn && col.dataField?.value === params.defaultOrderingColumn),
          ),
          ascending: paginatedSort.ascending,
          onClick: () => paginatedSort.sort(col.header?.value || ''),
        }
        : undefined,
      actionButton: col.actionButton?.value?.elements
        ? { ...parseButtonProps(col.actionButton?.value?.elements) }
        : undefined,
    })) || [];

  // Sorting Logic
  const sortedRows = useMemo(() => {
    if (!paginatedSort.sortBy) return dataSource.result || [];

    const column = columns.find(col => col.name === paginatedSort.sortBy);
    if (!column || !column.dataField) return dataSource.result || [];

    return [...(dataSource.result || [])].sort((a, b) => {
      const aValue = a[column.dataField];
      const bValue = b[column.dataField];

      // Handle null/undefined values. Null goes first for ascending, last for descending
      if (aValue == null) return paginatedSort.ascending ? -1 : 1;
      if (bValue == null) return paginatedSort.ascending ? 1 : -1;

      const isDate = (value: unknown): value is string => {
        if (typeof value !== 'string') return false;
        return !isNaN(Date.parse(value));
      };

      // Handle dates
      if (isDate(aValue) && isDate(bValue)) {
        return paginatedSort.ascending
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return paginatedSort.ascending ? aValue - bValue : bValue - aValue;
      }

      // Handle strings
      return paginatedSort.ascending
        ? String(aValue).localeCompare(String(bValue), undefined, { numeric: true })
        : String(bValue).localeCompare(String(aValue), undefined, { numeric: true });
    });
  }, [dataSource.result, paginatedSort.sortBy, paginatedSort.ascending, params.columns]);

  // Pagination (after sorting)
  const startIndex = (paginatedSort.pageNumber - 1) * paginatedSort.pageSize;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + paginatedSort.pageSize);

  // Handle session storage data on initial load
  useEffect(() => {
    if (
      initializationComplete.current ||
      !dataSource.result ||
      dataSource.result.length === 0 ||
      dataSource.loading ||
      !params.tableKey
    ) {
      return;
    }

    try {
      const selectedData = submittedRow[params.tableKey];

      if (!selectedData) {
        initializationComplete.current = true;
        return;
      }

      // Find matching row in the full dataset
      const selectedRowIndex = sortedRows.findIndex(row => {
        return Object.entries(selectedData).every(([key, value]) => {
          return row[key] === value;
        });
      });

      if (selectedRowIndex >= 0) {
        setSelectedRowData(sortedRows[selectedRowIndex]);

        // Calculate which page contains this row
        const targetPage = Math.floor(selectedRowIndex / paginatedSort.pageSize) + 1;

        // Go to that page
        if (targetPage !== paginatedSort.pageNumber) {
          paginatedSort.setPage(targetPage);
        }
      }
    } catch (error) {
      logger.error('Error processing session storage data:', error as object);
    } finally {
      initializationComplete.current = true;
    }
  }, [dataSource.result, dataSource.loading, params.tableKey, sortedRows, paginatedSort]);

  // Update selectedRowIndex based on the current page and selectedRowData
  useEffect(() => {
    if (selectedRowData) {
      const indexOnCurrentPage = paginatedRows.findIndex(row => {
        return Object.keys(selectedRowData).every(key => selectedRowData[key] === row[key]);
      });

      setSelectedRowIndex(indexOnCurrentPage >= 0 ? indexOnCurrentPage : null);
    }
  }, [paginatedRows, selectedRowData]);

  // Keep selected row visible if user changes sort
  useEffect(() => {
    if (selectedRowData) {
      const globalIndex = sortedRows.findIndex(row => {
        return Object.keys(selectedRowData).every(key => selectedRowData[key] === row[key]);
      });

      if (globalIndex >= 0) {
        const targetPage = Math.floor(globalIndex / paginatedSort.pageSize) + 1;

        if (targetPage !== paginatedSort.pageNumber) {
          paginatedSort.setPage(targetPage);
        }
      }
    }
  }, [sortedRows, selectedRowData, paginatedSort.sortBy, paginatedSort.ascending]);

  const handleRowSelect = (index: number | null) => {
    setSelectedRowIndex(index);

    if (index !== null && index >= 0 && index < paginatedRows.length) {
      setSelectedRowData(paginatedRows[index]);
    } else {
      setSelectedRowData(null);
    }
  };

  return {
    columns,
    paginatedSort,
    rows: paginatedRows,
    totalRows: sortedRows.length,
    loading: dataSource.loading,
    selectedRowIndex,
    selectedRowData,
    setSelectedRowIndex: handleRowSelect,
  };
};

const useDataSource = ({
  sourceUrl,
  paramName,
  tenantUrl,
}: Partial<UseDataTableParamsParams & { tenantUrl: string }>) =>
  useApi(
    async api => {
      if (!sourceUrl) return Promise.reject();

      const [url] = sourceUrl?.split('?') ?? [];
      const urlParams = formatUrlParameters(sourceUrl);

      const result = await api.mdp.dataSummary<DataTableResponse>(url, {
        tenantUrl,
        ...urlParams,
      });

      return paramName && result.data[paramName] ? result.data[paramName] : result.data.items || [];
    },
    [sourceUrl, paramName],
  );

function rowValue(
  col: DataTableColumn,
  labelByKey: (key: string) => string,
  tableKey?: string,
  withLabelPrefix?: boolean,
) {
  const fieldName = col.dataField.value?.toLowerCase();
  const format = col.dataFormat.value?.selection;

  return (row?: DataTableRow): string => {
    const formattedRow = Object.entries(row || {}).reduce<DataTableRow>(
      (prev, [key, val]) => ({ ...prev, [key.toLowerCase()]: val }),
      {},
    );
    const value = formattedRow[fieldName?.toLowerCase()];

    if (value === undefined || value === null || value === '') {
      return NA_SYMBOL;
    }
    if (format === 'Currency') {
      return `${labelByKey('currency:GBP')}${currencyValue(value)}`;
    }
    if (format === 'Date' && value) {
      return formatDate(value);
    }
    return withLabelPrefix && format === 'Label' ? labelByKey(`${tableKey}_${value}`) : value;
  };
}

function rowOriginalValue(col: DataTableColumn) {
  const fieldName = col.dataField.value?.toLowerCase();

  return (row?: DataTableRow): string => {
    const formattedRow = Object.entries(row || {}).reduce<DataTableRow>(
      (prev, [key, val]) => ({ ...prev, [key.toLowerCase()]: val }),
      {},
    );
    return formattedRow[fieldName.toLowerCase()];
  };
}
