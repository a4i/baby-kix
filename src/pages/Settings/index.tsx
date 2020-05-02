import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonGrid, IonRow, IonCol, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonToast } from '@ionic/react';
import { Action, Settings as ISettings } from '../../types';
import { Context } from '../../state';
import './styles.scss';

const Settings: React.FC = () => {
  const { dispatch, settings } = useContext(Context);
  const [toast, showToast] = useState<boolean>(false);

  const update = (key: keyof ISettings, value: any) => {
    dispatch({ type: Action.UpdateSetting, payload: { key, value } })
  }

  return (
    <IonPage className="settings">
      <IonHeader translucent={true}>
        <IonToolbar color="light">
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} color="light">
        <IonHeader collapse="condense">
          <IonToolbar color="light">
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid className="main">
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonInput
                  placeholder="Baby's Name"
                  type="text"
                  value={settings?.name}
                  onIonChange={e => update('name', e.detail.value)}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonLabel>Due Date</IonLabel>
                <IonDatetime
                  displayFormat="MM/DD/YY"
                  placeholder="Select Date"
                  value={settings?.dueDate}
                  onIonChange={e => update('dueDate', e.detail.value)}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSegment value={settings?.gender || 'boy'} onIonChange={e => update('gender', e.detail.value)}>
                <IonSegmentButton value="boy">
                  <IonLabel>Boy</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="girl">
                  <IonLabel>Girl</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="surprise">
                  <IonLabel>Surprise</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div onClick={() => showToast(true)} className="neu-button ion-activatable ion-focusable">
                Save
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonToast
        isOpen={toast}
        position="top"
        onDidDismiss={() => showToast(false)}
        message="Your settings are saved!"
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default Settings;
