import React, { useReducer, ReactNode, useEffect } from 'react';
import { AppState, SessionState, ThemeState, Action } from '../types';
import { reducer } from '../reducers';
import { auth } from '../firebase';

export const defaultState: AppState = {
  authenticated: false,
  lang: 'en',
  theme: ThemeState.Light,
  session: SessionState.Stopped,
  kicks: [],
  history: [],
  showLogin: false,
  dispatch: () => {}
}

const Context = React.createContext<AppState>(defaultState);

const { Consumer, Provider } = Context;

const AppContextProvider: React.FC<{ initialState?: AppState, children: ReactNode }> = ({ initialState, children }) => {

  const [state, dispatch] = useReducer(reducer, { ...defaultState, ...initialState });
  const value = { ...state, dispatch };

  useEffect(
    () => {
      const unsubscribe = auth.onAuthStateChanged(authState =>
        dispatch({
          type: Action.SetUser,
          payload: {
            user: authState
          }
        })
      );
      return unsubscribe;
    },
    []
  );

  return (
    <Provider value={value}>
      {children}
    </Provider>
  )
}

export default AppContextProvider;
export { Consumer, Context, Provider }
