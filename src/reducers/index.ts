import { Action, AppState, AppAction, SessionHistory, SessionState } from "../types";
import { Plugins } from '@capacitor/core';
import { firestore } from "../firebase";
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
      const recentHistory = {
        id: uniqueId(),
        date: new Date(state.timeStart!).toString(),
        timeStart: state.timeStart!,
        timeEnd: state.timeEnd!,
        kicks: state.kicks
      };

      const history = [
        {
          ...recentHistory,
        },
        ...state.history
      ];

      // ship this to firebase
      if (state.authenticated && state.user) {
        firestore.doc(`sessions/${recentHistory.id}`).set({
          ...recentHistory,
          userId: state.user.uid
        });
      }

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

      // ship this to firebase
      if (state.authenticated && state.user) {
        firestore.doc(`sessions/${action.payload.id}`).delete();
      }

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

      // ship this to firebase
      if (state.authenticated && state.user) {
        firestore.doc(`settings/${state.user.uid}`).set({
          ...newState.settings
        }, { merge: true })
      }

      break;
    case Action.ToggleLoginModal:
      newState = {
        ...state,
        showLogin: action.payload.showLogin
      };
      break;
    case Action.SetUser:
      newState = {
        ...state,
        authenticated: Boolean(action.payload.user),
        user: action.payload.user
      };
      break;
    case Action.StorageSync:
      newState = {
        ...state,
      }

      if (action.payload.history) {
        newState.history = action.payload.history;
      }

      if (action.payload.settings) {
        newState.settings = action.payload.settings;
      }

      break;
    default:
      break;
  }

  Storage.set({ key: '__babykicks__', value: JSON.stringify(newState) })

  return newState;
}
