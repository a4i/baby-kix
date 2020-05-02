import React, { useContext, useCallback, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, useIonViewDidEnter, IonLoading, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonListHeader, IonButton } from '@ionic/react';
import { useParams } from 'react-router';
import { SessionHistory, Kick } from '../../types';
import { Context } from '../../state';
import { EmptyState } from '../../components';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<SessionHistory>();

  useIonViewDidEnter(
    () => {
      const sesh = history.find((h: SessionHistory) => h.id === id);
      if (sesh) {
        setSession(sesh);
        setLoading(false);
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
        <EmptyState
          message="No kicks in session"
          action={
            <IonButton fill="clear" routerLink="/history" routerDirection="back">
              Back
            </IonButton>
          }
        />
      )
    },
    [session]
  );

  return (
    <IonPage className="history-detail">
      <IonHeader>
        <IonToolbar color="secondary" style={{ '--border-color': 'var(--ion-color-secondary)' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/history" />
          </IonButtons>
          <IonTitle>{session ? formatDate(session.date) : ''}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} color="light">
        <IonHeader collapse="condense">
          <IonToolbar color="secondary" style={{ '--border-color': 'var(--ion-color-secondary)' }}>
            <IonTitle size="large">{session ? formatDate(session.date) : ''}</IonTitle>
          </IonToolbar>
        </IonHeader>
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
        {!loading ? renderHistory() : null}
      </IonContent>
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default HistoryDetail;
