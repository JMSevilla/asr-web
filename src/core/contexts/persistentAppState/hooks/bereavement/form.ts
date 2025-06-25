import { useReducer } from 'react';

export type PersonContactsSelection = 'YOU' | 'NEXT_OF_KIN' | 'EXECUTOR' | 'OTHER';

type BereavementContactSelectionFormValues = {
  contactSelection?: PersonContactsSelection;
};

export type BereavementPersonFormValues = {
  name?: string;
  surname?: string;
  email?: string;
  unverifiedEmail?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  relationship?: string;
  phoneCode?: string;
  phoneNumber?: string;
  address?: {
    line1?: string;
    line2?: string;
    line3?: string;
    line4?: string;
    line5?: string;
    country?: string;
    countryCode?: string;
    postCode?: string;
  };
  identification?: {
    type?: string;
    nationalInsuranceNumber?: string;
    personalPublicServiceNumber?: string;
    pensionReferenceNumbers?: string[];
  };
};

export type BereavementFormValues = BereavementContactSelectionFormValues & {
  [personType: string]: BereavementPersonFormValues | undefined;
};

export enum BereavementFormStatus {
  Started = 'Started',
  NotStarted = 'NotStarted',
}

type State = { status: BereavementFormStatus; values: BereavementFormValues };

type Action =
  | { type: 'saveForm'; payload: { personType: string; values: BereavementPersonFormValues } }
  | { type: 'resetPersonType'; payload: { personType: string } }
  | { type: 'saveContactSelection'; payload: BereavementContactSelectionFormValues }
  | { type: 'start' | 'reset' };

const INITIAL_STATE: State = {
  status: BereavementFormStatus.NotStarted,
  values: {},
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'start':
      return { ...INITIAL_STATE, status: BereavementFormStatus.Started };
    case 'saveForm':
      return {
        ...state,
        status: BereavementFormStatus.Started,
        values: {
          ...state.values,
          [action.payload.personType]: {
            ...state.values[action.payload.personType],
            ...action.payload.values,
          },
        },
      };
    case 'saveContactSelection':
      return {
        ...state,
        status: BereavementFormStatus.Started,
        values: { ...state.values, ...action.payload } as BereavementFormValues,
      };
    case 'resetPersonType':
      return {
        ...state,
        status: BereavementFormStatus.Started,
        values: { ...state.values, [action.payload.personType]: undefined },
      };
    case 'reset':
      return INITIAL_STATE;
    default:
      throw new Error();
  }
}

export const useBereavementFormState = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const saveForm = (payload: { personType: string; values: BereavementPersonFormValues }) =>
    dispatch({ type: 'saveForm', payload });
  const resetPersonType = (payload: { personType: string }) => dispatch({ type: 'resetPersonType', payload });
  const saveContactSelection = (payload: BereavementContactSelectionFormValues) =>
    dispatch({ type: 'saveContactSelection', payload });
  const start = () => dispatch({ type: 'start' });
  const reset = () => dispatch({ type: 'reset' });

  return { ...state, start, saveForm, resetPersonType, saveContactSelection, reset };
};
