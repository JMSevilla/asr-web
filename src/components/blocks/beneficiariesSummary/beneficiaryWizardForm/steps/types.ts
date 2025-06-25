import { CreateNewBeneficiaryFormSteps } from './CreatePersonBeneficiarySteps';
import { EditCharityBeneficiaryFormStep } from './EditCharityBeneficiaryStep';
import { EditBeneficiaryFormSteps } from './EditPersonBeneficiarySteps';

export type BeneficiaryFormSteps =
  | 'ChooseBeneficiaryType'
  | 'SummaryView'
  | 'CreateNewBeneficiary'

  // Person branch
  // | 'BeneficiaryTypePerson'
  // | 'BeneficiaryDetails'
  // | 'BeneficiaryAddress'
  // | 'BeneficiaryLumpSum'

  // Charity branch
  | 'BeneficiaryTypeCharity'
  | EditCharityBeneficiaryFormStep
  | CreateNewBeneficiaryFormSteps
  | EditBeneficiaryFormSteps;

export interface BeneficiaryStepProps {
  isLoading: boolean;
  modalIsLoading: boolean;
}
