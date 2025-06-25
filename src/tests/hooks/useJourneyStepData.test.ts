import { usePersistentAppState } from '../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useGenericStepData } from '../../core/hooks/useGenericStepData';
import { useJourneyStepData } from '../../core/hooks/useJourneyStepData';
import { act, renderHook } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ bereavement: { form: { values: { personType: { value: 1 } }, saveForm: jest.fn() } } }),
}));

jest.mock('../../core/hooks/useGenericStepData', () => ({
  useGenericStepData: jest.fn().mockReturnValue({ save: { execute: jest.fn() } }),
}));

describe('useJourneyStepData', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  it('should parse values using parseValuesToForm and parseFormToValues', () => {
    const values = { value: 1 };
    const parseValuesToForm = jest.fn().mockReturnValue({ name: 'name2' });
    const parseFormToValues = jest.fn().mockReturnValue({ name: 'name3' });
    const { result, rerender } = renderHook(() =>
      useJourneyStepData({
        journeyType: 'bereavement',
        pageKey: 'pageKey',
        formKey: 'formKey',
        personType: 'personType',
        parseValuesToForm,
        parseFormToValues,
      }),
    );
    act(() => {
      rerender();
    });
    expect(result.current.values).toEqual({ name: 'name2' });
    result.current.save(values);
    expect(parseFormToValues).toHaveBeenCalledWith(values);
    expect(parseValuesToForm).toHaveBeenCalledWith(values);
  });

  it('should call bereavement.form.saveForm when journeyType is bereavement', () => {
    const values = { name: 'name' };
    const saveForm = jest.fn();
    jest.mocked(usePersistentAppState).mockReturnValue({ bereavement: { form: { saveForm, values: {} } } } as any);
    const { result, rerender } = renderHook(() =>
      useJourneyStepData({
        journeyType: 'bereavement',
        pageKey: 'pageKey',
        formKey: 'formKey',
        personType: 'personType',
      }),
    );
    result.current.save(values);
    act(() => {
      rerender();
    });
    expect(saveForm).toHaveBeenCalled();
  });

  it('should call stepData.save.execute when journeyType is not bereavement', () => {
    const values = { name: 'name' };
    const execute = jest.fn();
    jest.mocked(useGenericStepData).mockReturnValue({ save: { execute } as any, data: null, loading: false });
    const { result } = renderHook(() =>
      useJourneyStepData({
        journeyType: 'transfer2',
        pageKey: 'pageKey',
        formKey: 'formKey',
        personType: 'personType',
      }),
    );
    result.current.save(values);
    expect(execute).toHaveBeenCalled();
  });
});
