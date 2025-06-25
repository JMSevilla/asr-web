import { ActionColumnCustomizationType, DataTableColumn } from '../../../api/content/types/page';
import { ParsedButtonProps } from '../../../cms/parse-cms';

export interface DataTableProps {
  id: string;
  tableKey?: string;
  sourceUrl?: string;
  paramName?: string;
  pageSize?: number;
  isFunctional?: boolean;
  withLabelPrefix?: boolean;
  columns?: DataTableColumn[];
  defaultOrderingColumn?: string;
  defaultOrderingOrder?: string;
}

export interface ActionColumnProps {
  column?: string | null;
  status?: string | null;
  customization?: ActionColumnCustomizationType['values'] | null;
}
export interface DataTableV2Props {
  id: string;
  tableKey?: string;
  sourceUrl?: string;
  paramName?: string;
  pageSize?: number;
  withLabelPrefix?: boolean;
  columns?: DataTableColumn[];
  defaultOrderingColumn?: string;
  defaultOrderingOrder?: string;
  selectableRows?: boolean;
  buttons?: ParsedButtonProps[];
  actionColumn?: ActionColumnProps;
}

export type DataTableRow = Record<string, string>;

export type DataTableResponse = {
  items?: DataTableRow[];
} & Record<string, DataTableRow[]>;
