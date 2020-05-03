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
  Cancel = 'cancel',
  Increase = 'increase',
  Descrease = 'descrease',
  RemoveHistory = 'remove-history',
  UpdateSetting = 'update-setting',
  ToggleLoginModal = 'toggle-login-modal',
  SetUser = 'set-user',
  StorageSync = 'storage-sync'
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
  authenticated: boolean;
  user?: firebase.User;
  lang: 'en';
  theme: ThemeState;
  session: SessionState;
  kicks: Kick[];
  timeStart?: number;
  timeEnd?: number;
  history: SessionHistory[];
  settings?: Settings;

  showLogin?: boolean;

  // created in reducer
  readonly dispatch: any;
}

export interface AppAction {
  type: Action;
  payload: any;
}

export interface Settings {
  name?: string;
  gender?: 'boy'|'girl';
  dueDate?: string;
}

export type FormMode = 'login' | 'signup' | 'forgot';

export interface FormState {
  email: string;
}

export interface LoginFormState extends FormState {
  password: string;
}

export interface SignUpFormState extends LoginFormState {
  name: string;
}
