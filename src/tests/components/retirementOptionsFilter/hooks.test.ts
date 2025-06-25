import {
  RetirementOptionsFilterCheckboxesType,
  retirementOptionsFilterCheckboxKeys,
} from '../../../components/blocks/retirementOptionsFilter/RetirementOptionsFilterForm';
import { useRetirementOptionsFilterState } from '../../../components/blocks/retirementOptionsFilter/hooks';
import { act, renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: {} }, loading: false }),
}));

describe('RetirementOptionsFilter hooks', () => {
  describe('useRetirementOptionsFilterState', () => {
    const TODAY = new Date();
    const TOMORROW = new Date(new Date().setDate(new Date().getDate() + 1));

    it('returns correct date and checkboxes before and after update', () => {
      const initialCheckboxes = retirementOptionsFilterCheckboxKeys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {},
      ) as RetirementOptionsFilterCheckboxesType;
      const hook = renderHook(() => useRetirementOptionsFilterState(TODAY, initialCheckboxes));
      expect(hook.result.current.date).toBe(TODAY);
      expect(hook.result.current.checkboxes).toStrictEqual(initialCheckboxes);
      act(() => {
        hook.result.current.updateDate(TOMORROW);
        hook.result.current.updateCheckbox(retirementOptionsFilterCheckboxKeys[0], true);
      });
      hook.rerender();
      expect(hook.result.current.date.toISOString().split('T')[0]).toBe(TOMORROW.toISOString().split('T')[0]);
      expect(hook.result.current.checkboxes).toStrictEqual({
        ...initialCheckboxes,
        [retirementOptionsFilterCheckboxKeys[0]]: true,
      });
    });

    it('should return isDirty false on initial render', () => {
      const initialCheckboxes = retirementOptionsFilterCheckboxKeys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {},
      ) as RetirementOptionsFilterCheckboxesType;
      const hook = renderHook(() => useRetirementOptionsFilterState(TODAY, initialCheckboxes));
      expect(hook.result.current.isDirty).toBe(false);
      expect(hook.result.current.isDateFilterDirty).toBe(false);
      expect(hook.result.current.isAnyCheckboxDirty).toBe(false);
    });

    it('should return isDirty true when date is changed', () => {
      const initialCheckboxes = retirementOptionsFilterCheckboxKeys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {},
      ) as RetirementOptionsFilterCheckboxesType;
      const hook = renderHook(() => useRetirementOptionsFilterState(TODAY, initialCheckboxes));
      act(() => {
        hook.result.current.updateDate(TOMORROW);
      });
      hook.rerender();
      expect(hook.result.current.isDirty).toBe(true);
      expect(hook.result.current.isDateFilterDirty).toBe(true);
      expect(hook.result.current.isAnyCheckboxDirty).toBe(false);
    });

    it('should return isDirty true when checkbox is changed', () => {
      const initialCheckboxes = retirementOptionsFilterCheckboxKeys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {},
      ) as RetirementOptionsFilterCheckboxesType;
      const hook = renderHook(() => useRetirementOptionsFilterState(TODAY, initialCheckboxes));
      act(() => {
        hook.result.current.updateCheckbox(retirementOptionsFilterCheckboxKeys[0], true);
      });
      hook.rerender();
      expect(hook.result.current.isDirty).toBe(true);
      expect(hook.result.current.isDateFilterDirty).toBe(false);
      expect(hook.result.current.isAnyCheckboxDirty).toBe(true);
    });

    it('should return isDirty false when values have been changed but then saved as last submitted values', () => {
      const initialCheckboxes = retirementOptionsFilterCheckboxKeys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {},
      ) as RetirementOptionsFilterCheckboxesType;
      const hook = renderHook(() => useRetirementOptionsFilterState(TODAY, initialCheckboxes));
      act(() => {
        hook.result.current.updateDate(TOMORROW);
        hook.result.current.updateCheckbox(retirementOptionsFilterCheckboxKeys[0], true);
      });
      hook.rerender();
      act(() => {
        hook.result.current.saveLastSubmittedValues();
      });
      hook.rerender();
      expect(hook.result.current.isDirty).toBe(false);
      expect(hook.result.current.isDateFilterDirty).toBe(false);
      expect(hook.result.current.isAnyCheckboxDirty).toBe(false);
    });
  });
});
