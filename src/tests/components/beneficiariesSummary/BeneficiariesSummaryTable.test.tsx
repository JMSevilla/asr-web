import { BeneficiariesSummaryTable } from '../../../components/blocks/beneficiariesSummary/beneficiaryWizardForm/BeneficiariesSummaryForm';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../../core/contexts/JourneyIndicatorContext', () => ({
  useJourneyIndicatorContext: jest.fn().mockReturnValue({
    setCustomHeader: jest.fn(),
    journeyInnerStep: 1,
    customHeader: null,
    journeyInnerStepsCount: 3,
    setJourneyInnerStep: jest.fn(),
    setJourneyInnerStepsCount: jest.fn(),
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    error: undefined,
    result: {
      data: {
        beneficiaries: [
          {
            address: {},
            id: 123,
            relationship: 'relationship',
            forenames: 'forenames',
            surname: 'surname',
            charityName: 'charityName',
            charityNumber: 123,
            lumpSumPercentage: 10,
            dateOfBirth: 'dateOfBirth',
            isPensionBeneficiary: false,
            notes: 'string',
          },
        ],
      },
    },
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    error: undefined,
    result: { data: {} },
    execute: () => ({ data: { url: 'url' } }),
  }),
}));

describe('BeneficiariesSummaryTable', () => {
  it('should render beneficiaries summary table without data', () => {
    render(
      <BeneficiariesSummaryTable id="beneficiaries-table" isEditable={false} isLoading={false} beneficiaries={[]} />,
    );
    expect(screen.queryByTestId('beneficiaries-table')).toBeTruthy();
    expect(screen.getByText('[[beneficiary_summary_no_data]]')).toBeInTheDocument();
  });
  it('should render beneficiaries summary table with data', () => {
    render(
      <BeneficiariesSummaryTable
        id="beneficiaries-table"
        isEditable={false}
        isLoading={false}
        beneficiaries={[
          {
            address: null,
            id: 123,
            valueId: '123',
            optionId: '2',
            type: 'CHARITY',
            relationship: 'relationship',
            forenames: 'forenames1',
            surname: 'surname1',
            charityName: 'charityName',
            charityNumber: 123,
            lumpSumPercentage: 20,
            dateOfBirth: null,
            isPensionBeneficiary: false,
            notes: 'string',
          },
          {
            address: null,
            id: 123,
            valueId: '123',
            optionId: '2',
            type: 'PERSON',
            relationship: 'relationship',
            forenames: 'forenames2',
            surname: 'surname2',
            charityName: 'charityName',
            charityNumber: 123,
            lumpSumPercentage: 10,
            dateOfBirth: null,
            isPensionBeneficiary: false,
            notes: 'string',
          },
        ]}
      />,
    );
    expect(screen.queryByTestId('beneficiaries-table')).toBeTruthy();
    expect(screen.getByText('forenames1 surname1', { collapseWhitespace: false })).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('30.00%')).toBeInTheDocument();
  });
  it('should render with custom header', () => {
    const setCustomHeaderFn = jest.fn();
    jest.mocked(useJourneyIndicatorContext).mockReturnValue({
      setCustomHeader: setCustomHeaderFn,
      journeyInnerStep: 1,
      customHeader: null,
      journeyInnerStepsCount: 3,
      setJourneyInnerStep: jest.fn(),
      setJourneyInnerStepsCount: jest.fn(),
    });
    render(
      <BeneficiariesSummaryTable
        withCustomHeader={true}
        id="beneficiaries-table"
        isEditable={false}
        isLoading={false}
        beneficiaries={[
          {
            address: null,
            id: 123,
            valueId: '123',
            optionId: '2',
            type: 'CHARITY',
            relationship: 'relationship',
            forenames: 'forenames1',
            surname: 'surname1',
            charityName: 'charityName',
            charityNumber: 123,
            lumpSumPercentage: 20,
            dateOfBirth: null,
            isPensionBeneficiary: false,
            notes: 'string',
          },
        ]}
      />,
    );

    expect(setCustomHeaderFn).toBeCalledTimes(1);
    expect(setCustomHeaderFn).toBeCalledWith({
      action: expect.any(Function),
      title: '[[benef_beneficiaries_summary_header]]',
    });
  });
});
