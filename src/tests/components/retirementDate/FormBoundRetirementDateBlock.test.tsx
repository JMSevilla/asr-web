import { ComponentProps } from 'react';
import { FormBoundRetirementDateBlock } from '../../../components/blocks/datePicker/FormBoundRetirementDateBlock';
import { render, screen } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof FormBoundRetirementDateBlock> = {
  id: 'retirement_date',
  parameters: [],
  journeyType: 'retirement',
  pageKey: 'quote_check_personal',
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../core/hooks/useJourneyNavigation', () => ({
  useJourneyNavigation: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue({}),
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
    execute: jest.fn(),
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
    lastValidDate: new Date('2021-01-01'),
  }),
}));

describe('FormBoundRetirementDateBlock', () => {
  console.error = jest.fn();

  it('should render retirement date block', () => {
    render(<FormBoundRetirementDateBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('date-picker')).toBeTruthy();
  });

  it('should render retirement age block', () => {
    render(<FormBoundRetirementDateBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('age-picker')).toBeTruthy();
  });

  it('should not render retirement age block when max_date_months is present', () => {
    render(<FormBoundRetirementDateBlock {...DEFAULT_PROPS} parameters={[{ key: 'max_date_months', value: '12' }]} />);
    expect(screen.queryByTestId('age-picker')).not.toBeInTheDocument();
  });

  it('should render hidden text', () => {
    render(<FormBoundRetirementDateBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('hidden-text')).toBeTruthy();
  });
});
