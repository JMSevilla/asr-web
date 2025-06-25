import { ComponentProps } from 'react';
import { ParsedButtonProps } from '../../../cms/parse-cms';
import { RetirementDateBlock } from '../../../components/blocks/datePicker/retirementDate/RetirementDateBlock';
import { useDateCalculations } from '../../../components/blocks/datePicker/retirementDate/useDateCalculations';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { act, fireEvent, render, screen, userEvent, waitFor } from '../../common';
import { MDP_OPTIONS_MOCK } from '../retirementOptionSummary/mock';

const DEFAULT_PROPS: ComponentProps<typeof RetirementDateBlock> = {
  id: 'retirement_date',
  pageKey: 'retirement_date',
  parameters: [],
  buttons: [],
};

const BUTTON: ParsedButtonProps = {
  key: 'retirement_date_quote_calculate_and_download_btn',
  linkKey: 'string',
  journeyType: 'retirement',
  link: 'string',
  anchor: '',
  type: 'Primary',
  text: 'string',
  icon: undefined,
  iconName: undefined,
  rightSideIcon: undefined,
  reuseUrlParameters: undefined,
  openInTheNewTab: undefined,
  widthPercentage: undefined,
  customActionKey: undefined,
  notification: undefined,
  disabledReason: undefined,
  fileUrl: '',
  dialogElement: undefined,
  analyticsKey: undefined,
  fastForwardComparisonPageKey: undefined,
  fastForwardRedirectPageKey: undefined,
  postRequestUrl: undefined,
  largeIcon: undefined,
  disabled: undefined,
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({
    data: {
      contentAccessKey: JSON.stringify({ wordingFlags: [] }),
    },
    refresh: jest.fn(),
    loading: false,
  }),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormState: jest.fn().mockReturnValue({
    isValid: true,
    isDirty: false,
    errors: {},
  }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: {} }),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    quotesOptionsLoading: false,
    quotesOptions: null,
    onRetirementDateChanged: jest.fn().mockReturnValue({ isCalculationSuccessful: true }),
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
}));

