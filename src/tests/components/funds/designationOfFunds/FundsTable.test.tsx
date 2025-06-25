import { ComponentProps } from 'react';
import { FundWithPercentage } from '../../../../components';
import { FundsTable } from '../../../../components/blocks/funds/designationOfFunds/FundsTable';
import { useFormSubmissionBindingHooks } from '../../../../core/hooks/useFormSubmissionBindingHooks';
import { act, fireEvent, render, screen, userEvent } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../../core/router', () => ({ useRouter: jest.fn() }));

jest.mock('../../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

const DEFAULT_PROPS: ComponentProps<typeof FundsTable> = {
  prefix: 'test',
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
  onLoaded: jest.fn(),
  onDelete: jest.fn(),
  onSubmit: jest.fn(),
};

const FUND_WITH_PERCENTAGE: FundWithPercentage = {
  fundCode: 'test',
  fundName: 'Test',
  fundGroup: 'Test group',
  factsheetUrl: 'https://test.com',
  percentage: 50,
};

describe('FundsTable', () => {
  it('should render', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} />);
    });

    expect(screen.getByTestId('funds-table')).toBeInTheDocument();
  });

  it('should render with default values', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} defaultValues={[FUND_WITH_PERCENTAGE]} />);
    });

    expect(screen.getByTestId('fund-test')).toBeInTheDocument();
    expect(screen.getByTestId('fund-test2')).toBeInTheDocument();
    expect(screen.getByTestId('fund-test3')).toBeInTheDocument();
    expect(screen.getByTestId('fund-test4')).toBeInTheDocument();
    expect(+screen.getByTestId('fund-test').querySelector('input')!.value).toBe(50);
    expect(+screen.getByTestId('fund-test2').querySelector('input')!.value).toBe(0);
    expect(+screen.getByTestId('fund-test3').querySelector('input')!.value).toBe(0);
    expect(+screen.getByTestId('fund-test4').querySelector('input')!.value).toBe(0);
  });

  it('should render total', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} defaultValues={[FUND_WITH_PERCENTAGE]} />);
    });

    expect(screen.getByTestId('total')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('50%');
  });

  it('should change total when input changes', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} defaultValues={[FUND_WITH_PERCENTAGE]} />);
    });

    expect(screen.getByTestId('total')).toHaveTextContent('50%');

    await act(async () => {
      const input = screen.queryByTestId('fund-test2')?.getElementsByTagName('input')[0];
      input && (await userEvent.click(input));
      input && fireEvent.change(input, { target: { value: 15 } });
      input && (await userEvent.tab());
    });

    expect(screen.getByTestId('total')).toHaveTextContent('65%');

    await act(async () => {
      const input2 = screen.queryByTestId('fund-test3')?.getElementsByTagName('input')[0];
      input2 && (await userEvent.click(input2));
      input2 && fireEvent.change(input2, { target: { value: 10 } });
      input2 && (await userEvent.tab());
    });

    expect(screen.getByTestId('total')).toHaveTextContent('75%');
  });

  it('should not allow to enter less than 0 or more than 100 in input', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} defaultValues={[FUND_WITH_PERCENTAGE]} />);
    });

    await act(async () => {
      const input = screen.queryByTestId('fund-test2')?.getElementsByTagName('input')[0];
      input && (await userEvent.click(input));
      input && fireEvent.change(input, { target: { value: -1 } });
      input && (await userEvent.tab());
    });

    expect(+screen.getByTestId('fund-test2').querySelector('input')!.value).toBe(1);

    await act(async () => {
      const input2 = screen.queryByTestId('fund-test3')?.getElementsByTagName('input')[0];
      input2 && (await userEvent.click(input2));
      input2 && fireEvent.change(input2, { target: { value: 110 } });
      input2 && (await userEvent.tab());
    });

    expect(+screen.getByTestId('fund-test3').querySelector('input')!.value).toBe(0);
  });

  it('should render with no rows', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} rows={[]} />);
    });

    expect(screen.getByTestId('no-funds')).toBeInTheDocument();
  });

  it('should render with total incorrect', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} />);
    });

    expect(screen.getByTestId('total-incorrect')).toBeInTheDocument();
  });

  it('should not render with total incorrect when total is 100%', async () => {
    await act(async () => {
      render(
        <FundsTable
          {...DEFAULT_PROPS}
          defaultValues={[FUND_WITH_PERCENTAGE, { ...FUND_WITH_PERCENTAGE, fundCode: 'test2' }]}
        />,
      );
    });

    expect(screen.queryByTestId('total-incorrect')).not.toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} />);
    });

    await act(async () => {
      screen.getByTestId(`fund-${DEFAULT_PROPS.rows[0].fundCode}-delete`).click();
    });

    expect(DEFAULT_PROPS.onDelete).toHaveBeenCalledWith(DEFAULT_PROPS.rows[0]);
  });

  it('should call onLoaded when rows change', async () => {
    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} defaultValues={[FUND_WITH_PERCENTAGE]} />);
    });

    expect(DEFAULT_PROPS.onLoaded).toHaveBeenCalledWith([FUND_WITH_PERCENTAGE.fundCode]);
  });

  it('should call onSubmit when form is submitted', async () => {
    (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
      cb();
    });

    await act(async () => {
      render(<FundsTable {...DEFAULT_PROPS} />);
    });

    expect(DEFAULT_PROPS.onSubmit).toHaveBeenCalled();
  });
});
