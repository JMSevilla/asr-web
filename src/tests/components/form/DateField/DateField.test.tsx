import { addDays, subDays } from 'date-fns';
import { formatDate } from '../../../../business/dates';
import { DateFieldComponent } from '../../../../components/form/dateField';
import { act, fireEvent, render, screen, userEvent } from '../../../common';

jest.mock('../../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));
const DEFAULT_PROPS = {
  field: {
    name: 'financialAdviseDate' as never,
    value: new Date('2021-01-01') as never,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  },
  fieldState: {
    invalid: false,
    isTouched: false,
    isDirty: false,
    error: {
      message: '',
      type: 'someType',
    },
  },
  label: 'Test Label',
  tooltip: {
    text: 'Test Tooltip',
    header: 'Tooltip Header',
    html: 'Tooltip HTML',
  },
  minDate: new Date('2020-01-01'),
  maxDate: new Date('2030-01-01'),
};

const createDate = (date: Date) => formatDate(date, 'dd-MM-yyyy');

describe('DateFieldComponent', () => {
  it('should display datefield component', () => {
    render(<DateFieldComponent {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId(`${DEFAULT_PROPS.field.name}-field`)).toBeTruthy();
  });
  it('should change date and call onChange callback when value changes', async () => {
    const onChangeCb = DEFAULT_PROPS.field.onChange;
    render(<DateFieldComponent {...DEFAULT_PROPS} />);
    const input = screen.queryByTestId(`${DEFAULT_PROPS.field.name}-field`)?.getElementsByTagName('input')[0];

    const date = createDate(addDays(DEFAULT_PROPS.field.value!, 1));
    await act(async () => {
      input && (await userEvent.click(input));
      input && (await fireEvent.change(input, { target: { value: date } }));
      input && (await userEvent.tab());
    });
    expect(input?.value).toBe(date);
    expect(onChangeCb).toBeCalledTimes(1);
  });

  it('reverts value if date is earlier than minDate', async () => {
    const date = createDate(subDays(DEFAULT_PROPS.minDate!, 1));
    render(<DateFieldComponent {...DEFAULT_PROPS} />);
    const input = screen.queryByTestId(`${DEFAULT_PROPS.field.name}-field`)?.getElementsByTagName('input')[0];

    const prevDate = input?.value;
    await act(async () => {
      input && (await userEvent.type(input, date));
      input && (await userEvent.tab());
    });

    expect(input?.value).not.toBe(date);
    expect(input?.value).toBe(prevDate);
  });

  it('reverts value if date is later than maxDate', async () => {
    const date = createDate(subDays(DEFAULT_PROPS.maxDate!, 1));
    render(<DateFieldComponent {...DEFAULT_PROPS} />);
    const input = screen.queryByTestId(`${DEFAULT_PROPS.field.name}-field`)?.getElementsByTagName('input')[0];

    const prevDate = input?.value;
    await act(async () => {
      input && (await userEvent.type(input, date));
      input && (await userEvent.tab());
    });

    expect(input?.value).not.toBe(date);
    expect(input?.value).toBe(prevDate);
  });

  it('displays correct date on UTC+14', async () => {
    Date.prototype.getTimezoneOffset = jest.fn(() => 840);
    expect(new Date().getTimezoneOffset()).toBe(840);

    render(<DateFieldComponent {...DEFAULT_PROPS} />);
    const input = screen.queryByTestId(`${DEFAULT_PROPS.field.name}-field`)?.getElementsByTagName('input')[0];
    expect(input?.value).toBe('01-01-2021');

    const date = createDate(new Date('2021-02-01'));
    await act(async () => {
      input && (await userEvent.click(input));
      input && (await fireEvent.change(input, { target: { value: date } }));
      input && (await userEvent.tab());
    });
    expect(input?.value).toBe(date);
  });

  it('displays correct date on UTC-11', async () => {
    Date.prototype.getTimezoneOffset = jest.fn(() => -660);
    expect(new Date().getTimezoneOffset()).toBe(-660);

    render(<DateFieldComponent {...DEFAULT_PROPS} />);
    const input = screen.queryByTestId(`${DEFAULT_PROPS.field.name}-field`)?.getElementsByTagName('input')[0];
    expect(input?.value).toBe('01-01-2021');

    const date = createDate(new Date('2021-02-01'));
    await act(async () => {
      input && (await userEvent.click(input));
      input && (await fireEvent.change(input, { target: { value: date } }));
      input && (await userEvent.tab());
    });
    expect(input?.value).toBe(date);
  });
});
