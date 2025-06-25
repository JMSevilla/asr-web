import { ComponentProps } from 'react';
import { PensionsProjectionsBlockV2 } from '../../../components/blocks/pensionProjections/PensionsProjectionsBlockV2';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { render, screen } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof PensionsProjectionsBlockV2> = {
  id: 'pension_projections_v2',
  parameters: [
    {
      key: 'hide_explore_options',
      value: 'true',
    },
  ],
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
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

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
  }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: {} }),
}));

// useCachedApi
jest.mock('../../../core/hooks/useCachedApi', () => ({
  useCachedApi: jest.fn().mockReturnValue({
    loading: false,
    result: { data: null },
    error: false,
  }),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    retirementCalculationLoading: false,
    retirementCalculation: {
      isCalculationSuccessful: true,
      totalPension: 1000,
      totalAVCFund: 2000,
    },
  }),
}));

describe('PensionProjectionsBlockV2', () => {
  it('should render pension projections component', () => {
    render(<PensionsProjectionsBlockV2 {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('pension_projections_v2')).toBeTruthy();
  });

  it('should render component loader when retirementCalculationLoading', () => {
    jest.mocked(useRetirementContext).mockReturnValue({ retirementCalculationLoading: true } as any);
    render(<PensionsProjectionsBlockV2 {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('component-loader')).toBeTruthy();
  });

  it('should not render when retirementCalculation is null', () => {
    jest
      .mocked(useRetirementContext)
      .mockReturnValue({ retirementCalculationLoading: false, retirementCalculation: null } as any);
    render(<PensionsProjectionsBlockV2 {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('component-loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pension_projections_v2')).not.toBeInTheDocument();
  });
});
