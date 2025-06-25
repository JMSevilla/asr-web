import { useReducer } from 'react';

type State = {
  firstPaymentAmount: number;
  secondPaymentAmount: number;
  totalLumpSum: number;
  secondPaymentDate: Date;
  retirementDate: Date;
  dateOfBirth: Date | null;
};

type Action =
  | { type: 'loadInitialData'; payload: Pick<State, 'firstPaymentAmount' | 'totalLumpSum' | 'retirementDate'> }
  | { type: 'submitLumpSum'; payload: Pick<State, 'firstPaymentAmount' | 'secondPaymentDate' | 'secondPaymentAmount'> }
  | { type: 'setDateOfBirth'; payload: Date | string }
  | { type: 'reset' };

const INITIAL_STATE: State = {
  firstPaymentAmount: 0,
  secondPaymentAmount: 0,
  totalLumpSum: 0,
  secondPaymentDate: new Date(),
  retirementDate: new Date(),
  dateOfBirth: null,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'loadInitialData':
      const firstPaymentAmount =
        state.firstPaymentAmount !== 0 ? state.firstPaymentAmount : action.payload.firstPaymentAmount;
      const secondPaymentAmount =
        state.secondPaymentAmount && state.secondPaymentAmount !== 0
          ? state.secondPaymentAmount
          : action.payload.totalLumpSum - action.payload.firstPaymentAmount;
      return { ...state, ...action.payload, firstPaymentAmount, secondPaymentAmount };
    case 'submitLumpSum':
      return { ...state, ...action.payload };
    case 'setDateOfBirth':
      return { ...state, dateOfBirth: new Date(action.payload) };
    case 'reset':
      return INITIAL_STATE;
    default:
      throw new Error(`Error: used ${(action as any).type} does not exist`);
  }
}

export const useLumpSumInstallmentState = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const loadInitialData = (
    payload: Pick<State, 'firstPaymentAmount' | 'totalLumpSum' | 'retirementDate' | 'secondPaymentDate'>,
  ) => dispatch({ type: 'loadInitialData', payload });
  const submitLumpSum = (payload: Pick<State, 'firstPaymentAmount' | 'secondPaymentDate' | 'secondPaymentAmount'>) =>
    dispatch({ type: 'submitLumpSum', payload });
  const setDateOfBirth = (payload: Date | string) => dispatch({ type: 'setDateOfBirth', payload });
  const reset = () => dispatch({ type: 'reset' });

  return { state, loadInitialData, submitLumpSum, setDateOfBirth, reset };
};
