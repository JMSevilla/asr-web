import { ComponentProps } from 'react';
import { FundsModal } from '../../../../components/blocks/funds/designationOfFunds/FundsModal';
import { act, fireEvent, render, screen, userEvent } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../../core/router', () => ({ useRouter: jest.fn() }));

const DEFAULT_PROPS: ComponentProps<typeof FundsModal> = {
  prefix: 'test',
  isOpen: true,
  rows: [
    {
      fundCode: 'test',
      fundName: 'Test',
      fundGroup: 'Test group',
      factsheetUrl: 'https://test.com',
    },
    {
      fundCode: 'test2',
      fundName: 'Test 2',
      fundGroup: 'Test group',
      factsheetUrl: 'https://test.com',
    },
    {
      fundCode: 'test3',
      fundName: 'Test 3',
      fundGroup: 'Test group',
      factsheetUrl: 'https://test.com',
    },
    {
      fundCode: 'test4',
      fundName: 'Test 4',
      fundGroup: 'Test group 2',
      factsheetUrl: 'https://test.com',
    },
  ],
  selectedRows: [
    {
      fundCode: 'test',
      fundName: 'Test',
      fundGroup: 'Test group',
      factsheetUrl: 'https://test.com',
    },
    {
      fundCode: 'test2',
      fundName: 'Test 2',
      fundGroup: 'Test group',
      factsheetUrl: 'https://test.com',
    },
  ],
  onSaved: jest.fn(),
  onClosed: jest.fn(),
};

describe('FundsModal', () => {
  it('should render', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('funds-modal')).toBeInTheDocument();
  });

  it('should render content panel', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} contentPanel={<div>Content panel</div>} />);
    });
    expect(screen.getByText('Content panel')).toBeInTheDocument();
  });

  it('should render error panel', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} rows={[]} errorPanel={<div>Error panel</div>} />);
    });
    expect(screen.getByText('Error panel')).toBeInTheDocument();
  });

  it('should render groups list', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('groups-list')).toBeInTheDocument();
  });

  it('should render correct number of groups and groups lists items', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} />);
    });
    expect(screen.getAllByTestId(/group-title-/).length).toBe(2);
    expect(screen.getAllByTestId(/group-.*-list-item-/).length).toBe(4);
  });

  it('should render correct number of groups and groups lists items after search and reset', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} />);
    });
    expect(screen.getAllByTestId(/group-title-/).length).toBe(2);
    expect(screen.getAllByTestId(/group-.*-list-item-/).length).toBe(4);

    await act(async () => {
      const input = screen.queryByTestId('search-field')?.getElementsByTagName('input')[0];
      input && (await userEvent.click(input));
      input && fireEvent.change(input, { target: { value: 'Test 2' } });
      input && (await userEvent.tab());
      screen.getByTestId('submit-btn').click();
    });

    expect(screen.getAllByTestId(/group-title-/).length).toBe(1);
    expect(screen.getAllByTestId(/group-.*-list-item-/).length).toBe(1);

    await act(async () => {
      screen.getByTestId('reset-btn').click();
    });

    expect(screen.getAllByTestId(/group-title-/).length).toBe(2);
    expect(screen.getAllByTestId(/group-.*-list-item-/).length).toBe(4);
  });

  it('should render correct number of checked items', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} />);
    });
    expect(screen.getAllByTestId(/group-title-/).length).toBe(2);
    DEFAULT_PROPS.rows.forEach(row => {
      const shouldBeChecked = DEFAULT_PROPS.selectedRows.some(selectedRow => selectedRow.fundCode === row.fundCode);
      expect(screen.getByTestId(`fund-${row.fundCode}`)).toHaveAttribute(
        'aria-checked',
        shouldBeChecked ? 'true' : 'false',
      );
    });
  });

  it('should pass correct checked items to onSaved callback', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} />);
    });
    await act(async () => {
      screen.getByTestId('group-Test group-list-item-test2').querySelector('input')?.click();
      screen.getByTestId('save-btn').click();
    });
    expect(DEFAULT_PROPS.onSaved).toHaveBeenCalledWith(['test', 'test2']);
  });

  it('should call onClosed callback', async () => {
    await act(async () => {
      render(<FundsModal {...DEFAULT_PROPS} />);
    });
    await act(async () => {
      screen.getByTestId('cancel-btn').click();
    });
    expect(DEFAULT_PROPS.onClosed).toHaveBeenCalled();
  });
});
