import { LSAQuestionForm, lsaQuestionSchema } from '../../../components/blocks/lsaQuestionForm/validation';

const MIN = 0;
const prefix = 'LSA_LSDBA_allowance_form';
const validForm: LSAQuestionForm = { paidLSACashAmount: 500, paidLSDBACashAmount: 500 };
const schema = lsaQuestionSchema(prefix);

describe('LSA LSDBA Form validation', () => {
  it('should validate correct form', () => {
    expect(schema.isValidSync(validForm)).toBeTruthy();
  });

  it('should be invalid if entered value is not a number', () => {
    expect(schema.isValidSync({ paidLSACashAmount: 'a', paidLSDBACashAmount: 500 })).toBeFalsy();
    expect(schema.isValidSync({ paidLSACashAmount: 500, paidLSDBACashAmount: 'a' })).toBeFalsy();
  });

  it('should be invalid when value is lesser than minimum', () => {
    expect(schema.isValidSync({ paidLSACashAmount: MIN - 1, paidLSDBACashAmount: 500 })).toBeFalsy();
    expect(schema.isValidSync({ paidLSACashAmount: 500, paidLSDBACashAmount: MIN - 1 })).toBeFalsy();
  });

  it('should be invalid when value is missing', () => {
    expect(schema.isValidSync({ paidLSACashAmount: undefined, paidLSDBACashAmount: 500 })).toBeFalsy();
    expect(schema.isValidSync({ paidLSACashAmount: 500, paidLSDBACashAmount: undefined })).toBeFalsy();
  });
});
