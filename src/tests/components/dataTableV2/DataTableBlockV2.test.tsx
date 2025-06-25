import '@testing-library/jest-dom';
import { usePanelCardContext } from '../../../components/Card';
import { DataTableBlockV2 } from '../../../components/blocks/dataTable/dataTableV2/DataTableBlockV2';
import {
  useCachedDataTableRow,
  useCachedSelectedRow,
  useDataTableParams,
} from '../../../components/blocks/dataTable/dataTableV2/hooks';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { cleanup, fireEvent, render, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../components/blocks/dataTable/dataTableV2/hooks', () => ({
  useDataTableParams: jest.fn(),
  useCachedDataTableRow: jest.fn(),
  useCachedSelectedRow: jest.fn(),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

jest.mock('../../../components/Card', () => ({
  usePanelCardContext: jest.fn(),
}));

const setCachedRowMock = jest.fn();
const setCachedSelectionMock = jest.fn();
const clearCachedSelectionMock = jest.fn();
const setSelectedRowIndexMock = jest.fn();
const sortMock = jest.fn();
const setPageMock = jest.fn();
const setPageSizeMock = jest.fn();

let formSubmissionCallback: (() => void) | undefined;

beforeEach(() => {
  jest.clearAllMocks();

  (useDataTableParams as jest.Mock).mockReturnValue({
    rows: [{ id: 1, name: 'Test Row' }],
    loading: false,
    columns: [
      { name: 'Column 1', align: 'left', width: '50%', parseValue: (row: any) => row.name },
      { name: 'Column 2', align: 'left', width: '50%', parseValue: () => 'Static Value' },
    ],
    selectedRowData: { id: 1, name: 'Test Row' },
    selectedRowIndex: undefined,
    setSelectedRowIndex: setSelectedRowIndexMock,
    totalRows: 1,
    paginatedSort: {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'Column 1',
      ascending: true,
      sort: sortMock,
      setPage: setPageMock,
      setPageSize: setPageSizeMock,
    },
  });

  (useCachedDataTableRow as jest.Mock).mockReturnValue([null, setCachedRowMock]);
  (useCachedSelectedRow as jest.Mock).mockReturnValue([null, setCachedSelectionMock, clearCachedSelectionMock]);

  (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
    formSubmissionCallback = cb;
  });

  (usePanelCardContext as jest.Mock).mockReturnValue({ isCard: false });
});

afterEach(cleanup);

describe('DataTableBlockV2', () => {
  const defaultProps = {
    id: 'test-data-table-block',
    tableKey: 'testTable',
    sourceUrl: 'source',
    paramName: 'list',
    columns: [],
    pageSize: 10,
    withLabelPrefix: false,
    defaultOrderingColumn: 'Column 1',
    defaultOrderingOrder: 'asc',
    selectableRows: true,
  };

  it('renders DataTableBlockV2 with correct test id', () => {
    (usePanelCardContext as jest.Mock).mockReturnValue({ isCard: false });
    render(<DataTableBlockV2 {...defaultProps} />);
    expect(screen.getByTestId('test-data-table-block')).toBeInTheDocument();
  });

  it('triggers handleRowSelect when a row is clicked', () => {
    render(<DataTableBlockV2 {...defaultProps} />);
    const row = screen.getByTestId('data-table-row-0');
    fireEvent.click(row);
    expect(setSelectedRowIndexMock).toHaveBeenCalledWith(0);
    expect(setCachedSelectionMock).toHaveBeenCalledWith({ id: 1, name: 'Test Row' });
  });

  it('triggers handleRowSubmit via form submission binding hook', () => {
    render(<DataTableBlockV2 {...defaultProps} />);
    if (formSubmissionCallback) {
      formSubmissionCallback();
    }
    expect(setCachedRowMock).toHaveBeenCalledWith({ testTable: { id: 1, name: 'Test Row' } });
    expect(clearCachedSelectionMock).toHaveBeenCalled();
  });

  it('clears cached selection on unmount', () => {
    const { unmount } = render(<DataTableBlockV2 {...defaultProps} />);
    unmount();
    expect(clearCachedSelectionMock).toHaveBeenCalled();
  });
});
