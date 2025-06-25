import { usePanelCardContext } from '../../../components/Card';
import { BeneficiariesListBlock } from '../../../components/blocks/beneficiariesList/BeneficiariesListBlock';
import * as VisibleItemsLimiterHook from '../../../components/blocks/beneficiariesList/hooks';
import { BeneficiaryRow } from '../../../components/blocks/beneficiariesList/types';
import { useApi } from '../../../core/hooks/useApi';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { useResolution } from '../../../core/hooks/useResolution';
import { render, screen, waitFor } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ loading: false, result: { data: { people: [], organizations: [] } } }),
  useApiCallback: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));

jest.mock('../../../components/Card', () => ({
  usePanelCardContext: jest.fn().mockReturnValue({ isCard: true }),
}));

jest.mock('../../../core/hooks/useResolution', () => ({
  useResolution: jest.fn(),
}));

jest.mock('../../../components/blocks/beneficiariesList/hooks', () => ({
  useVisibleItemsLimiter: jest.fn(),
}));

describe('BeneficiariesListBlock', () => {
  // Setup mock data
  const mockBeneficiaries: BeneficiaryRow[] = [
    {
      icon: 'person-done-outline',
      name: 'John Doe',
      relationship: 'Spouse',
      percentage: 75,
      color: '#FF5733',
      isPensionBeneficiary: true,
    },
    {
      icon: 'person-outline',
      name: 'Jane Smith',
      relationship: 'Child',
      percentage: 15,
      color: '#33FF57',
    },
    {
      icon: 'briefcase-outline',
      name: 'Charity Foundation',
      relationship: 'Organization',
      percentage: 10,
      color: '#3357FF',
    },
  ];

  const mockParameters = [
    { key: 'header_name_label', value: 'Name' },
    { key: 'header_relationship_label', value: 'Relationship' },
    { key: 'header_ls_allocation_label', value: 'Allocation' },
    { key: 'aria_referred_pension_label', value: 'This person is a pension beneficiary' },
    { key: 'aria_allocation_summary_label', value: 'Beneficiaries allocation summary' },
  ];

  // Setup mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock panel block
    jest.mocked(usePanelBlock).mockReturnValue({
      panelByKey: jest.fn().mockReturnValue(<div>No beneficiaries found</div>),
    } as any);

    // Mock resolution hook
    jest.mocked(useResolution).mockReturnValue({
      isMobile: false,
    } as any);

    // Mock card context
    jest.mocked(usePanelCardContext).mockReturnValue({
      isCard: false,
    } as any);

    // Mock the visible items limiter hook
    jest.mocked(VisibleItemsLimiterHook.useVisibleItemsLimiter).mockReturnValue({
      tBodyRef: { current: null },
      visibleItems: mockBeneficiaries.map((b, index) => (
        <tr key={index} data-testid={`beneficiary-item-${index}`}>
          <td>{b.name}</td>
        </tr>
      )),
      visibleItemsCount: 3,
    } as any);
  });

  it('renders loading state when API is loading', () => {
    // Mock the API hook to return loading state
    jest.mocked(useApi).mockReturnValue({
      loading: true,
      result: null,
    } as any);

    render(<BeneficiariesListBlock id="test-block" parameters={mockParameters} />);

    expect(screen.getByTestId('beneficiaries-list-loader')).toBeInTheDocument();
  });

  it('renders empty state when no beneficiaries and not in card mode', () => {
    // Mock the API hook to return empty result
    jest.mocked(useApi).mockReturnValue({
      loading: false,
      result: [],
    } as any);

    render(<BeneficiariesListBlock id="test-block" parameters={mockParameters} />);

    expect(screen.getByTestId('beneficiaries-list-empty')).toBeInTheDocument();
  });

  it('renders beneficiaries list when data is available', async () => {
    // Setup the API mock with beneficiaries data
    const mockApiResult = mockBeneficiaries.map((beneficiary, index) => (
      <tr key={index} data-testid={`beneficiary-${index}`}>
        <td>{beneficiary.name}</td>
      </tr>
    ));

    jest.mocked(useApi).mockReturnValue({
      loading: false,
      result: mockApiResult,
      status: 'success',
      error: null,
    } as any);

    render(<BeneficiariesListBlock id="test-block" parameters={mockParameters} />);

    await waitFor(() => {
      expect(screen.getByTestId('beneficiaries-list')).toBeInTheDocument();
    });
  });

  it('shows more indicator when not all items are visible', async () => {
    // Setup mock
    jest.mocked(useApi).mockReturnValue({
      loading: false,
      result: mockBeneficiaries.map((b, i) => <div key={i}>{b.name}</div>),
      status: 'success',
      error: null,
    } as any);

    // Mock that only 2 out of 3 items are visible
    jest.mocked(VisibleItemsLimiterHook.useVisibleItemsLimiter).mockReturnValue({
      tBodyRef: { current: null },
      visibleItems: mockBeneficiaries.slice(0, 2).map((b, index) => (
        <tr key={index} data-testid={`beneficiary-item-${index}`}>
          <td>{b.name}</td>
        </tr>
      )),
      visibleItemsCount: 2,
    } as any);

    render(<BeneficiariesListBlock id="test-block" parameters={mockParameters} />);

    await waitFor(() => {
      expect(screen.getByTestId('beneficiaries-list-more')).toBeInTheDocument();
      expect(screen.getByTestId('beneficiaries-list-more').textContent).toContain('+1 [[more]]');
    });
  });
});
