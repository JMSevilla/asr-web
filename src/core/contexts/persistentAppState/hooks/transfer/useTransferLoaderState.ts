import { useReducer } from 'react';

type State = { initialized: boolean };

type Action = { type: 'initialize' } | { type: 'reset' };

const INITIAL_STATE: State = {
  initialized: false,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'initialize': {
      return {
        initialized: true,
      };
    }
    case 'reset':
      return INITIAL_STATE;
    default:
      throw new Error();
  }
}

export const useTransferLoaderState = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const init = () => dispatch({ type: 'initialize' });
  const reset = () => dispatch({ type: 'reset' });

  return { ...state, init, reset };
};
