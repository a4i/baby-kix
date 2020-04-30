export enum ThemeState {
  Light = 'light',
  Dark = 'dark'
}

export enum SessionState {
  Started = 'started',
  Stopped = 'stopped'
}

export enum Action {
  Start = 'start',
  Stop = 'stop',
  Increase = 'increase',
  Descrease = 'descrease',
  RemoveHistory = 'remove-history'
}

export interface Kick {
  id: string;
  date: number;
}

export interface SessionHistory {
  id: string;
  date: string;
  timeStart: number;
  timeEnd: number;
  kicks: Kick[];
}

export interface AppState {
  authenticated: false;
  lang: 'en';
  theme: ThemeState;
  session: SessionState;
  kicks: Kick[];
  timeStart?: number;
  timeEnd?: number;
  history: SessionHistory[];

  // created in reducer
  readonly dispatch: any;
}

export interface AppAction {
  type: Action;
  payload: any;
}
