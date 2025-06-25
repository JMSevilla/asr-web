import '@testing-library/jest-dom';
import { DataTableV2 } from '../../../components/table/data-table/DataTableV2';
import { fireEvent, render, screen, within } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useResolution', () => ({
  useResolution: () => ({
    isMobile: false,
  }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../components', () => ({
  AnimatedBoxSkeleton: (props: any) => <div data-testid="animated-skeleton" style={{ height: props.height }} />,
  usePanelCardContext: () => ({ isCard: false }),
  ParsedHtml: ({ html }: { html: string }) => <div data-testid="parsed-html">{html}</div>,
  DataTableHead: jest.fn(),
}));

describe('DataTableV2', () => {
  const mockData = [
    {
      referenceNumber: '0126501',
      dateJoinedScheme: '2019-01-02',
    },
    {
      referenceNumber: '0126519',
      dateJoinedScheme: '2019-01-02',
    },
    {
      referenceNumber: '0126507',
      dateJoinedScheme: '2019-01-01',
    },
  ];

  const mockTableHeaders = [
    {
      name: 'Reference No.',
      dataField: 'referenceNumber',
      align: 'center' as const,
      sort: {
        sorted: false,
        ascending: false,
        onClick: jest.fn(),
      },
    },
    {
      name: 'Date joined',
      dataField: 'dateJoinedScheme',
      align: 'left' as const,
      sort: {
        sorted: true,
        ascending: false,
        onClick: jest.fn(),
      },
    },
  ];

  const mockTableColumns = [
    {
      name: 'Reference No.',
      align: 'center' as const,
      width: '50%',
      parseValue: (row: any) => row.referenceNumber || '',
      originalValue: (row: any) => row.referenceNumber || '',
      sort: {
        sorted: false,
        ascending: false,
        onClick: jest.fn(),
      },
    },
    {
      name: 'Date joined',
      align: 'left' as const,
      width: '50%',
      parseValue: (row: any) => row.dateJoinedScheme || '',
      originalValue: (row: any) => row.referenceNumber || '',
      sort: {
        sorted: true,
        ascending: false,
        onClick: jest.fn(),
      },
    },
  ];

  const defaultProps = {
    'data-testid': 'test-data-table',
    id: 'data-table_linked-records',
    data: mockData,
    loading: false,
    isRowSelectable: true,
    tableHeaders: mockTableHeaders,
    tableColumns: mockTableColumns,
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 17,
      defaultPageSize: 10,
    },
    rowsPerPageOptions: [10, 25, 50, 100],
    selectedRowIndex: 2,
    sortColumn: 'Date joined',
    sortAscending: false,
    onRowSelect: jest.fn(),
    onSort: jest.fn(),
    onPageChange: jest.fn(),
    onRowsPerPageChange: jest.fn(),
  };

  const renderComponent = (props = {}) => render(<DataTableV2 {...defaultProps} {...props} />);

  it('renders the table with the correct test-id', () => {
    renderComponent();
    const table = screen.getByTestId('test-data-table');
    expect(table).toBeInTheDocument();
  });

  it('renders the table headers with the correct test-ids', () => {
    renderComponent();
    mockTableHeaders.forEach(header => {
      const headerCell = screen.getByTestId(`data-table-header-${header.name}`);
      expect(headerCell).toBeInTheDocument();
      expect(headerCell).toHaveTextContent(header.name);
    });
  });

  it('renders the table rows with the correct test-ids', () => {
    renderComponent();
    mockData.forEach((_, index) => {
      const row = screen.getByTestId(`data-table-row-${index}`);
      expect(row).toBeInTheDocument();
    });
  });

  it('renders the correct number of rows', () => {
    renderComponent();
    const rows = screen.getAllByTestId(/data-table-row-\d+$/);
    expect(rows).toHaveLength(mockData.length);
  });

  it('shows row is selected based on selectedRowIndex', () => {
    renderComponent({ selectedRowIndex: 1 });

    const selectedRow = screen.getByTestId('data-table-row-1');
    expect(selectedRow).toHaveAttribute('aria-selected', 'true');

    const unselectedRow = screen.getByTestId('data-table-row-0');
    expect(unselectedRow).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onRowSelect when a row is clicked', () => {
    renderComponent();

    const row = screen.getByTestId('data-table-row-0');
    fireEvent.click(row);

    expect(defaultProps.onRowSelect).toHaveBeenCalledWith(0);
  });

  it('calls onRowSelect when a row radio button is clicked', () => {
    renderComponent({ selectedRowIndex: null });

    const radioButton = screen.getByTestId('data-table-row-0-select');
    fireEvent.click(radioButton);

    expect(defaultProps.onRowSelect).toHaveBeenCalledWith(0);
  });

  it('calls onSort when a sortable column header is clicked', () => {
    renderComponent();

    const sortableHeader = screen.getByTestId('data-table-header-Date joined');
    fireEvent.click(sortableHeader);

    expect(defaultProps.onSort).toHaveBeenCalledWith('Date joined');
  });

  it('displays the sort icon for the currently sorted column', () => {
    renderComponent({ sortColumn: 'Date joined', sortAscending: false });

    const sortIcon = screen.getByTestId('sort-icon-Date joined');
    expect(sortIcon).toBeInTheDocument();
  });

  it('shows hover sort icon when hovering over sortable column', () => {
    renderComponent();

    const sortableHeader = screen.getByTestId('data-table-header-Reference No.');
    fireEvent.mouseEnter(sortableHeader);

    const hoverSortIcon = screen.getByTestId('sort-icon-Reference No.-hover');
    expect(hoverSortIcon).toBeInTheDocument();
  });

  it('does not call onSort or show sort icons for non-sortable columns', () => {
    const nonSortableTableColumns = [
      {
        name: 'Reference No.',
        align: 'center' as const,
        width: '50%',
        parseValue: (row: any) => row.referenceNumber || '',
      },
      {
        name: 'Date joined',
        align: 'left' as const,
        width: '50%',
        parseValue: (row: any) => row.dateJoinedScheme || '',
        sort: {
          sorted: true,
          ascending: false,
          onClick: jest.fn(),
        },
      },
    ];

    const nonSortableTableHeaders = [
      {
        name: 'Reference No.',
        dataField: 'referenceNumber',
        align: 'center' as const,
      },
      {
        name: 'Date joined',
        dataField: 'dateJoinedScheme',
        align: 'left' as const,
        sort: {
          sorted: true,
          ascending: false,
          onClick: jest.fn(),
        },
      },
    ];

    renderComponent({
      tableColumns: nonSortableTableColumns,
      tableHeaders: nonSortableTableHeaders,
    });

    const nonSortableHeader = screen.getByTestId('data-table-header-Reference No.');
    fireEvent.click(nonSortableHeader);

    expect(defaultProps.onSort).not.toHaveBeenCalledWith('Reference No.');

    fireEvent.mouseEnter(nonSortableHeader);

    expect(screen.queryByTestId('sort-icon-Reference No.-hover')).not.toBeInTheDocument();
  });

  it('renders loading skeleton when loading is true', () => {
    renderComponent({ loading: true });

    const loaderRows = screen.getAllByTestId(/data-table-loader-row-\d+/);
    expect(loaderRows.length).toBe(defaultProps.data.length);

    const skeletons = screen.getAllByTestId('animated-skeleton');
    expect(skeletons.length).toBe(defaultProps.data.length);
  });

  it('renders pagination when totalCount is greater than defaultPageSize', () => {
    renderComponent();

    const pagination = screen.getByTestId('data-table-pagination');
    expect(pagination).toBeInTheDocument();
  });

  it('calls onPageChange when pagination page is changed', () => {
    renderComponent();

    const pagination = screen.getByTestId('data-table-pagination');
    const nextPageButton = within(pagination).getByLabelText('Go to next page');

    fireEvent.click(nextPageButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 2);
  });

  it('calls onRowsPerPageChange when rows per page is changed', () => {
    renderComponent();

    const pagination = screen.getByTestId('data-table-pagination');
    const select = within(pagination).getByRole('button', { name: /Rows per page:/i });

    fireEvent.mouseDown(select);
    const options = screen.getAllByRole('option');
    fireEvent.click(options[1]);

    expect(defaultProps.onRowsPerPageChange).toHaveBeenCalled();
  });

  it('handles keyboard navigation for row selection', () => {
    renderComponent({ selectedRowIndex: null });

    const row = screen.getByTestId('data-table-row-1');

    fireEvent.keyDown(row, { key: 'Enter' });
    expect(defaultProps.onRowSelect).toHaveBeenCalledWith(1);

    fireEvent.keyDown(row, { key: ' ' });
    expect(defaultProps.onRowSelect).toHaveBeenCalledWith(1);
  });

  it('handles keyboard navigation for sorting', () => {
    renderComponent();

    const header = screen.getByTestId('data-table-header-Reference No.');

    fireEvent.keyDown(header, { key: 'Enter' });
    expect(defaultProps.onSort).toHaveBeenCalledWith('Reference No.');

    fireEvent.keyDown(header, { key: ' ' });
    expect(defaultProps.onSort).toHaveBeenCalledWith('Reference No.');
  });

  it('does not render the table head when isCard is true, hideTableHeader is true, and loading is true', () => {
    jest.spyOn(require('../../../components'), 'usePanelCardContext').mockImplementation(() => ({
      isCard: true,
      hideTableHeader: true,
    }));

    renderComponent({ loading: true });

    mockTableHeaders.forEach(header => {
      expect(screen.queryByTestId(`data-table-header-${header.name}`)).not.toBeInTheDocument();
    });
  });

  it('renders table columns with the correct width when width is provided', () => {
    renderComponent();
    const headerCell = screen.getByTestId('data-table-header-Reference No.');
    expect(headerCell).toHaveAttribute('width', '50%');
  });

  it('renders table columns with the default even width when no width is provided', () => {
    const tableHeadersNoWidth = [
      {
        name: 'Reference No.',
        dataField: 'referenceNumber',
        align: 'center',
        sort: {
          sorted: false,
          ascending: false,
          onClick: jest.fn(),
        },
      },
      {
        name: 'Date joined',
        dataField: 'dateJoinedScheme',
        align: 'left',
        sort: {
          sorted: true,
          ascending: false,
          onClick: jest.fn(),
        },
      },
    ];

    const propsNoWidth = {
      ...defaultProps,
      tableHeaders: tableHeadersNoWidth,
    };

    renderComponent(propsNoWidth);

    const headerCell1 = screen.getByTestId('data-table-header-Reference No.');
    expect(headerCell1).toHaveAttribute('width', '50%');

    const headerCell2 = screen.getByTestId('data-table-header-Date joined');
    expect(headerCell2).toHaveAttribute('width', '50%');
  });
});
