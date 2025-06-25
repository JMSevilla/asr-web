import { WizardFormMap } from '../../../../../core/hooks/useWizardForm';
import { BeneficiaryFormType } from '../types';
import { BeneficiaryAddressStep } from './personBranch/BeneficiaryAddressStep';
import { BeneficiaryDetailsStep } from './personBranch/BeneficiaryDetailsStep';
import { BeneficiaryLumpSumStep } from './personBranch/BeneficiaryLumpSumStep';
import { BeneficiaryFormSteps, BeneficiaryStepProps } from './types';

export type EditBeneficiaryFormSteps = 'EditBeneficiaryDetails' | 'EditBeneficiaryAddress' | 'EditBeneficiaryLumpSum';

export const EditPersonBeneficiarySteps = {
  EditBeneficiaryDetails: {
    nextStep: 'EditBeneficiaryAddress',
    previousStep: 'SummaryView',
    content: props => <BeneficiaryDetailsStep {...props} />,
  },
  EditBeneficiaryAddress: {
    nextStep: 'EditBeneficiaryLumpSum',
    previousStep: 'EditBeneficiaryDetails',
    content: props => <BeneficiaryAddressStep {...props} />,
  },
  EditBeneficiaryLumpSum: {
    nextStep: 'SummaryView',
    previousStep: 'EditBeneficiaryAddress',
    content: props => <BeneficiaryLumpSumStep {...props} />,
  },
} as WizardFormMap<Partial<BeneficiaryFormSteps>, BeneficiaryFormType, BeneficiaryStepProps>;
