import React, { useState, useContext } from 'react';
import { IonRow, IonCol, IonItem, IonInput, IonText, IonButton, IonLoading, IonAlert } from '@ionic/react';
import { SignUpFormState, Action, SessionHistory } from '../../types';
import { auth, firestore } from '../../firebase';
import { Context } from '../../state';

export const SignUpForm: React.FC<{ setMode: any }> = ({ setMode }) => {
  const { dispatch, history, settings } = useContext(Context);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [state, setState] = useState<SignUpFormState>({
    name: '',
    email: '',
    password: ''
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // do firebase shit
    auth.createUserWithEmailAndPassword(state.email, state.password)
      .then((result) => {
        // wait an close
        if (result.user) {
          const { user } = result;
          user.updateProfile({
            displayName: state.name
          });

          // sync up any local stuff to firebase
          if (history.length) {
            history.forEach((session: SessionHistory) => {
              firestore.doc(`sessions/${session.id}`).set({
                ...session,
                userId: user.uid
              });
            });
          }

          firestore.doc(`settings/${user.uid}`).set({
            ...settings,
            id: user.uid
          });

          setLoading(false);
          dispatch({ type: Action.ToggleLoginModal, payload: { showLogin: false }});
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        setLoading(false);
      });
  }

  return (
    <form onSubmit={onSubmit}>
      <IonLoading isOpen={loading} />
      <IonRow>
        <IonCol className="ion-margin-bottom">
          <IonItem lines="none" className="with-input">
            <IonInput value={state.name} name="name" type="text" placeholder="Full Name" onIonChange={e => setState({ ...state, name: e.detail.value! })} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-margin-bottom">
          <IonItem lines="none" className="with-input">
            <IonInput value={state.email} name="email" type="email" placeholder="Email" onIonChange={e => setState({ ...state, email: e.detail.value! })} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-margin-bottom">
          <IonItem lines="none" className="with-input">
            <IonInput value={state.password} name="password" type="password" placeholder="Password" onIonChange={e => setState({ ...state, password: e.detail.value! })} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-between ion-align-items-center">
        <IonCol size="auto">
          <IonButton type="submit" color="primary">Sign Up</IonButton>
        </IonCol>
        <IonCol size="auto">
          <IonText style={{ cursor: 'pointer' }} color="primary" onClick={() => setMode('login')}>
            Already have an account? Login
          </IonText>
        </IonCol>
      </IonRow>
      <IonAlert
        isOpen={Boolean(error)}
        header="Whoops"
        message={error}
        buttons={['Ok']}
      />
    </form>
  )
}
