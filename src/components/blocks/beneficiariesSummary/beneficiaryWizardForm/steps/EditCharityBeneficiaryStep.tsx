import { WizardFormMap } from '../../../../../core/hooks/useWizardForm';
import { BeneficiaryFormType } from '../types';
import { CharityBeneficiaryLumpSumStep } from './charityBranch/CharityBeneficiaryLumpSumStep';
import { CharityDetailsStep } from './charityBranch/CharityDetailsStep';
import { BeneficiaryFormSteps, BeneficiaryStepProps } from './types';

export type EditCharityBeneficiaryFormStep = 'EditCharityBeneficiaryDetails' | 'EditCharityBeneficiaryLumpSum';

export const EditCharityBeneficiaryStep = {
  EditCharityBeneficiaryDetails: {
    nextStep: 'EditCharityBeneficiaryLumpSum',
    previousStep: 'SummaryView',
    content: props => <CharityDetailsStep {...props} />,
  },
  EditCharityBeneficiaryLumpSum: {
    nextStep: 'SummaryView',
    previousStep: 'EditCharityBeneficiaryDetails',
    content: props => <CharityBeneficiaryLumpSumStep {...props} />,
  },
} as WizardFormMap<Partial<BeneficiaryFormSteps>, BeneficiaryFormType, BeneficiaryStepProps>;
