import { ComponentProps } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DCRetirementOptionC2SLumpSumForm } from '../../../components/blocks/dcRetirementOptionC2SLumpSum/DCRetirementOptionC2SLumpSumForm';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { calculatePercentage } from '../../../business/currency';
import { RetirementQuotesV3Option } from '../../../api/mdp/types';
import { SummaryBlocksValue } from '../../../api/content/types/retirement';
import { FormatSelection } from '../../../api/content/types/common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    user: { name: 'Test User' },
  }),
}));

jest.mock('../../../core/contexts/GlobalsContext');
jest.mock('../../../business/currency');
jest.mock('../../../business/retirement', () => ({
  findRetirementOptionValueByKey: jest.fn((quotes, key) => {
    if (key === 'minimumPermittedTotalLumpSum') return '1000';
    if (key === 'maximumPermittedStandardLumpSum') return '10000';
    if (key === 'totalFundValue') return '5000';
    if (key === 'attributes') return quotes.attributes;
    if (key === 'requestedLumpSum' && quotes.requestedLumpSum) return quotes.requestedLumpSum;
    return null;
  }),
  retirementValuePathToKeys: jest.fn(() => ['attributes', 'requestedLumpSum']),
}));

(calculatePercentage as jest.Mock).mockImplementation((total, value) => {
  return ((value / total) * 100).toFixed(2);
});

jest.mock('../../../components', () => ({
  InputLoader: () => <div data-testid="input-loader">Loading...</div>,
  NumberField: ({ control, name, label }: { control: any; name: string; label: React.ReactNode }) => (
    <input 
      type="number" 
      role="spinbutton" 
      data-testid={`number-field-${name}`}
      onChange={(e) => control._formValues[name] = Number(e.target.value)}
      value={control._formValues[name] || ''}
    />
  ),
  PercentageField: () => <div>Percentage Field</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

describe('DCRetirementOptionC2SLumpSumForm', () => {
  const mockOnLumpSumApplicabilityChange = jest.fn();
  const mockOnRequestedLumpSumChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobalsContext as jest.Mock).mockReturnValue({
      labelByKey: jest.fn(key => key),
    });
  });

  it('should render loading state', () => {
    render(
      <DCRetirementOptionC2SLumpSumForm
        loading={true}
        onLumpSumApplicabilityChange={mockOnLumpSumApplicabilityChange}
        onRequestedLumpSumChange={mockOnRequestedLumpSumChange}
      />
    );
    
    expect(screen.getByTestId('input-loader')).toBeInTheDocument();
  });

  it('should render form with initial values', () => {
    render(
      <DCRetirementOptionC2SLumpSumForm
        loading={false}
        onLumpSumApplicabilityChange={mockOnLumpSumApplicabilityChange}
        onRequestedLumpSumChange={mockOnRequestedLumpSumChange}
        initialValue={2000}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(2000);
  });

  it('should update lump sum applicability when form is valid', async () => {
    const mockQuotes: RetirementQuotesV3Option = {
      minimumPermittedTotalLumpSum: 1000,
      maximumPermittedStandardLumpSum: 10000,
      attributes: {
        totalFundValue: 5000,
        requestedLumpSum: 2000
      }
    };

    const mockSummaryBlock: SummaryBlocksValue = {
      type: 'summary',
      elements: {
        header: { value: 'Test Header', elementType: 'text' },
        highlightedBackground: { value: false, elementType: 'boolean' },
        summaryItems: {
          values: [{
            type: 'summary-item',
            elements: {
              value: { value: 'attributes.requestedLumpSum', elementType: 'text' },
              format: { value: { label: 'Currency', selection: 'Currency' } },
              description: { value: '', elementType: 'text' },
              divider: { value: false, elementType: 'boolean' },
              explanationSummaryItems: { values: [] },
              header: { value: 'Test Header', elementType: 'text' },
              link: { value: '', elementType: 'text' },
              linkText: { value: '', elementType: 'text' },
              tooltip: { value: undefined }
            }
          }]
        }
      }
    };

    render(
      <DCRetirementOptionC2SLumpSumForm
        loading={false}
        onLumpSumApplicabilityChange={mockOnLumpSumApplicabilityChange}
        onRequestedLumpSumChange={mockOnRequestedLumpSumChange}
        initialValue={2000}
        quotes={mockQuotes}
        summaryBlock={mockSummaryBlock}
      />
    );
    
    await waitFor(() => {
      expect(mockOnLumpSumApplicabilityChange).toHaveBeenCalledWith(true);
    });
  });

  it('should update requested lump sum value when input changes', async () => {
    render(
      <DCRetirementOptionC2SLumpSumForm
        loading={false}
        onLumpSumApplicabilityChange={mockOnLumpSumApplicabilityChange}
        onRequestedLumpSumChange={mockOnRequestedLumpSumChange}
        initialValue={2000}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '3000' } });
    
    await waitFor(() => {
      expect(mockOnRequestedLumpSumChange).toHaveBeenCalledWith(3000);
    });
  });

  it('should calculate and display percentage correctly', () => {
    render(
      <DCRetirementOptionC2SLumpSumForm
        loading={false}
        onLumpSumApplicabilityChange={mockOnLumpSumApplicabilityChange}
        onRequestedLumpSumChange={mockOnRequestedLumpSumChange}
        initialValue={2000}
      />
    );
    
    expect(calculatePercentage).toHaveBeenCalledWith(5000, 2000);
  });

  it('should show validation error when value is below minimum', async () => {
    render(
      <DCRetirementOptionC2SLumpSumForm
        loading={false}
        onLumpSumApplicabilityChange={mockOnLumpSumApplicabilityChange}
        onRequestedLumpSumChange={mockOnRequestedLumpSumChange}
        initialValue={500}
      />
    );
    
    await waitFor(() => {
      expect(mockOnLumpSumApplicabilityChange).toHaveBeenCalledWith(false);
    });
  });

  it('should show validation error when value is above maximum', async () => {
    render(
      <DCRetirementOptionC2SLumpSumForm
        loading={false}
        onLumpSumApplicabilityChange={mockOnLumpSumApplicabilityChange}
        onRequestedLumpSumChange={mockOnRequestedLumpSumChange}
        initialValue={15000}
      />
    );
    
    await waitFor(() => {
      expect(mockOnLumpSumApplicabilityChange).toHaveBeenCalledWith(false);
    });
  });
}); 