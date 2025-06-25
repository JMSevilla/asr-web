import { addDays, subDays } from 'date-fns';
import { ComponentProps } from 'react';
import { formatDate, normalizeDate } from '../../../business/dates';
import { RetirementDateInput } from '../../../components/blocks/datePicker/retirementDate/RetirementDateInput';
import { act, fireEvent, render, screen, userEvent, waitFor } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof RetirementDateInput> = {
  loading: false,
  selectedDate: new Date('2021-01-01'),
  minDate: new Date('2020-01-01'),
  maxDate: new Date('2030-01-01'),
  onChanged: jest.fn(),
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

const createDate = (date: Date | string) => formatDate(date, 'dd-MM-yyyy');

describe('RetirementDateInput', () => {
  it('should display input', async () => {
    await act(async () => {
      render(<RetirementDateInput {...DEFAULT_PROPS} />);
    });
    expect(screen.queryByTestId('retirement-date-input')).toBeTruthy();
  });

  it('should display loader', async () => {
    await act(async () => {
      render(<RetirementDateInput {...DEFAULT_PROPS} loading={true} />);
    });
    expect(screen.queryByTestId('input-loader')).toBeTruthy();
  });

  it('should change date and call onChange callback when value changes', async () => {
    const date = createDate(addDays(DEFAULT_PROPS.selectedDate!, 1));
    const onChangeCb = jest.fn();
    await act(async () => {
      render(<RetirementDateInput {...DEFAULT_PROPS} onChanged={onChangeCb} />);
    });
    const input = screen.queryByTestId('retirement-date-input')?.getElementsByTagName('input')[0];

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
    await act(async () => {
      render(<RetirementDateInput {...DEFAULT_PROPS} />);
    });
    const input = screen.queryByTestId('retirement-date-input')?.getElementsByTagName('input')[0];
    const prevDate = input?.value;

    await act(async () => {
      input && (await userEvent.type(input, date));
      input && (await userEvent.tab());
    });

    expect(input?.value).not.toBe(date);
    expect(input?.value).toBe(prevDate);
  });

  it('reverts value if date is later than maxDate', async () => {
    const date = createDate(addDays(DEFAULT_PROPS.maxDate!, 1));
    await act(async () => {
      render(<RetirementDateInput {...DEFAULT_PROPS} />);
    });
    const input = screen.queryByTestId('retirement-date-input')?.getElementsByTagName('input')[0];
    const prevDate = input?.value;

    await act(async () => {
      input && (await userEvent.type(input, date));
      input && (await userEvent.tab());
    });

    expect(input?.value).not.toBe(date);
    expect(input?.value).toBe(prevDate);
  });

  it('is able to set date through calendar view', async () => {
    await act(async () => {
      render(<RetirementDateInput {...DEFAULT_PROPS} />);
    });

    const button = screen.queryByTestId('calendar-view-button');
    button && (await act(async () => await userEvent.click(button)));

    await waitFor(() => screen.getByRole('dialog'));

    const rightArrowButton = screen.queryByTestId('ArrowRightIcon');
    rightArrowButton && (await act(async () => await userEvent.click(rightArrowButton)));

    await waitFor(() => screen.getAllByRole('grid'));

    const clickableCell = screen.getAllByRole('row')[3].querySelector('div[role="cell"]  > button:not([disabled])');
    clickableCell && (await act(async () => await userEvent.click(clickableCell)));

    const date = createDate(normalizeDate(new Date(clickableCell?.getAttribute('aria-label') as string)));
    const input = screen.queryByTestId('retirement-date-input')?.getElementsByTagName('input')[0];

    expect(input?.value).toBe(date);
  });
});
