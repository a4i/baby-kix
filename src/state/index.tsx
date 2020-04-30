import React, { useReducer, ReactNode } from 'react';
import { AppState, SessionState, ThemeState } from '../types';
import { reducer } from '../reducers';

export const defaultState: AppState = {
  authenticated: false,
  lang: 'en',
  theme: ThemeState.Light,
  session: SessionState.Stopped,
  kicks: [],
  history: [],
  dispatch: () => {}
}

const storage = window.localStorage.getItem('__babykicks__');

const Context = React.createContext<AppState>(Object.assign(defaultState, storage ? JSON.parse(storage) : {}));

const { Consumer, Provider } = Context;

const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, { ...defaultState });
  const value = { ...state, dispatch };

  return (
    <Provider value={value}>
      {children}
    </Provider>
  )
}

export default AppContextProvider;
export { Consumer, Context, Provider }
