import { Action, AppState, AppAction, SessionHistory, SessionState } from "../types";
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

function uniqueId() {
  return Math.random().toString(36).substring(2, 15);
}

export function reducer(state: AppState, action: AppAction) {
  let newState: AppState = state;

  switch (action.type) {
    case Action.Start:
      const now = new Date();
      const end = now.setHours(now.getHours() + 2, now.getMinutes(), now.getSeconds());

      newState = {
        ...state,
        session: SessionState.Started,
        timeStart: (new Date()).getTime(),
        timeEnd: (new Date(end)).getTime()
      };
      break;
    case Action.Stop:
      const history = [
        {
          id: uniqueId(),
          date: new Date(state.timeStart!).toString(),
          timeStart: state.timeStart!,
          timeEnd: state.timeEnd!,
          kicks: state.kicks
        },
        ...state.history
      ];

      newState = {
        ...state,
        session: SessionState.Stopped,
        kicks: [],
        history
      };
      break;
    case Action.Cancel:
      newState = {
        ...state,
        session: SessionState.Stopped,
        kicks: [],
      };
      break;
    case Action.Increase:
      newState = {
        ...state,
        kicks: [
          {
            id: uniqueId(),
            date: (new Date()).getTime()
          },
          ...state.kicks,
        ]
      };
      break;
    case Action.Descrease:
      newState = {
        ...state,
        kicks: [
          ...state.kicks.slice(1, state.kicks.length)
        ]
      };
      break;
    case Action.RemoveHistory:
      const newHistory = [...state.history];
      const index = newHistory.findIndex((history: SessionHistory) => history.id === action.payload.id);
      newHistory.splice(index, 1);

      newState = {
        ...state,
        history: [
          ...newHistory
        ]
      };
      break;
    case Action.UpdateSetting:
      newState = {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value
        }
      };
      break;
    default:
      break;
  }

  Storage.set({ key: '__babykicks__', value: JSON.stringify(newState) })

  return newState;
}
