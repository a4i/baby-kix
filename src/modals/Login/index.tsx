import React, { useContext, useState, useCallback } from 'react';
import { IonPage, IonHeader, IonContent, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import { close } from 'ionicons/icons';
import { Context } from '../../state';
import { Action, FormMode } from '../../types';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ResetForm } from './ResetForm';
// import './styles.scss';

const Login: React.FC = () => {
  const { dispatch } = useContext(Context);
  const [mode, setMode] = useState<FormMode>('login');

  let Form = LoginForm;
  if (mode === 'signup') {
    Form = SignUpForm;
  } else if (mode === 'forgot') {
    Form = ResetForm;
  }

  const mapHeading = useCallback(
    () => {
      switch (mode) {
        case 'signup':
          return 'Create Account';
        case 'forgot':
          return 'Reset Password';
        case 'login':
        default:
          return 'Login';
      }
    },
    [mode]
  );

  const mapMessage = useCallback(
    () => {
      switch (mode) {
        case 'signup':
          return 'Create an account to save your history across all your devices.';
        case 'forgot':
          return 'It\'s ok, use your email to to reset your password.';
        case 'login':
        default:
          return 'Login to get session history and settings.';
      }
    },
    [mode]
  )

  return (
    <IonPage>
      <IonContent color="light">
        <IonHeader>
          <IonToolbar color="secondary">
            <IonTitle>{mapHeading()}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => dispatch({ type: Action.ToggleLoginModal, payload: { showLogin: false } })}>
                <IonIcon slot="icon-only" icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol>
              <p>{mapMessage()}</p>
            </IonCol>
          </IonRow>
          <Form
            setMode={setMode}
          />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
