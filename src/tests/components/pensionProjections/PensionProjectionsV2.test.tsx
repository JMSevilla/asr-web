import { PensionProjectionsV2 } from '../../../components/blocks/pensionProjections/shared/pensionProjectionsV2/PensionProjectionsV2';
import { act, render, screen, userEvent } from '../../common';

const DEFAULT_PROPS = {
  totalAVCFund: 500,
  totalPension: 1000,
  ageLines: [10, 12, 13],
  timeToRetirement: {
    years: 15,
    months: 20,
    ageAtRetirement: 60,
    timeToNormalRetirement: {
      years: 65,
      months: 9,
      weeks: 3,
      days: 22,
    },
    ageAtNormalRetirement: {
      years: 0,
      months: 10,
      weeks: 0,
      days: 10,
    },
  },
  currentMemberAge: 45,
  normalRetirementAge: 60,
  hideExploreOptions: false,
  showAtDate: false,
  retirementDate: '2023-07-23T00:00:00+00:00',
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
    render(<PensionProjectionsV2 {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('total-pension-data-block')).toBeTruthy();
  });

  it('should show pension sum in a year with currency', () => {
    render(<PensionProjectionsV2 {...DEFAULT_PROPS} />);
    expect(screen.getByText('[[currency:GBP]]1,000.00[[hub_ret_per_year]]')).toBeInTheDocument();
  });

  it('should show retirement data block', () => {
    render(<PensionProjectionsV2 {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('retirement-data-block')).toBeTruthy();
  });

  it('should show retirement date width years and months', () => {
    render(<PensionProjectionsV2 {...DEFAULT_PROPS} />);
    expect(screen.getByText('65 [[years]], 9 [[months]]')).toBeInTheDocument();
    expect(screen.getByText('([[hub_ret_age]] 10 [[months]], 10 [[days]])')).toBeInTheDocument();
  });

  it('should show retirement date width non zero details and with comma', () => {
    render(
      <PensionProjectionsV2
        {...DEFAULT_PROPS}
        timeToRetirement={{
          ...DEFAULT_PROPS.timeToRetirement,
          timeToNormalRetirement: {
            years: 0,
            months: 5,
            weeks: 0,
            days: 7,
          },
          ageAtNormalRetirement: {
            years: 0,
            months: 1,
            weeks: 1,
            days: 0,
          },
        }}
      />,
    );
    expect(screen.getByText('5 [[months]], 7 [[days]]')).toBeInTheDocument();
    expect(screen.getByText('([[hub_ret_age]] 1 [[month]], 1 [[week]])')).toBeInTheDocument();
  });

  it('should show retirement date without comma', () => {
    render(
      <PensionProjectionsV2
        {...DEFAULT_PROPS}
        timeToRetirement={{
          ...DEFAULT_PROPS.timeToRetirement,
          timeToNormalRetirement: {
            years: 0,
            months: 5,
            weeks: 0,
            days: 0,
          },
          ageAtNormalRetirement: {
            years: 65,
            months: 0,
            weeks: 0,
            days: 0,
          },
        }}
      />,
    );
    expect(screen.getByText('5 [[months]]')).toBeInTheDocument();
    expect(screen.getByText('([[hub_ret_age]] 65 [[years]])')).toBeInTheDocument();
  });

  it('should show today age', () => {
    render(
      <PensionProjectionsV2
        {...DEFAULT_PROPS}
        timeToRetirement={{
          ...DEFAULT_PROPS.timeToRetirement,
          timeToNormalRetirement: {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
          },
          ageAtNormalRetirement: {
            years: 65,
            months: 0,
            weeks: 0,
            days: 0,
          },
          currentAge: {
            years: 67,
            months: 0,
            weeks: 3,
            days: 0,
          },
        }}
      />,
    );

    expect(screen.getByText('[[pension_proj_late_retire_age]]')).toBeInTheDocument();
  });

  it('should show member retirement date', () => {
    render(<PensionProjectionsV2 {...DEFAULT_PROPS} showAtDate={true} />);
    expect(screen.getByText('23 Jul 2023')).toBeInTheDocument();
  });

  it('should show additional contribution sum', () => {
    render(<PensionProjectionsV2 {...DEFAULT_PROPS} />);
    expect(screen.getByText('[[currency:GBP]]500.00')).toBeInTheDocument();
    expect(screen.queryByTestId('additional-contributions-block')).toBeTruthy();
  });

  it('should hide additional contribution sum', () => {
    render(<PensionProjectionsV2 {...DEFAULT_PROPS} totalPension={undefined} />);
    expect(screen.queryByTestId('total-pension-block')).toBeFalsy();
  });

  it('should open data modal', async () => {
    render(<PensionProjectionsV2 {...DEFAULT_PROPS} />);
    await act(async () => await userEvent.click(screen.getByTestId('pension-modal-button')));
    expect(screen.getByTestId('pension-modal')).toBeTruthy();
  });
});