jest.mock('../../../components/blocks/datePicker/retirementDate/useDateCalculations', () => ({
  useDateCalculations: jest.fn().mockReturnValue({
    confirmSelectedDateIsValid: jest.fn(),
    selectedDate: new Date('2021-01-01'),
    dateFrom: new Date('2020-01-01'),
    dateTo: new Date('2030-01-10'),
    selectedAge: 65,
    ageOptions: [65],
    changeDate: jest.fn(),
    changeAge: jest.fn(),
    calculateDateByAge: jest.fn(),
    lastValidDate: new Date('2021-01-01'),
  }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({ useFormSubmissionBindingHooks: jest.fn() }));

describe('RetirementDateBlock', () => {
  console.error = jest.fn();

  it('should render retirement date block', () => {
    render(<RetirementDateBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('date-picker')).toBeTruthy();
  });

  it('should render retirement age block', () => {
    render(<RetirementDateBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('age-picker')).toBeTruthy();
  });

  it('should not render retirement age block when max_date_months is present', () => {
    render(<RetirementDateBlock {...DEFAULT_PROPS} parameters={[{ key: 'max_date_months', value: '12' }]} />);
    expect(screen.queryByTestId('age-picker')).not.toBeInTheDocument();
  });

  it('should render calculate button', () => {
    render(<RetirementDateBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('calculate-button')).toBeTruthy();
  });

  it('should render hidden text', () => {
    render(<RetirementDateBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('hidden-text')).toBeTruthy();
  });

  it('should render date explanation message', () => {
    render(<RetirementDateBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('date-explanation-message')).toBeTruthy();
  });

  it('on calculate click should call confirmSelectedDateIsValid when isCalculationSuccessful true', async () => {
    const lastValidDate = new Date('2030-01-05');
    const confirmSelectedDateIsValid = jest.fn();
    jest.mocked(useDateCalculations).mockReturnValue({
      confirmSelectedDateIsValid,
      selectedDate: new Date('2021-01-01'),
      dateOfBirth: new Date('2000-01-01'),
      dateFrom: new Date('2020-01-01'),
      dateTo: new Date('2030-01-10'),
      selectedAge: 65,
      ageOptions: [65],
      changeDate: jest.fn(),
      changeAge: jest.fn(),
      calculateDateByAge: jest.fn(),
      lastValidDate,
    });
    render(<RetirementDateBlock {...DEFAULT_PROPS} />);
    const input = screen.queryByTestId('retirement-date-input')?.getElementsByTagName('input')[0];
    await act(async () => {
      input && (await userEvent.click(input));
      input && fireEvent.change(input, { target: { value: lastValidDate } });
      input && (await userEvent.tab());
    });
    const calculateButton = screen.queryByTestId('calculate-button');
    await act(async () => {
      calculateButton && (await userEvent.click(calculateButton));
    });
    expect(confirmSelectedDateIsValid).toBeCalledTimes(1);
  });

  it('on calculate click should call changeDate when isCalculationSuccessful is false', async () => {
    const lastValidDate = new Date('2030-01-05');
    const confirmSelectedDateIsValid = jest.fn();
    const changeDate = jest.fn();
    jest.mocked(useDateCalculations).mockReturnValue({
      confirmSelectedDateIsValid,
      selectedDate: new Date('2021-01-01'),
      dateOfBirth: new Date('2000-01-01'),
      dateFrom: new Date('2020-01-01'),
      dateTo: new Date('2030-01-10'),
      selectedAge: 65,
      ageOptions: [65],
      changeDate,
      changeAge: jest.fn(),
      calculateDateByAge: jest.fn(),
      lastValidDate,
    });
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptionsLoading: false,
      quotesOptions: null,
      onRetirementDateChanged: jest.fn().mockReturnValue({ isCalculationSuccessful: false }),
    } as any);
    render(<RetirementDateBlock {...DEFAULT_PROPS} />);
    const input = screen.queryByTestId('retirement-date-input')?.getElementsByTagName('input')[0];
    await act(async () => {
      input && (await userEvent.click(input));
      input && fireEvent.change(input, { target: { value: lastValidDate } });
      input && (await userEvent.tab());
    });
    const calculateButton = screen.queryByTestId('calculate-button');
    await act(async () => {
      calculateButton && (await userEvent.click(calculateButton));
    });
    expect(confirmSelectedDateIsValid).toBeCalledTimes(0);
    expect(changeDate).toBeCalledTimes(2);
  });

  it('should render the action button when provided', () => {
    render(<RetirementDateBlock {...DEFAULT_PROPS} parameters={[]} buttons={[BUTTON]} />);

    const quoteButton = screen.queryByTestId('retirement_date_quote_calculate_and_download_btn');
    expect(quoteButton).toBeInTheDocument();

    const calculateButton = screen.queryByTestId('calculate-button');
    expect(calculateButton).not.toBeInTheDocument();
  });

  it('should render the calculate button when there is no button parameter', () => {
    render(<RetirementDateBlock {...DEFAULT_PROPS} parameters={[]} />);

    const calculateButton = screen.queryByTestId('calculate-button');
    expect(calculateButton).toBeInTheDocument();

    const quoteButton = screen.queryByTestId('retirement_date_quote_calculate_and_download_btn');
    expect(quoteButton).not.toBeInTheDocument();
  });

  it('should call pdfDownloadCb.execute when button is retirement_date_quote_calculate_and_download_btn and handleQuoteSubmit is executed', async () => {
    const downloadFn = jest.fn().mockResolvedValue({});
    const parseUrlAndPushFn = jest.fn().mockResolvedValue({});

    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: JSON.stringify({ wordingFlags: [] }),
      },
      refresh: jest.fn(),
      loading: false,
    } as any);
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptionsLoading: false,
      quotesOptions: { ...MDP_OPTIONS_MOCK, isCalculationSuccessful: true },
      onRetirementDateChanged: jest.fn().mockReturnValue({ isCalculationSuccessful: true }),
    } as any);
    jest.mocked(useApiCallback).mockReturnValue({ execute: downloadFn } as any);
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPushFn } as any);

    render(<RetirementDateBlock {...DEFAULT_PROPS} parameters={[]} buttons={[BUTTON]} />);
    const input = screen.queryByTestId('retirement-date-input')?.getElementsByTagName('input')[0];
    const lastValidDate = new Date('2030-01-05');
    await act(async () => {
      input && (await userEvent.click(input));
      input && fireEvent.change(input, { target: { value: lastValidDate } });
      input && (await userEvent.tab());
    });

    const quoteButton = screen.queryByTestId('retirement_date_quote_calculate_and_download_btn');
    await act(async () => {
      quoteButton && (await userEvent.click(quoteButton));
    });

    await waitFor(() => {
      expect(downloadFn).toBeCalledTimes(1);
      expect(parseUrlAndPushFn).not.toBeCalled();
    });
  });

  it('should call parseUrlAndPush when button is retirement_date_quote_calculate_and_download_btn and calculation fails', async () => {
    const lastValidDate = new Date('2030-01-05');
    const confirmSelectedDateIsValid = jest.fn();
    const changeDate = jest.fn();
    const parseUrlAndPushFn = jest.fn().mockResolvedValue({});
    const refreshFn = jest.fn();

    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: {
        contentAccessKey: JSON.stringify({ wordingFlags: [] }),
      },
      refresh: refreshFn,
      loading: false,
    } as any);
    jest.mocked(useDateCalculations).mockReturnValue({
      confirmSelectedDateIsValid,
      selectedDate: new Date('2021-01-01'),
      dateOfBirth: new Date('2000-01-01'),
      dateFrom: new Date('2020-01-01'),
      dateTo: new Date('2030-01-10'),
      selectedAge: 65,
      ageOptions: [65],
      changeDate,
      changeAge: jest.fn(),
      calculateDateByAge: jest.fn(),
      lastValidDate,
    });
    jest.mocked(useRetirementContext).mockReturnValue({
      quotesOptionsLoading: false,
      quotesOptions: { isCalculationSuccessful: false },
      onRetirementDateChanged: jest.fn().mockReturnValue({ isCalculationSuccessful: false }),
    } as any);
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush: parseUrlAndPushFn } as any);

    render(
      <RetirementDateBlock {...DEFAULT_PROPS} parameters={[]} buttons={[{ ...BUTTON, journeyType: 'retirement' }]} />,
    );

    const input = screen.queryByTestId('retirement-date-input')?.getElementsByTagName('input')[0];
    await act(async () => {
      input && (await userEvent.click(input));
      input && fireEvent.change(input, { target: { value: lastValidDate } });
      input && (await userEvent.tab());
    });

    const quoteButton = screen.queryByTestId('retirement_date_quote_calculate_and_download_btn');
    await act(async () => {
      quoteButton && (await userEvent.click(quoteButton));
    });

    await waitFor(() => {
      expect(refreshFn).toBeCalledTimes(1);
      expect(parseUrlAndPushFn).toBeCalledTimes(1);
    });
  });
});
