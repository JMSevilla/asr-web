import { UserRetirementApplicationStatus } from '../../../api/mdp/types';
import { formatDate, getUTCDate } from '../../../business/dates';
import { useDateExplanationMessage } from '../../../components/blocks/datePicker/retirementDate/useDateExplanationMessage';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { renderHook } from '../../common';

const DEFAULT_USER_RA_STATUS: UserRetirementApplicationStatus = {
  lifeStage: 'lifeStage',
  retirementApplicationStatus: 'RAStatus',
  earliestStartRaDateForSelectedDate: new Date('2020-01-01').toISOString(),
  latestStartRaDateForSelectedDate: new Date('2021-01-01').toISOString(),
  expirationRaDateForSelectedDate: new Date('2022-01-01').toISOString(),
};

const DEFAULT_QUOTATION = {
  guaranteed: true,
  expiryDate: '2023-01-01',
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/contexts/GlobalsContext', () => ({
  useGlobalsContext: jest.fn().mockReturnValue({
    labelByKey: (key: string) => `[${key}]`,
  }),
}));

describe('useDateExplanationMessage', () => {
  it('should render no message when useRAStatus is undefined', () => {
    const { result } = renderHook(() => useDateExplanationMessage());
    expect(result.current).toBe(null);
  });

  it('should render no message when RA status is not EligibleToStart, NotEligibleToStart, or RetirementDateOutOfRange', () => {
    const { result } = renderHook(() =>
      useDateExplanationMessage({
        ...DEFAULT_USER_RA_STATUS,
        lifeStage: 'randomLifeStage',
        retirementApplicationStatus: 'randomStatus',
      }),
    );
    expect(result.current).toBe(null);
  });

  it('should render [quote_list_date_explanation_over_max] message when lifeStage is CloseToLatestRetirementAge', () => {
    const { result } = renderHook(() =>
      useDateExplanationMessage({ ...DEFAULT_USER_RA_STATUS, lifeStage: 'CloseToLatestRetirementAge' }),
    );
    expect(result.current).toBe('[quote_list_date_explanation_over_max]');
  });

  it('should render [quote_list_date_protected_minimum_pension] message when RA status is MinimumRetirementDateOutOfRange', () => {
    const { result } = renderHook(() =>
      useDateExplanationMessage({
        ...DEFAULT_USER_RA_STATUS,
        retirementApplicationStatus: 'MinimumRetirementDateOutOfRange',
      }),
    );
    expect(result.current).toBe('[quote_list_date_protected_minimum_pension]');
  });

  it('should render [quote_list_date_explanation_single] message when RA status is EligibleToStart', () => {
    const { result } = renderHook(() =>
      useDateExplanationMessage({ ...DEFAULT_USER_RA_STATUS, retirementApplicationStatus: 'EligibleToStart' }),
    );
    expect(result.current).toBe('[quote_list_date_explanation_single]');
  });

  it('should render [quote_list_date_explanation_range] message when RA status is NotEligibleToStart', () => {
    const { result } = renderHook(() =>
      useDateExplanationMessage({ ...DEFAULT_USER_RA_STATUS, retirementApplicationStatus: 'NotEligibleToStart' }),
    );
    expect(result.current).toBe('[quote_list_date_explanation_range]');
  });

  it('should render [quote_list_date_explanation_range] message when RA status is RetirementDateOutOfRange', () => {
    const { result } = renderHook(() =>
      useDateExplanationMessage({ ...DEFAULT_USER_RA_STATUS, retirementApplicationStatus: 'RetirementDateOutOfRange' }),
    );
    expect(result.current).toBe('[quote_list_date_explanation_range]');
  });

  it('should populate tokens correctly without quotation', () => {
    jest.mocked(useGlobalsContext).mockReturnValue({
      labelByKey: (_: string, tokens?: { [key: string]: string | null | undefined }) => tokens,
    } as any);
    const { result } = renderHook(() =>
      useDateExplanationMessage({ ...DEFAULT_USER_RA_STATUS, lifeStage: 'CloseToLatestRetirementAge' }),
    );
    const resultTokens = result.current as unknown as {
      earliest_start_ra_date_for_selected_retirement_date_label: string;
      latest_start_ra_date_for_selected_retirement_date_label: string;
      quote_expiry_date: string | null;
    };

    expect(resultTokens.earliest_start_ra_date_for_selected_retirement_date_label).toBe(
      formatDate(DEFAULT_USER_RA_STATUS.earliestStartRaDateForSelectedDate!),
    );
    expect(resultTokens.latest_start_ra_date_for_selected_retirement_date_label).toBe(
      formatDate(DEFAULT_USER_RA_STATUS.latestStartRaDateForSelectedDate!),
    );
    expect(resultTokens.quote_expiry_date).toBe(null);
  });

  it('should populate tokens correctly with quotation data when guaranteed is true', () => {
    jest.mocked(useGlobalsContext).mockReturnValue({
      labelByKey: (_: string, tokens?: { [key: string]: string | null | undefined }) => tokens,
    } as any);
    const { result } = renderHook(() =>
      useDateExplanationMessage(
        { ...DEFAULT_USER_RA_STATUS, lifeStage: 'CloseToLatestRetirementAge' },
        DEFAULT_QUOTATION,
      ),
    );
    const resultTokens = result.current as unknown as {
      earliest_start_ra_date_for_selected_retirement_date_label: string;
      latest_start_ra_date_for_selected_retirement_date_label: string;
      quote_expiry_date: string | null;
    };

    expect(resultTokens.earliest_start_ra_date_for_selected_retirement_date_label).toBe(
      formatDate(DEFAULT_USER_RA_STATUS.earliestStartRaDateForSelectedDate!),
    );
    expect(resultTokens.latest_start_ra_date_for_selected_retirement_date_label).toBe(
      formatDate(DEFAULT_USER_RA_STATUS.latestStartRaDateForSelectedDate!),
    );
    expect(resultTokens.quote_expiry_date).toBe(formatDate(getUTCDate(DEFAULT_QUOTATION.expiryDate)));
  });

  it('should not include quote_expiry_date when guaranteed is false', () => {
    jest.mocked(useGlobalsContext).mockReturnValue({
      labelByKey: (_: string, tokens?: { [key: string]: string | null | undefined }) => tokens,
    } as any);
    const { result } = renderHook(() =>
      useDateExplanationMessage(
        { ...DEFAULT_USER_RA_STATUS, lifeStage: 'CloseToLatestRetirementAge' },
        { ...DEFAULT_QUOTATION, guaranteed: false },
      ),
    );
    const resultTokens = result.current as unknown as {
      earliest_start_ra_date_for_selected_retirement_date_label: string;
      latest_start_ra_date_for_selected_retirement_date_label: string;
      quote_expiry_date: string | null;
    };

    expect(resultTokens.quote_expiry_date).toBe(null);
  });

  it('should not include quote_expiry_date when expiryDate is missing', () => {
    jest.mocked(useGlobalsContext).mockReturnValue({
      labelByKey: (_: string, tokens?: { [key: string]: string | null | undefined }) => tokens,
    } as any);
    const { result } = renderHook(() =>
      useDateExplanationMessage(
        { ...DEFAULT_USER_RA_STATUS, lifeStage: 'CloseToLatestRetirementAge' },
        { guaranteed: true, expiryDate: '' },
      ),
    );
    const resultTokens = result.current as unknown as {
      earliest_start_ra_date_for_selected_retirement_date_label: string;
      latest_start_ra_date_for_selected_retirement_date_label: string;
      quote_expiry_date: string | null;
    };

    expect(resultTokens.quote_expiry_date).toBe(null);
  });
});
