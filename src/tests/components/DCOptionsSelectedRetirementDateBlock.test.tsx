import { formatDate } from '../../business/dates';
import { DCOptionsSelectedRetirementDateBlock } from '../../components/blocks/DCOptionsSelectedRetirementDateBlock';
import { useCachedCmsTokens } from '../../core/contexts/contentData/useCachedCmsTokens';
import { render, screen } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({ quotesOptionsLoading: false }),
}));

describe('DCOptionsSelectedRetirementDateBlock', () => {
  it('should render', () => {
    render(<DCOptionsSelectedRetirementDateBlock id="block" />);
    expect(screen.getByTestId('dc-retirement-date')).toBeInTheDocument();
  });

  it('should display loader', () => {
    jest.mocked(useCachedCmsTokens).mockReturnValue({ loading: true } as any);
    render(<DCOptionsSelectedRetirementDateBlock id="block" />);
    expect(screen.getByTestId('dc-retirement-date-loader')).toBeInTheDocument();
  });

  it('should display selectedDate', () => {
    jest
      .mocked(useCachedCmsTokens)
      .mockReturnValue({ loading: false, data: { selectedRetirementDate: new Date() } } as any);
    render(<DCOptionsSelectedRetirementDateBlock id="block" />);
    expect(screen.getByText(formatDate(new Date()))).toBeInTheDocument();
  });
});
