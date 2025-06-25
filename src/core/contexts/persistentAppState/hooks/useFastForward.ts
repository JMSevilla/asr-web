import { useMemo, useReducer } from 'react';
import { logger } from '../../../datadog-logs';

type EditStatus = {
  edit: boolean;
  nextPageKey?: string;
  summaryPageKey?: string;
  contactPageKey?: string;
};

type State = { [journey: string]: EditStatus };

type PayloadParams = {
  nextPageKey: string;
  summaryPageKey: string;
  journeyType: string;
  contactPageKey?: string;
};

type Action =
  | { type: 'init'; payload: PayloadParams }
  | { type: 'resetJourney'; payload: { journeyType: string } }
  | { type: 'reset' };

const INITIAL_STATE: State = {};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
        [action.payload.journeyType]: {
          edit: true,
          nextPageKey: action.payload.nextPageKey,
          summaryPageKey: action.payload.summaryPageKey,
          contactPageKey: action.payload.contactPageKey,
        },
      };
    }
    case 'resetJourney':
      return {
        ...state,
        [action.payload.journeyType]: {
          edit: false,
          nextPageKey: undefined,
          summaryPageKey: undefined,
        },
      };
    case 'reset':
      return INITIAL_STATE;
    default:
      const errorMsg = 'Error: Unknown action type passed in fast forward reducer';
      logger.error(errorMsg);
      throw new Error(errorMsg);
  }
}

export const useFastForward = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return useMemo(
    () => ({
      state,
      shouldGoToSummary: (journeyType: PayloadParams['journeyType'], nextPageKey: PayloadParams['nextPageKey']) =>
        state[journeyType]?.edit &&
        state[journeyType]?.summaryPageKey &&
        state[journeyType]?.nextPageKey === nextPageKey,
      shouldGoToContact: (journeyType: PayloadParams['journeyType'], nextPageKey: PayloadParams['nextPageKey']) =>
        state[journeyType]?.edit &&
        state[journeyType]?.contactPageKey &&
        state[journeyType]?.nextPageKey === nextPageKey,
      init: (payload: PayloadParams) => dispatch({ type: 'init', payload }),
      reset: (journeyType: PayloadParams['journeyType']) =>
        dispatch({ type: 'resetJourney', payload: { journeyType } }),
      resetAll: () => dispatch({ type: 'reset' }),
    }),
    [state],
  );
};
