import { MemberPersonalDetailsBlock } from '../../../components';
import { useApi } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: null, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
}));
jest.mock('../../../core/hooks/useCachedApi.ts', () => ({
  useCachedApi: jest.fn().mockReturnValue({ result: null, loading: false }),
}));
const MOCKED_DATA = {
  referenceNumber: '2211390',
  dateOfBirth: '1959-03-29T23:59:59+00:00',
  title: 'MS',
  forenames: 'XXXXX XXXXXXXXX',
  surname: 'XXXX',
  normalRetirementAge: 60,
  normalRetirementDate: '2019-03-31T00:00:00+00:00',
  datePensionableServiceCommenced: '1981-08-03T00:00:00+00:00',
  dateOfLeaving: '1999-12-31T00:00:00+00:00',
  transferInServiceYears: null,
  transferInServiceMonths: null,
  totalPensionableServiceYears: null,
  totalPensionableServiceMonths: null,
  finalPensionableSalary: null,
  insuranceNumber: 'XX211390X',
  status: 'Deferred',
  membershipNumber: '312312',
  payrollNumber: '312312',
  dateJoinedScheme: '1981-08-03T00:00:00+00:00',
  dateLeftScheme: '1999-12-31T00:00:00+00:00',
  schemeName: 'The RBS Group Pension Fund - Main',
  age: 64,
  floorRoundedAge: 63,
  hasAdditionalContributions: true,
};

jest.mock('../../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({ data: { ageAtNormalRetirementIso: '61Y11M0W0D' } }),
}));

describe('MembershiDetailsBlock', () => {
  it('should render membership details block', () => {
    jest.mocked(useApi).mockReturnValue({
      result: {
        data: MOCKED_DATA,
      },
    } as any);

    render(
      <MemberPersonalDetailsBlock id="membership_details_block_test" parameters={[{ key: 'key', value: 'value' }]} />,
    );

    expect(screen.getByTestId('membership-details-block')).toBeTruthy();
  });

  it('should render membership data correctly', () => {
    jest.mocked(useApi).mockReturnValue({
      result: {
        data: MOCKED_DATA,
      },
    } as any);

    render(<MemberPersonalDetailsBlock id="membership_details_block_test" parameters={[]} />);

    expect(screen.getByTestId('my_details_member_name').textContent).toBe(
      '[[my_details_member_name]]MS XXXXX XXXXXXXXX XXXX',
    );
    expect(screen.getByTestId('my_details_member_dob').textContent).toBe('[[my_details_member_dob]]29 Mar 1959');
    expect(screen.getByTestId('my_details_member_ni').textContent).toBe('[[my_details_member_ni]]XX211390X');
  });
  it('should render membership normal retirement date and age correctly', () => {
    jest.mocked(useApi).mockReturnValue({
      result: {
        data: MOCKED_DATA,
      },
    } as any);

    render(
      <MemberPersonalDetailsBlock
        id="membership_details_block_test"
        parameters={[
          { key: 'normal_retirement_date', value: 'value' },
          { key: 'normal_retirement_age', value: 'value' },
        ]}
      />,
    );

    expect(screen.getByTestId('my_personal_details_panel_nrd').textContent).toBe(
      '[[my_personal_details_panel_nrd]]31 Mar 2019',
    );
    expect(screen.getByTestId('my_personal_details_panel_nra').textContent).toBe(
      '[[my_personal_details_panel_nra]]61 [[label:years]], 11 [[label:months]]',
    );
  });
});
