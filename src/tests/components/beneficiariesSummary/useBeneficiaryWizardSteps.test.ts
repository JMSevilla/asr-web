import { useBeneficiaryWizardSteps } from '../../../components/blocks/beneficiariesSummary/beneficiaryWizardForm/steps/useSteps';
import { useModal } from '../../../core/hooks/useModal';
import { renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../../core/hooks/useModal', () => ({
  useModal: jest.fn().mockReturnValue({
    open: jest.fn(),
    close: jest.fn(),
    props: {
      isOpen: false,
      context: 'string',
    },
  }),
}));

describe('useBeneficiaryWizardSteps', () => {
  it('should create beneficiary steps correctly', () => {
    jest.mocked(useModal<string>).mockReturnValue({
      open: jest.fn(),
      close: jest.fn(),
      props: {
        isOpen: false,
        context: 'string',
      },
    });

    const modal = useModal();
    const { result } = renderHook(() => useBeneficiaryWizardSteps(() => null, modal as any));

    expect(result.current).toStrictEqual({
      ChoosePersonBeneficiaryOrAddNewStep: {
        nextStep: 'CreateNewBeneficiaryDetails',
        previousStep: 'CreateNewBeneficiary',
        content: expect.any(Function),
      },
      CreateNewBeneficiaryDetails: {
        nextStep: 'CreateNewBeneficiaryAddress',
        previousStep: expect.any(Function),
        content: expect.any(Function),
      },
      CreateNewBeneficiaryAddress: {
        nextStep: 'CreateNewBeneficiaryLumpSum',
        previousStep: 'CreateNewBeneficiaryDetails',
        content: expect.any(Function),
      },
      CreateCharityDetails: {
        nextStep: 'CreateNewCharityBeneficiaryLumpSum',
        previousStep: 'CreateNewBeneficiary',
        content: expect.any(Function),
      },
      CreateNewBeneficiaryLumpSum: {
        nextStep: 'SummaryView',
        previousStep: expect.any(Function),
        content: expect.any(Function),
      },
      CreateNewCharityBeneficiaryLumpSum: {
        nextStep: 'SummaryView',
        previousStep: expect.any(Function),
        content: expect.any(Function),
      },
      EditBeneficiaryDetails: {
        nextStep: 'EditBeneficiaryAddress',
        previousStep: 'SummaryView',
        content: expect.any(Function),
      },
      EditBeneficiaryAddress: {
        nextStep: 'EditBeneficiaryLumpSum',
        previousStep: 'EditBeneficiaryDetails',
        content: expect.any(Function),
      },
      EditBeneficiaryLumpSum: {
        nextStep: 'SummaryView',
        previousStep: 'EditBeneficiaryAddress',
        content: expect.any(Function),
      },
      EditCharityBeneficiaryDetails: {
        nextStep: 'EditCharityBeneficiaryLumpSum',
        previousStep: 'SummaryView',
        content: expect.any(Function),
      },
      EditCharityBeneficiaryLumpSum: {
        nextStep: 'SummaryView',
        previousStep: 'EditCharityBeneficiaryDetails',
        content: expect.any(Function),
      },
      CreateNewBeneficiary: {
        nextStep: expect.any(Function),
        previousStep: expect.any(Function),
        content: expect.any(Function),
      },
      ChooseBeneficiaryType: {
        nextStep: expect.any(Function),
        previousStep: expect.any(Function),
        content: expect.any(Function),
      },
      SummaryView: {
        nextStep: 'SummaryView',
        onEnterStep: expect.any(Function),
        previousStep: expect.any(Function),
        content: expect.any(Function),
      },
      BeneficiaryTypeCharity: {
        nextStep: 'ChooseBeneficiaryType',
        previousStep: 'ChooseBeneficiaryType',
        content: expect.any(Function),
      },
    });
  });
});
