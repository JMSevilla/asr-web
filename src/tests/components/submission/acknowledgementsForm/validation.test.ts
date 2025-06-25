import {
  acknowledgementsFormSchema,
  AcknowledgementsFormType,
} from '../../../../components/blocks/acknowledgementsForm/validation';
import { generateFormValues } from '../../../mock';

const validForm: AcknowledgementsFormType = {
  option1: false,
  option2: false,
  option3: false,
};

describe('AcknowledgementsForm validation', () => {
  it('should validate correct acknowledgements form', () => {
    expect(
      acknowledgementsFormSchema.isValidSync(generateFormValues<AcknowledgementsFormType>(validForm)),
    ).toBeTruthy();
  });
});
