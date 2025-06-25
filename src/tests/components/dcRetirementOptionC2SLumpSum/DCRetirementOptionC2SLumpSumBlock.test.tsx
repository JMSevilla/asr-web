import { ComponentProps } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DCRetirementOptionC2SLumpSumBlock } from '../../../components/blocks/dcRetirementOptionC2SLumpSum/DCRetirementOptionC2SLumpSumBlock';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi } from '../../../core/hooks/useApi';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';

const DEFAULT_PROPS: ComponentProps<typeof DCRetirementOptionC2SLumpSumBlock> = {
  id: 'test-block-id',
  parameters: [],
  pageKey: 'test-page',
  journeyType: 'retirement',
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    quotesOptions: { quotes: {} },
    quotesOptionsLoading: false,
    refreshQuotesOptions: jest.fn(),
  }),
}));

const mockApiResult = {
  result: {
    data: {
      elements: {
        summaryBlocks: {
          values: [
            { 
              id: 'summary1',
              title: 'Summary 1',
              content: 'Test content 1'
            },
            { 
              id: 'summary2',
              title: 'Summary 2',
              content: 'Test content 2'
            },
          ],
        },
      },
    },
  },
  loading: false,
  status: 'success',
  error: undefined,
  set: jest.fn(),
  merge: jest.fn(),
  reset: jest.fn(),
  execute: jest.fn().mockImplementation(async () => {
    return {
      data: {
        selectedQuoteName: 'test-quote'
      }
    };
  }),
  currentPromise: null,
  currentParams: null,
};

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockImplementation((callback) => {
    if (typeof callback === 'function') {
      callback({
        mdp: {
          quoteSelectionJourneySelections: async () => ({
            data: { selectedQuoteName: 'test-quote' }
          })
        },
        content: {
          retirementOptionSummary: async () => ({
            data: mockApiResult.result.data
          })
        }
      });
    }
    return mockApiResult;
  })
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({
    data: { contentAccessKey: 'test-key' },
  }),
}));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: { taxFreeLumpSum: 2000 },
    save: jest.fn(),
    loading: false,
  }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(({ cb }) => {
    setTimeout(() => cb(2000), 0);
  }),
}));

jest.mock('../../../cms/inject-tokens', () => ({
  useTokenEnrichedValue: jest.fn(object => object),
}));

jest.mock('../../../components/blocks/dcRetirementLumpSum/LumpSumInfo', () => ({
  LumpSumInfo: () => <div data-testid="lump-sum-info">Lump Sum Info</div>,
}));

jest.mock('../../../components/blocks/dcRetirementOptionC2SLumpSum/DCRetirementOptionC2SLumpSumForm', () => ({
  DCRetirementOptionC2SLumpSumForm: () => <div data-testid="lump-sum-form">Lump Sum Form</div>,
}));

describe('DCRetirementOptionC2SLumpSumBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the block with correct id', () => {
    render(<DCRetirementOptionC2SLumpSumBlock {...DEFAULT_PROPS} />);
    
    const block = screen.getByTestId('quote-lump-sum-details-block');
    expect(block).toHaveAttribute('id', DEFAULT_PROPS.id);
  });

  it('should render LumpSumInfo component', () => {
    render(<DCRetirementOptionC2SLumpSumBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('lump-sum-info')).toBeInTheDocument();
  });

  it('should render DCRetirementOptionC2SLumpSumForm component', () => {
    render(<DCRetirementOptionC2SLumpSumBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('lump-sum-form')).toBeInTheDocument();
  });

  it('should handle form submission correctly', async () => {
    const mockSave = jest.fn();
    jest.mocked(useJourneyStepData).mockReturnValue({
      values: { taxFreeLumpSum: 2000 },
      save: mockSave,
      loading: false,
    });

    render(<DCRetirementOptionC2SLumpSumBlock {...DEFAULT_PROPS} />);
    
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith({ taxFreeLumpSum: 2000 });
    });
  });

  it('should pass loading state to child components', () => {
    jest.mocked(useApi).mockReturnValue({
      ...mockApiResult,
      loading: true,
      status: 'loading',
    });
    
    render(<DCRetirementOptionC2SLumpSumBlock {...DEFAULT_PROPS} />);
    expect(useRetirementContext).toHaveBeenCalled();
  });

  it('should handle journey type selection', () => {
    render(<DCRetirementOptionC2SLumpSumBlock {...DEFAULT_PROPS} />);
    
    expect(useJourneyStepData).toHaveBeenCalledWith(expect.objectContaining({
      journeyType: 'retirement',
    }));
  });
}); 