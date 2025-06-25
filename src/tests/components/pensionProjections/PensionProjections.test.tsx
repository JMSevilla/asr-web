import { PensionProjections } from '../../../components/blocks/pensionProjections/shared/PensionProjections';
import { act, render, screen, userEvent } from '../../common';

const DEFAULT_PROPS = {
  totalAVCFund: 500,
  totalPension: 1000,
  ageLines: [10, 12, 13],
  timeToRetirement: { years: 15, months: 20, ageAtRetirement: 65 },
  currentMemberAge: 45,
  normalRetirementAge: 60,
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

describe('PensionProjections', () => {
  it('render pension projections component', () => {
    render(<PensionProjections {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('total-pension-data-block')).toBeTruthy();
  });

  it('should show pension sum in a year with currency', () => {
    render(<PensionProjections {...DEFAULT_PROPS} />);
    expect(screen.getByText('[[currency:GBP]]1,000.00[[hub_ret_per_year]]')).toBeInTheDocument();
  });

  it('should show retirement data block', () => {
    render(<PensionProjections {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('retirement-data-block')).toBeTruthy();
  });

  it('should show retirement date width years and months', () => {
    render(<PensionProjections {...DEFAULT_PROPS} />);
    expect(screen.getByText('15 [[years]] 20 [[months]] ([[hub_ret_age]] 60)')).toBeInTheDocument();
  });

  it('should show retirement date width year and month', () => {
    render(<PensionProjections {...DEFAULT_PROPS} timeToRetirement={{ years: 1, months: 1, ageAtRetirement: 65 }} />);
    expect(screen.getByText('1 [[year]] 1 [[month]] ([[hub_ret_age]] 60)')).toBeInTheDocument();
  });

  it('should show additional contribution sum', () => {
    render(<PensionProjections {...DEFAULT_PROPS} />);
    expect(screen.getByText('[[currency:GBP]]500.00')).toBeInTheDocument();
    expect(screen.queryByTestId('additional-contributions-block')).toBeTruthy();
  });

  it('should hide additional contribution sum', () => {
    render(<PensionProjections {...DEFAULT_PROPS} totalPension={undefined} />);
    expect(screen.queryByTestId('total-pension-block')).toBeFalsy();
  });

  it('should open data modal', async () => {
    render(<PensionProjections {...DEFAULT_PROPS} />);
    await act(async () => await userEvent.click(screen.getByTestId('pension-modal-button')));
    expect(screen.getByTestId('pension-modal')).toBeTruthy();
  });
});
