import { formatDate } from '../../../business/dates';
import { useBereavementSummaryDetailsValues } from '../../../components/blocks/bereavementSummary/hooks';
import {
  BereavementPersonFormValues,
  PersonContactsSelection,
} from '../../../core/contexts/persistentAppState/hooks/bereavement/form';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApi } from '../../../core/hooks/useApi';
import { renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ bereavement: { form: { values: {}, resetPersonType: jest.fn() } } }),
}));
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: undefined, loading: false }),
}));

type MockedAnswer = 'yes' | 'no' | 'dontKnow';

describe('useBereavementSummaryDetailsValues', () => {
  afterAll(jest.resetAllMocks);

  it('should return correct props', () => {
    const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
    expect(result.current.loading).toBeFalsy();
    expect(result.current.parseValue).toBeTruthy();
    expect(result.current.shouldDisplayContactPersonQuestionDetails).toBeFalsy();
    expect(result.current.shouldDisplayNextOfKinQuestionDetails).toBeFalsy();
    expect(result.current.shouldDisplayExecutorQuestionDetails).toBeFalsy();
  });

  describe('questions display values', () => {
    it('should return correct shouldDisplayNextOfKinQuestionDetails on different api responses', () => {
      mockApiQuestionsResult({ nextOfKinStatusAnswer: 'no' });
      const { result, rerender } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.shouldDisplayNextOfKinQuestionDetails).toBeFalsy();
      mockApiQuestionsResult({ nextOfKinStatusAnswer: 'yes' });
      rerender();
      expect(result.current.shouldDisplayNextOfKinQuestionDetails).toBeTruthy();
      mockApiQuestionsResult({ nextOfKinStatusAnswer: 'no', nextOfKinAboutStatusAnswer: 'no' });
      rerender();
      expect(result.current.shouldDisplayNextOfKinQuestionDetails).toBeTruthy();
    });

    it('should return correct shouldDisplayExecutorQuestionDetails on different api responses', () => {
      mockApiQuestionsResult({ executorStatusAnswer: 'no' });
      const { result, rerender } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.shouldDisplayExecutorQuestionDetails).toBeFalsy();
      mockApiQuestionsResult({ executorStatusAnswer: 'yes' });
      rerender();
      expect(result.current.shouldDisplayExecutorQuestionDetails).toBeTruthy();
      mockApiQuestionsResult({ executorStatusAnswer: 'no', executorAboutStatusAnswer: 'no' });
      rerender();
      expect(result.current.shouldDisplayExecutorQuestionDetails).toBeTruthy();
    });

    it('should return correct shouldDisplayContactPersonQuestionDetails on saved form values', () => {
      mockBereavementContactSelectionAnswer('OTHER');
      const { result, rerender } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.shouldDisplayContactPersonQuestionDetails).toBeFalsy();
      mockBereavementContactSelectionAnswer('YOU');
      rerender();
      expect(result.current.shouldDisplayContactPersonQuestionDetails).toBeTruthy();
      mockBereavementContactSelectionAnswer('NEXT_OF_KIN');
      rerender();
      expect(result.current.shouldDisplayContactPersonQuestionDetails).toBeTruthy();
      mockBereavementContactSelectionAnswer('EXECUTOR');
      rerender();
      expect(result.current.shouldDisplayContactPersonQuestionDetails).toBeTruthy();
    });
  });

  describe('reset personType', () => {
    it('should not reset any personType if all shouldDisplay{personType}QuestionDetails are false', () => {
      const resetPersonTypeFn = jest.fn();
      jest
        .mocked(usePersistentAppState)
        .mockReturnValueOnce({ bereavement: { form: { values: {}, resetPersonType: resetPersonTypeFn } } } as any);
      renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(resetPersonTypeFn).not.toHaveBeenCalled();
    });

    it('should reset nextOfKin personType if shouldDisplayNextOfKinQuestionDetails is true', () => {
      const resetPersonTypeFn = jest.fn();
      jest
        .mocked(usePersistentAppState)
        .mockReturnValueOnce({ bereavement: { form: { values: {}, resetPersonType: resetPersonTypeFn } } } as any);
      mockApiQuestionsResult({ nextOfKinStatusAnswer: 'yes' });
      renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(resetPersonTypeFn).toHaveBeenCalledWith({ personType: 'nextOfKin' });
    });

    it('should reset executor personType if shouldDisplayNextOfKinQuestionDetails is true', () => {
      const resetPersonTypeFn = jest.fn();
      jest
        .mocked(usePersistentAppState)
        .mockReturnValueOnce({ bereavement: { form: { values: {}, resetPersonType: resetPersonTypeFn } } } as any);
      mockApiQuestionsResult({ executorStatusAnswer: 'yes' });
      renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(resetPersonTypeFn).toHaveBeenCalledWith({ personType: 'executor' });
    });

    it('should reset contactPerson personType if shouldDisplayContactPersonQuestionDetails is true', () => {
      const resetPersonTypeFn = jest.fn();
      jest.mocked(usePersistentAppState).mockReturnValueOnce({
        bereavement: { form: { values: { contactSelection: 'YOU' }, resetPersonType: resetPersonTypeFn } },
      } as any);
      renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(resetPersonTypeFn).toHaveBeenCalledWith({ personType: 'contactPerson' });
    });

    it('should reset contactSelection to YOU if nextOfKinWasSelectedAsContactAndReset is true', () => {
      const saveContactSelectionFn = jest.fn();
      jest.mocked(usePersistentAppState).mockReturnValueOnce({
        bereavement: {
          form: {
            values: { contactSelection: 'NEXT_OF_KIN', nextOfKin: undefined },
            saveContactSelection: saveContactSelectionFn,
            resetPersonType: jest.fn(),
          },
        },
      } as any);
      renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(saveContactSelectionFn).toHaveBeenCalledWith({ contactSelection: 'YOU' });
    });

    it('should reset contactSelection to YOU if executorWasSelectedAsContactAndReset is true', () => {
      const saveContactSelectionFn = jest.fn();
      jest.mocked(usePersistentAppState).mockReturnValueOnce({
        bereavement: {
          form: {
            values: { contactSelection: 'EXECUTOR', executor: undefined },
            saveContactSelection: saveContactSelectionFn,
            resetPersonType: jest.fn(),
          },
        },
      } as any);
      renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(saveContactSelectionFn).toHaveBeenCalledWith({ contactSelection: 'YOU' });
    });
  });

  describe('parseValue', () => {
    const personType = 'deceased';

    beforeEach(() => {
      jest.mocked(usePersistentAppState).mockReturnValueOnce({
        bereavement: { form: { values: { [personType]: BEREAVEMENT_FORM_MOCK }, resetPersonType: jest.fn() } },
      } as any);
    });

    it('should return correct address value', () => {
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue(personType, 'address')).toEqual(
        [
          BEREAVEMENT_FORM_MOCK.address?.line1,
          BEREAVEMENT_FORM_MOCK.address?.line2,
          BEREAVEMENT_FORM_MOCK.address?.line3,
          BEREAVEMENT_FORM_MOCK.address?.line4,
          BEREAVEMENT_FORM_MOCK.address?.line5,
          BEREAVEMENT_FORM_MOCK.address?.country,
          BEREAVEMENT_FORM_MOCK.address?.postCode,
        ]
          .filter(Boolean)
          .join(',\n')
          .split('\n'),
      );
    });

    it('should return correct pensionReferenceNumbers value', () => {
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue(personType, 'identification.pensionReferenceNumbers')).toEqual(
        BEREAVEMENT_FORM_MOCK.identification?.pensionReferenceNumbers?.filter(Boolean).join(';\n').split('\n'),
      );
    });

    it('should return correct phone value', () => {
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue(personType, 'phoneNumber')).toEqual(
        `+${[BEREAVEMENT_FORM_MOCK.phoneCode, BEREAVEMENT_FORM_MOCK.phoneNumber].join(' ')}`,
      );
    });

    it('should return correct dateOfBirth value', () => {
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue(personType, 'dateOfBirth')).toEqual(
        formatDate(BEREAVEMENT_FORM_MOCK.dateOfBirth!),
      );
    });

    it('should return correct dateOfDeath value', () => {
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue(personType, 'dateOfDeath')).toEqual(
        formatDate(BEREAVEMENT_FORM_MOCK.dateOfDeath!),
      );
    });

    it('should return correct relationship value', () => {
      const relationshipOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'relationship', label: 'Relationship Label' },
      ];
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), [], relationshipOptions));
      expect(result.current.parseValue(personType, 'relationship')).toEqual(
        relationshipOptions.find(o => o.value === BEREAVEMENT_FORM_MOCK.relationship)?.label,
      );
    });

    it('should return correct maritalStatus value', () => {
      const maritalStatus = 'married';
      mockApiStatusResult({ maritalStatus });
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue('otherType', 'maritalStatus')).toBeFalsy();
      expect(result.current.parseValue(personType, 'maritalStatus')).toEqual(maritalStatus);
    });

    it('should return correct cohabitantsStatus value', () => {
      const cohabitantsStatus = 'cohabitant';
      mockApiStatusResult({ cohabitantsStatus });
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue('otherType', 'cohabitantsStatus')).toBeFalsy();
      expect(result.current.parseValue(personType, 'cohabitantsStatus')).toEqual(cohabitantsStatus);
    });

    it('should return correct dependantsStatus value', () => {
      const dependantsStatus = 'dependants';
      mockApiStatusResult({ dependantsStatus });
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue('otherType', 'dependantsStatus')).toBeFalsy();
      expect(result.current.parseValue(personType, 'dependantsStatus')).toEqual(dependantsStatus);
    });

    it('should return correct nextOfKin question value', () => {
      const nextOfKinStatusAnswer = 'yes';
      mockApiQuestionsResult({ nextOfKinStatusAnswer });
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue('nextOfKin', 'question')).toEqual(nextOfKinStatusAnswer);
    });

    it('should return correct nextOfKin question value', () => {
      const executorStatusAnswer = 'no';
      mockApiQuestionsResult({ executorStatusAnswer });
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue('executor', 'question')).toEqual(executorStatusAnswer);
    });

    it('should return correct contactPerson question value', () => {
      const parseLabelFn = () => 'text';
      const { result, rerender } = renderHook(() => useBereavementSummaryDetailsValues(parseLabelFn, []));
      jest.mocked(usePersistentAppState).mockReturnValueOnce({
        bereavement: {
          form: { values: { contactSelection: 'YOU', reporter: BEREAVEMENT_FORM_MOCK }, resetPersonType: jest.fn() },
        },
      } as any);
      rerender();
      expect(result.current.parseValue('contactPerson', 'question')).toEqual(
        `${parseLabelFn()} (${BEREAVEMENT_FORM_MOCK.name} ${BEREAVEMENT_FORM_MOCK.surname})`,
      );
      jest.mocked(usePersistentAppState).mockReturnValueOnce({
        bereavement: {
          form: {
            values: { contactSelection: 'NEXT_OF_KIN', nextOfKin: BEREAVEMENT_FORM_MOCK },
            resetPersonType: jest.fn(),
          },
        },
      } as any);
      rerender();
      expect(result.current.parseValue('contactPerson', 'question')).toEqual(
        `${parseLabelFn()} (${BEREAVEMENT_FORM_MOCK.name} ${BEREAVEMENT_FORM_MOCK.surname})`,
      );
      jest.mocked(usePersistentAppState).mockReturnValueOnce({
        bereavement: {
          form: {
            values: { contactSelection: 'EXECUTOR', executor: BEREAVEMENT_FORM_MOCK },
            resetPersonType: jest.fn(),
          },
        },
      } as any);
      rerender();
      expect(result.current.parseValue('contactPerson', 'question')).toEqual(
        `${parseLabelFn()} (${BEREAVEMENT_FORM_MOCK.name} ${BEREAVEMENT_FORM_MOCK.surname})`,
      );
    });

    it('should return other field values correctly', () => {
      const { result } = renderHook(() => useBereavementSummaryDetailsValues(jest.fn(), []));
      expect(result.current.parseValue(personType, 'name')).toEqual(BEREAVEMENT_FORM_MOCK.name);
      expect(result.current.parseValue(personType, 'surname')).toEqual(BEREAVEMENT_FORM_MOCK.surname);
      expect(result.current.parseValue(personType, 'identification.nationalInsuranceNumber')).toEqual(
        BEREAVEMENT_FORM_MOCK.identification?.nationalInsuranceNumber,
      );
      expect(result.current.parseValue(personType, 'identification.personalPublicServiceNumber')).toEqual(
        BEREAVEMENT_FORM_MOCK.identification?.personalPublicServiceNumber,
      );
    });
  });
});

