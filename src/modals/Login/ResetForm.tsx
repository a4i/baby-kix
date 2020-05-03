import React, { useState } from 'react';
import { IonRow, IonCol, IonItem, IonInput, IonText, IonButton, IonLoading, IonAlert } from '@ionic/react';
import { FormState } from '../../types';
import { auth } from '../../firebase';

export const ResetForm: React.FC<{ setMode: any }> = ({ setMode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [state, setState] = useState<FormState>({
    email: 'franco.valdes89@gmail.com'
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // do firebase shit
    auth.sendPasswordResetEmail(state.email)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          setMode('login')
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
            <IonInput value={state.email} name="email" type="email" placeholder="Email" onIonChange={e => setState({ ...state, email: e.detail.value! })} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-between ion-align-items-center">
        <IonCol size="auto">
          <IonButton type="submit" color="primary">Reset Password</IonButton>
        </IonCol>
        <IonCol size="auto">
          <IonText style={{ cursor: 'pointer' }} color="primary" onClick={() => setMode('login')}>
            Go Back
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
