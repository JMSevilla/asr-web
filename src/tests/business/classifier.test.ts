import { classifierLabelByValue } from '../../business/classifier';
import { SelectOption } from '../../components';

describe('Business classifier logic', () => {
  describe('classifierLabelByValue', () => {
    const options: SelectOption[] = [
      { label: 'The First Label', value: 'first' },
      { label: 'The Second Label', value: 'second' },
    ];

    it('should find label if an option with given key exists', () => {
      expect(classifierLabelByValue(options, 'second')).toBe(options[1].label);
    });

    it('should return undefined if an option with given key does not exist', () => {
      expect(classifierLabelByValue(options, 'third')).toBe(undefined);
    });
  });
});
