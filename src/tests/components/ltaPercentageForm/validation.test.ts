import {
  ltaPercentageFormSchema,
  LTAPercentageFormType,
} from '../../../components/blocks/ltaPercentageForm/validation';
import { generateFormValues } from '../../mock';

const validForm: LTAPercentageFormType = {
  percentage: 1,
};

describe('LTAPercentageForm validation', () => {
  it('should validate correct scheme', () => {
    expect(ltaPercentageFormSchema.isValidSync(generateFormValues<LTAPercentageFormType>(validForm))).toBeTruthy();
  });

  it('should be invalid with undefined percentage value', () => {
    expect(
      ltaPercentageFormSchema.isValidSync(
        generateFormValues<LTAPercentageFormType>(validForm, { percentage: undefined }),
      ),
    ).toBeFalsy();
  });

  it('should be invalid with 0 percentage value', () => {
    expect(
      ltaPercentageFormSchema.isValidSync(generateFormValues<LTAPercentageFormType>(validForm, { percentage: 0 })),
    ).toBeFalsy();
  });

  it('should be invalid with 1000 percentage value', () => {
    expect(
      ltaPercentageFormSchema.isValidSync(generateFormValues<LTAPercentageFormType>(validForm, { percentage: 1000 })),
    ).toBeFalsy();
  });

  it('should be valid only with 1 or 2 digits after comma', () => {
    expect(
      ltaPercentageFormSchema.isValidSync(generateFormValues<LTAPercentageFormType>(validForm, { percentage: 1.2 })),
    ).toBeTruthy();
    expect(
      ltaPercentageFormSchema.isValidSync(generateFormValues<LTAPercentageFormType>(validForm, { percentage: 1.22 })),
    ).toBeTruthy();
    expect(
      ltaPercentageFormSchema.isValidSync(generateFormValues<LTAPercentageFormType>(validForm, { percentage: 1.222 })),
    ).toBeFalsy();
  });
});
