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

const Context = React.createContext<AppState>(defaultState);

const { Consumer, Provider } = Context;

const AppContextProvider: React.FC<{ initialState?: AppState, children: ReactNode }> = ({ initialState, children }) => {

  const [state, dispatch] = useReducer(reducer, { ...defaultState, ...initialState });
  const value = { ...state, dispatch };

  return (
    <Provider value={value}>
      {children}
    </Provider>
  )
}

export default AppContextProvider;
export { Consumer, Context, Provider }
