import React, { useContext, useCallback, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, useIonViewDidEnter, IonLoading, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonListHeader } from '@ionic/react';
import { SessionHistory, Kick } from '../../types';
import { Context } from '../../state';
import { useParams } from 'react-router';
import './styles.scss';

function formatTime(date: number) {
  return (new Date(date)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
}

function formatDate(date: string) {
  return (new Date(date)).toLocaleDateString('en-US');
}

const HistoryDetail: React.FC = () => {
  const { id } = useParams();
  const { history } = useContext(Context);
  const [session, setSession] = useState<SessionHistory>();

  useIonViewDidEnter(
    () => {
      const sesh = history.find((h: SessionHistory) => h.id === id);
      if (sesh) {
        setSession(sesh);
      }
    },
    [id]
  )

  const renderHistory = useCallback(
    () => {
      if (session && session.kicks.length) {
        return (
          <IonList>
            <IonListHeader>
              <IonLabel>
                Kicks ({session.kicks.length})
              </IonLabel>
            </IonListHeader>
            {session.kicks.map((kick: Kick) => (
              <IonItem key={kick.id}>
                <IonLabel>
                  <h3>{formatTime(kick.date)}</h3>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )
      }

      return (
        <IonLoading isOpen={true} />
      )
    },
    [session]
  );

  return (
    <IonPage className="history-detail">
      <IonHeader>
        <IonToolbar color="primary" style={{ '--border-color': 'var(--ion-color-primary)' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/history" />
          </IonButtons>
          <IonTitle>{session ? formatDate(session.date) : ''}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <span className="eyebrow">Start Time</span>
              {session && <h4>{formatTime(session.timeStart)}</h4>}
            </IonCol>
            <IonCol className="ion-text-center">
              <span className="eyebrow">End Time</span>
              {session && <h4>{formatTime(session.timeEnd)}</h4>}
            </IonCol>
          </IonRow>
        </IonGrid>
        {renderHistory()}
      </IonContent>
    </IonPage>
  );
};

export default HistoryDetail;