const mockApiStatusResult = (
  props: Partial<{ maritalStatus: string; cohabitantsStatus: string; dependantsStatus: string }>,
) =>
  jest.mocked(useApi).mockReturnValueOnce({
    loading: false,
    result: {
      nextOfKinStatus: { data: { answerKey: null } },
      executorStatus: { data: { answerKey: null } },
      maritalStatus: { data: { answerValue: props.maritalStatus } },
      cohabitantsStatus: { data: { answerValue: props.cohabitantsStatus } },
      dependantsStatus: { data: { answerValue: props.dependantsStatus } },
    },
  } as any);

const mockApiQuestionsResult = (
  props: Partial<{
    nextOfKinStatusAnswer: MockedAnswer;
    nextOfKinAboutStatusAnswer: MockedAnswer;
    executorStatusAnswer: MockedAnswer;
    executorAboutStatusAnswer: MockedAnswer;
  }>,
) =>
  jest.mocked(useApi).mockReturnValueOnce({
    loading: false,
    result: {
      nextOfKinStatus: { data: { answerKey: props.nextOfKinStatusAnswer, answerValue: props.nextOfKinStatusAnswer } },
      nextOfKinAboutStatus: {
        data: { answerKey: props.nextOfKinAboutStatusAnswer, answerValue: props.nextOfKinAboutStatusAnswer },
      },
      executorStatus: { data: { answerKey: props.executorStatusAnswer, answerValue: props.executorStatusAnswer } },
      executorAboutStatus: {
        data: { answerKey: props.executorAboutStatusAnswer, answerValue: props.executorAboutStatusAnswer },
      },
    },
  } as any);

const mockBereavementContactSelectionAnswer = (contactSelection: PersonContactsSelection) =>
  jest.mocked(usePersistentAppState).mockReturnValueOnce({
    bereavement: {
      form: { values: { contactSelection }, resetPersonType: jest.fn(), saveContactSelection: jest.fn() },
    },
  } as any);

const BEREAVEMENT_FORM_MOCK: BereavementPersonFormValues = {
  name: 'name',
  surname: 'surname',
  email: 'email',
  dateOfBirth: '1970-01-01',
  dateOfDeath: '1970-01-01',
  relationship: 'relationship',
  phoneCode: '44',
  phoneNumber: '12345678',
  address: {
    line1: 'line1',
    line2: 'line2',
    line3: 'line3',
    line4: 'line4',
    line5: 'line5',
    country: 'country',
    countryCode: 'countryCode',
    postCode: 'postCode',
  },
  identification: {
    type: 'type',
    nationalInsuranceNumber: 'nationalInsuranceNumber',
    personalPublicServiceNumber: 'personalPublicServiceNumber',
    pensionReferenceNumbers: ['1', '2', '3'],
  },
};
