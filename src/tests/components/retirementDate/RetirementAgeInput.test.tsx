import { ComponentProps } from 'react';
import { RetirementAgeInput } from '../../../components/blocks/datePicker/retirementDate/RetirementAgeInput';
import { act, render, screen, userEvent } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof RetirementAgeInput> = {
  loading: false,
  selectedAge: 50,
  options: [50, 60, 70],
  onChanged: jest.fn(),
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

describe('RetirementAgeInput', () => {
  it('should display input', () => {
    render(<RetirementAgeInput {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('retirement-age-input')).toBeTruthy();
  });

  it('should display loader', () => {
    render(<RetirementAgeInput {...DEFAULT_PROPS} loading={true} />);
    expect(screen.queryByTestId('input-loader')).toBeTruthy();
  });

  it('should change value correctly', async () => {
    render(<RetirementAgeInput {...DEFAULT_PROPS} />);
    const selectButton = screen.queryByTestId('retirement-age-input');
    selectButton && (await act(async () => await userEvent.click(selectButton)));
    const option1 = screen.getByRole<HTMLOptionElement>('option', { name: DEFAULT_PROPS.options[0].toString() });
    const option2 = screen.getByRole<HTMLOptionElement>('option', { name: DEFAULT_PROPS.options[1].toString() });
    const option3 = screen.getByRole<HTMLOptionElement>('option', { name: DEFAULT_PROPS.options[2].toString() });
    option2 && (await act(async () => await userEvent.click(option2)));
    expect(option1.selected).toBeFalsy();
    expect(option2.selected).toBeTruthy();
    expect(option3.selected).toBeFalsy();
  });

  it('should call onChange callback when value changes', async () => {
    const onChangeCb = jest.fn();
    render(<RetirementAgeInput {...DEFAULT_PROPS} onChanged={onChangeCb} />);
    const selectButton = screen.queryByTestId('retirement-age-input');
    selectButton && (await act(async () => await userEvent.click(selectButton)));
    const option = screen.getByRole<HTMLOptionElement>('option', { name: DEFAULT_PROPS.options[1].toString() });
    option && (await act(async () => await userEvent.click(option)));
    expect(onChangeCb).toBeCalledTimes(1);
  });
});
