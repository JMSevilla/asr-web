import { useFormSubmissionContext } from '../../core/contexts/FormSubmissionContext';
import { useFormSubmissionBindingHooks, useFormSubmissionState } from '../../core/hooks/useFormSubmissionBindingHooks';
import { act, renderHook } from '../common';

jest.mock('../../core/contexts/FormSubmissionContext', () => ({ useFormSubmissionContext: jest.fn() }));

describe('useFormSubmissionBindingHooks', () => {
  describe('useFormSubmissionBindingHooks', () => {
    it('should call init with the correct payload', () => {
      const cb = jest.fn();
      const formSubmission = {
        init: jest.fn(),
        reset: jest.fn(),
        submit: jest.fn(),
        toggleCallback: jest.fn(),
        hasCallback: () => false,
        hasCallbacks: () => false,
        initiateLoading: () => {},
        enabled: true,
        loading: false,
        unchanged: true,
      };
      jest.mocked(useFormSubmissionContext).mockReturnValue(formSubmission);
      const { rerender } = renderHook(() =>
        useFormSubmissionBindingHooks({ key: 'key', isValid: formSubmission.enabled, cb }),
      );
      act(() => rerender());
      expect(formSubmission.init).toHaveBeenCalled();
    });

    it('should call reset when the component unmounts', () => {
      const cb = jest.fn();
      const formSubmission = {
        init: jest.fn(),
        reset: jest.fn(),
        submit: jest.fn(),
        toggleCallback: jest.fn(),
        hasCallback: () => false,
        hasCallbacks: () => false,
        initiateLoading: () => {},
        enabled: true,
        loading: false,
        unchanged: true,
      };
      jest.mocked(useFormSubmissionContext).mockReturnValue(formSubmission);
      const { unmount } = renderHook(() =>
        useFormSubmissionBindingHooks({ key: 'key', isValid: formSubmission.enabled, cb }),
      );
      act(() => unmount());
      expect(formSubmission.reset).toHaveBeenCalled();
    });

    it('should call toggle when isValid has changed', async () => {
      const cb = jest.fn();
      const formSubmission = {
        init: jest.fn(),
        reset: jest.fn(),
        submit: jest.fn(),
        toggleCallback: jest.fn(),
        hasCallback: () => false,
        hasCallbacks: () => false,
        initiateLoading: () => {},
        enabled: false,
        loading: false,
        unchanged: true,
      };
      jest.mocked(useFormSubmissionContext).mockReturnValue(formSubmission);
      const { rerender } = renderHook((props: { key: string; isValid: boolean; cb: AsyncFunction }) =>
        useFormSubmissionBindingHooks({ ...props }),
      );

      expect(formSubmission.toggleCallback).toHaveBeenCalledTimes(1);
      act(() => rerender({ key: 'key', isValid: !formSubmission.enabled, cb }));
      expect(formSubmission.toggleCallback).toHaveBeenCalledTimes(2);
    });

    it('should call toggle when unchanged has changed', () => {
      const cb = jest.fn();
      const formSubmission = {
        init: jest.fn(),
        reset: jest.fn(),
        submit: jest.fn(),
        toggleCallback: jest.fn(),
        hasCallback: () => false,
        hasCallbacks: () => false,
        initiateLoading: () => {},
        enabled: true,
        loading: false,
        unchanged: true,
      };
      jest.mocked(useFormSubmissionContext).mockReturnValue(formSubmission);
      const { rerender } = renderHook(
        (props: { key: string; isValid: boolean; isDirty?: boolean; cb: AsyncFunction }) =>
          useFormSubmissionBindingHooks({ ...props }),
      );
      expect(formSubmission.toggleCallback).toHaveBeenCalledTimes(1);
      act(() => rerender({ key: 'key', isValid: formSubmission.enabled, isDirty: formSubmission.unchanged, cb }));
      expect(formSubmission.toggleCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('useFormSubmissionState', () => {
    it('should return the correct values', () => {
      const formSubmission = {
        init: jest.fn(),
        reset: jest.fn(),
        submit: jest.fn(),
        toggleCallback: jest.fn(),
        hasCallback: () => false,
        hasCallbacks: () => false,
        initiateLoading: () => {},
        enabled: true,
        loading: false,
        unchanged: true,
      };
      jest.mocked(useFormSubmissionContext).mockReturnValue(formSubmission);
      const { result } = renderHook(() => useFormSubmissionState());
      expect(result.current).toEqual({
        isValid: formSubmission.enabled,
        isDirty: !formSubmission.unchanged,
        isSubmitting: formSubmission.loading,
      });
    });
  });
});
