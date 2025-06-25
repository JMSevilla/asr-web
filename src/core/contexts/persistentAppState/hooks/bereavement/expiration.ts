import { useReducer } from 'react';

type State = { date: Date | null; aboutToExpire: boolean };

type Action = { type: 'update'; payload: Date } | { type: 'notify' | 'reset' };

const INITIAL_STATE: State = { date: null, aboutToExpire: false };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'update':
      return { date: action.payload, aboutToExpire: false };
    case 'notify':
      return { ...state, aboutToExpire: true };
    case 'reset':
      return INITIAL_STATE;
    default:
      throw new Error();
  }
}

export const useBereavementExpirationDateState = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const update = (payload: Date) => dispatch({ type: 'update', payload });
  const notify = () => dispatch({ type: 'notify' });
  const reset = () => dispatch({ type: 'reset' });

  return { ...state, update, notify, reset };
};
