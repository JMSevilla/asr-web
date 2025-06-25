import { WizardFormMap } from '../../../../../core/hooks/useWizardForm';
import { BeneficiaryFormType } from '../types';
import { CharityBeneficiaryLumpSumStep } from './charityBranch/CharityBeneficiaryLumpSumStep';
import { CharityDetailsStep } from './charityBranch/CharityDetailsStep';
import { BeneficiaryAddressStep } from './personBranch/BeneficiaryAddressStep';
import { BeneficiaryDetailsStep } from './personBranch/BeneficiaryDetailsStep';
import { BeneficiaryLumpSumStep } from './personBranch/BeneficiaryLumpSumStep';
import { ChoosePersonBeneficiaryOrAddNewStep } from './personBranch/ChoosePersonBeneficiaryOrAddNewStep';
import { BeneficiaryFormSteps, BeneficiaryStepProps } from './types';

export type CreateNewBeneficiaryFormSteps =
  | 'CreateNewBeneficiaryDetails'
  | 'CreateNewBeneficiaryAddress'
  | 'CreateNewBeneficiaryLumpSum'
  | 'ChoosePersonBeneficiaryOrAddNewStep'
  | 'CreateCharityDetails'
  | 'CreateNewCharityBeneficiaryLumpSum';

export const CreatePersonBeneficiarySteps = {
  ChoosePersonBeneficiaryOrAddNewStep: {
    nextStep: 'CreateNewBeneficiaryDetails',
    previousStep: 'CreateNewBeneficiary',
    content: props => <ChoosePersonBeneficiaryOrAddNewStep {...props} />,
  },
  CreateNewBeneficiaryDetails: {
    nextStep: 'CreateNewBeneficiaryAddress',
    previousStep: ({ dependantsExist }) =>
      dependantsExist ? 'ChoosePersonBeneficiaryOrAddNewStep' : 'CreateNewBeneficiary',
    content: props => <BeneficiaryDetailsStep {...props} />,
  },
  CreateNewBeneficiaryAddress: {
    nextStep: 'CreateNewBeneficiaryLumpSum',
    previousStep: 'CreateNewBeneficiaryDetails',
    content: props => <BeneficiaryAddressStep {...props} />,
  },
  CreateCharityDetails: {
    nextStep: 'CreateNewCharityBeneficiaryLumpSum',
    previousStep: 'CreateNewBeneficiary',
    content: props => <CharityDetailsStep {...props} />,
  },
  CreateNewBeneficiaryLumpSum: {
    nextStep: 'SummaryView',
    previousStep: ({ values }) => (values.type === 'PERSON' ? 'CreateNewBeneficiaryAddress' : 'CreateCharityDetails'),
    content: props => <BeneficiaryLumpSumStep {...props} />,
  },
  CreateNewCharityBeneficiaryLumpSum: {
    nextStep: 'SummaryView',
    previousStep: ({ values }) => (values.type === 'PERSON' ? 'CreateNewBeneficiaryAddress' : 'CreateCharityDetails'),
    content: props => <CharityBeneficiaryLumpSumStep {...props} />,
  },
} as WizardFormMap<Partial<BeneficiaryFormSteps>, BeneficiaryFormType, BeneficiaryStepProps>;
