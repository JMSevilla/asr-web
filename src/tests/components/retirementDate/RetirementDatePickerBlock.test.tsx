import { ComponentProps } from 'react';
import { RetirementDatePickerBlock } from '../../../components';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { act, render, screen } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof RetirementDatePickerBlock> = {
  id: 'retirement_date_picker',
  parameters: [],
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

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    selectedRetirementDate: null,
    setSelectedRetirementDate: jest.fn(),
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

describe('RetirementDatePickerBlock', () => {
  console.error = jest.fn();

  it('should render retirement date picker block', () => {
    render(<RetirementDatePickerBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('retirement_date_picker_form')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('should render hidden text', () => {
    render(<RetirementDatePickerBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('hidden-text')).toBeTruthy();
  });

  it('should clear selected retirement date on unmount', () => {
    const mockSetSelectedRetirementDate = jest.fn();

    (useRetirementContext as jest.Mock).mockReturnValue({
      selectedRetirementDate: null,
      setSelectedRetirementDate: mockSetSelectedRetirementDate,
    });

    const { unmount } = render(<RetirementDatePickerBlock {...DEFAULT_PROPS} />);

    act(() => {
      unmount();
    });

    expect(mockSetSelectedRetirementDate).toHaveBeenCalledWith(undefined);
  });

  it('should not clear selected retirement date while mounted', () => {
    const mockSetSelectedRetirementDate = jest.fn();
    
    (useRetirementContext as jest.Mock).mockReturnValue({
      selectedRetirementDate: null,
      setSelectedRetirementDate: mockSetSelectedRetirementDate,
    });

    render(<RetirementDatePickerBlock {...DEFAULT_PROPS} />);

    expect(mockSetSelectedRetirementDate).not.toHaveBeenCalled();
  });
});
