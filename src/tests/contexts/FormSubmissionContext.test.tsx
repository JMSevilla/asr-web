import { FormSubmissionContextProvider, useFormSubmissionContext } from '../../core/contexts/FormSubmissionContext';
import { act, renderHook } from '../common';

describe('useFormSubmissionContext', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() => useFormSubmissionContext(), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <FormSubmissionContextProvider>{children}</FormSubmissionContextProvider>
      ),
    });
    expect(result.current).toEqual({
      loading: false,
      enabled: true,
      unchanged: true,
      hasCallbacks: expect.any(Function),
      hasCallback: expect.any(Function),
      submit: expect.any(Function),
      reset: expect.any(Function),
      toggleCallback: expect.any(Function),
      initiateLoading: expect.any(Function),
      init: expect.any(Function),
    });
  });

  it('should change loading state when submit is called', async () => {
    const { result, rerender } = renderHook(() => useFormSubmissionContext(), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <FormSubmissionContextProvider>{children}</FormSubmissionContextProvider>
      ),
    });
    act(() => {
      result.current.init({
        fn: () => new Promise(() => {}),
        key: 'key',
        enabled: true,
        unchanged: false,
      });
      rerender();
    });
    expect(result.current.loading).toBe(false);
    act(() => {
      result.current.submit();
    });
    expect(result.current.loading).toBe(true);
  });

  it('should change loading state when initiateLoading is called', async () => {
    const { result } = renderHook(() => useFormSubmissionContext(), {
      wrapper: ({ children }: React.PropsWithChildren<{}>) => (
        <FormSubmissionContextProvider>{children}</FormSubmissionContextProvider>
      ),
    });
    expect(result.current.loading).toBe(false);
    act(() => {
      result.current.initiateLoading();
    });
    expect(result.current.loading).toBe(true);
  });
});
