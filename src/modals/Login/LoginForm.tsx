import React, { useState, useContext } from 'react';
import { IonRow, IonCol, IonItem, IonInput, IonText, IonButton, IonLoading, IonAlert } from '@ionic/react';
import { LoginFormState, Action, SessionHistory } from '../../types';
import { auth, firestore } from '../../firebase';
import { Context } from '../../state';

export const LoginForm: React.FC<{ setMode: any }> = ({ setMode }) => {
  const { dispatch } = useContext(Context);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [state, setState] = useState<LoginFormState>({
    email: '',
    password: ''
  });

  const syncHistory = (user: firebase.User) => {
    return firestore.collection('sessions').where('userId', '==', user.uid).get()
      .then((collection) => {
        if (collection.size) {
          const history: SessionHistory[] = [];

          collection.forEach((doc) => {
            history.push({
              id: doc.id,
              ...doc.data()
            } as SessionHistory)
          })

          dispatch({
            type: Action.StorageSync,
            payload: {
              history
            }
          })
        }
      });
  }

  const syncSettings = (user: firebase.User) => {
    return firestore.doc(`settings/${user.uid}`).get()
      .then((doc) => {
        dispatch({
          type: Action.StorageSync,
          payload: {
            settings: {
              id: doc.id,
              ...doc.data()
            }
          }
        })
      })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // do firebase shit
    auth.signInWithEmailAndPassword(state.email, state.password)
      .then((result) => {
        setTimeout(() => {
          if (result.user) {
            Promise.all([
              syncHistory(result.user),
              syncSettings(result.user)
            ]).then(() => {
              setLoading(false);
              dispatch({ type: Action.ToggleLoginModal, payload: { showLogin: false } });
            })
          } else {
            setLoading(false);
            dispatch({ type: Action.ToggleLoginModal, payload: { showLogin: false } });
          }
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }

  return (
    <form onSubmit={onSubmit}>
      <IonLoading isOpen={loading} />
      <IonRow>
        <IonCol className="ion-margin-bottom">
          <IonItem lines="none" className="with-input">
            <IonInput value={state.email} name="email" type="email" placeholder="Email" onIonChange={e => setState({...state, email: e.detail.value! })}/>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-margin-bottom">
          <IonItem lines="none" className="with-input">
            <IonInput value={state.password} name="password" type="password" placeholder="Password" onIonChange={e => setState({ ...state, password: e.detail.value! })}/>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-between ion-align-items-center">
        <IonCol size="auto">
          <IonButton type="submit" color="primary">Login</IonButton>
        </IonCol>
        <IonCol size="auto">
          <IonText style={{ cursor: 'pointer' }} color="primary" onClick={() => setMode('forgot')}>
            Forgot Password?
          </IonText>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-between ion-align-items-center">
        <IonCol size="auto">
          <IonText style={{ cursor: 'pointer' }} color="primary" onClick={() => setMode('signup')}>
            Don't have an account? Sign Up
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
