import { ComponentProps } from 'react';
import { GuaranteedTransferBlock } from '../../../components/blocks/guaranteedTransfer/GuaranteedTransferBlock';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { render, screen } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof GuaranteedTransferBlock> = {
  id: 'guaranteed-transfer',
  buttonKey: 'button',
  prefix: 'transfer_block',
  headerKey: 'header',
  isMessage: false,
};

const MOCKED_MEMBERSHIP = {
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

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: { hasAdditionalContributions: true } }),
}));

jest.mock('../../../components/ParsedHtml', () => ({
  ParsedHtml: ({ html }: { html: string; fontSize: string }) => <span>{html}</span>,
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    retirementCalculation: undefined,
    retirementCalculationLoading: false,
    transferOptions: {
      totalGuaranteedTransferValue: 10,
      totalTransferValue: 15,
      totalNonGuaranteedTransferValue: 20,
    },
    transferOptionsLoading: false,
    quotesOptions: undefined,
    quotesOptionsError: undefined,
    quotesOptionsLoading: false,
    refreshQuotesOptions: jest.fn(),
  }),
}));

describe('GuaranteedTransferBlock', () => {
  it('render guaranteed transfer component', () => {
    render(<GuaranteedTransferBlock {...DEFAULT_PROPS} />);

    expect(screen.queryByTestId('guaranteed-transfer')).toBeTruthy();
  });

  it('should render guaranteed transfer without Avc', () => {
    render(<GuaranteedTransferBlock {...DEFAULT_PROPS} />);

    expect(screen.getByText('[[currency:GBP]]15.00')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]10.00')).toBeTruthy();
  });

  it('should render guaranteed transfer header', () => {
    render(<GuaranteedTransferBlock {...DEFAULT_PROPS} headerKey="header_key" />);

    expect(screen.getByText('[[header_key]]')).toBeTruthy();
  });

  it('should render guaranteed transfer with Avc', () => {
    jest.mocked(useContentDataContext).mockReturnValueOnce({
      loading: true,
      membership: {
        ...MOCKED_MEMBERSHIP,
      },
    } as any);
    render(<GuaranteedTransferBlock {...DEFAULT_PROPS} />);

    expect(screen.queryByTestId('transfer-quote-total-value')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]10.00')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]15.00')).toBeTruthy();
    expect(screen.getByText('[[currency:GBP]]20.00')).toBeTruthy();
  });
});
