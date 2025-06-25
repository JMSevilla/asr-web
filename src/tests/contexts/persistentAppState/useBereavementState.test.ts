import { useBereavementState } from '../../../core/contexts/persistentAppState/hooks/bereavement';
import {
  BereavementFormStatus,
  BereavementPersonFormValues,
} from '../../../core/contexts/persistentAppState/hooks/bereavement/form';
import { act, renderHook } from '../../common';

describe('useBereavementState', () => {
  describe('expiration', () => {
    it('should return correct values after reset', async () => {
      const hook = renderHook(() => useBereavementState());
      act(() => hook.result.current.expiration.reset());
      expect(hook.result.current.expiration.date).toBe(null);
      expect(hook.result.current.expiration.aboutToExpire).toBe(false);
    });

    it('should return correct values after notify', async () => {
      const hook = renderHook(() => useBereavementState());
      act(() => hook.result.current.expiration.notify());
      expect(hook.result.current.expiration.aboutToExpire).toBe(true);
    });

    it('should return correct values after update', async () => {
      const currentDate = new Date();
      const hook = renderHook(() => useBereavementState());
      act(() => hook.result.current.expiration.update(currentDate));
      expect(hook.result.current.expiration.date).toBe(currentDate);
      expect(hook.result.current.expiration.aboutToExpire).toBe(false);
    });
  });

  describe('form', () => {
    it('should return correct values after reset', async () => {
      const hook = renderHook(() => useBereavementState());
      act(() => hook.result.current.form.reset());
      expect(hook.result.current.form.status).toBe(BereavementFormStatus.NotStarted);
      expect(hook.result.current.form.values).toStrictEqual({});
    });

    it('should return correct values after start', async () => {
      const hook = renderHook(() => useBereavementState());
      act(() => hook.result.current.form.start());
      expect(hook.result.current.form.status).toBe(BereavementFormStatus.Started);
      expect(hook.result.current.form.values).toStrictEqual({});
    });

    it('should return correct values after saveContactSelection', async () => {
      const contactSelection = 'OTHER';
      const hook = renderHook(() => useBereavementState());
      act(() => hook.result.current.form.saveContactSelection({ contactSelection }));
      expect(hook.result.current.form.status).toBe(BereavementFormStatus.Started);
      expect(hook.result.current.form.values).toStrictEqual({ contactSelection });
    });

    it('should return correct values after saveForm', async () => {
      const personType = 'person';
      const values: BereavementPersonFormValues = { name: 'test' };
      const hook = renderHook(() => useBereavementState());
      act(() => hook.result.current.form.saveForm({ personType, values }));
      expect(hook.result.current.form.status).toBe(BereavementFormStatus.Started);
      expect(hook.result.current.form.values).toStrictEqual({ [personType]: values });
      const newValues: BereavementPersonFormValues = { surname: 'tester' };
      act(() => hook.result.current.form.saveForm({ personType, values: newValues }));
      expect(hook.result.current.form.status).toBe(BereavementFormStatus.Started);
      expect(hook.result.current.form.values).toStrictEqual({ [personType]: { ...values, ...newValues } });
    });

    it('should return correct values after saveForm', async () => {
      const personType = 'person';
      const values: BereavementPersonFormValues = { name: 'test' };
      const hook = renderHook(() => useBereavementState());
      act(() => hook.result.current.form.saveForm({ personType, values }));
      expect(hook.result.current.form.status).toBe(BereavementFormStatus.Started);
      expect(hook.result.current.form.values).toStrictEqual({ [personType]: values });
      act(() => hook.result.current.form.resetPersonType({ personType }));
      expect(hook.result.current.form.status).toBe(BereavementFormStatus.Started);
      expect(hook.result.current.form.values).toStrictEqual({ [personType]: undefined });
    });
  });
});
