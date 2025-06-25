import { ChangeLumpSumForm, changeLumpSumSchema } from '../../../components/blocks/retirementLumpSum/validation';
import { generateFormValues } from '../../mock';

const MIN = 100;
const MAX = 1000;
const validForm: ChangeLumpSumForm = { taxFreeLumpSum: 500 };
const schema = changeLumpSumSchema(MIN, MAX);

describe('Change Lump Sum Form validation', () => {
  it('should validate correct form', () => {
    expect(schema.isValidSync(generateFormValues<ChangeLumpSumForm>(validForm))).toBeTruthy();
  });

  it('should be invalid if entered value is not a number', () => {
    expect(schema.isValidSync({ taxFreeLumpSum: 'a' })).toBeFalsy();
  });

  it('should be invalid when value is lesser than minimum', () => {
    expect(schema.isValidSync({ taxFreeLumpSum: MIN - 1 })).toBeFalsy();
  });

  it('should be invalid when value is greater than maximum', () => {
    expect(schema.isValidSync({ taxFreeLumpSum: MAX + 1 })).toBeFalsy();
  });
});
