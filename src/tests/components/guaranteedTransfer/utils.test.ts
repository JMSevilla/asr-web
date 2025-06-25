import { formKey } from '../../../components/blocks/guaranteedTransfer/utils';

describe('GuaranteedTransfer utils logic', () => {
  describe('formKey', () => {
    it('should return key with prefix', () => {
      expect(formKey('key', 'prefix')).toBe('prefix_key');
    });

    it('should return only key', () => {
      expect(formKey('key')).toBe('key');
    });
  });
});
