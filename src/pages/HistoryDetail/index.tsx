import React, { useContext, useCallback, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, useIonViewDidEnter, IonLoading, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonListHeader, IonButton, isPlatform } from '@ionic/react';
import { useParams } from 'react-router';
import { SessionHistory, Kick } from '../../types';
import { Context } from '../../state';
import { EmptyState, MobileHeader, MobileHeaderCondensed, DesktopHeader } from '../../components';
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
      <MobileHeader title={session ? formatDate(session.date) : ''} backButtons={
        <>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/history" />
          </IonButtons>
        </>
      } />

      <IonContent fullscreen={true} color="light">
        <MobileHeaderCondensed title={session ? formatDate(session.date) : ''} />
        <DesktopHeader />
        <main className="ion-padding-vertical">
          {isPlatform('desktop') &&
            <IonHeader className="u-sticky">
              <IonToolbar className="title" color="light">
                <IonButtons slot="start">
                  <IonBackButton defaultHref="/history" />
                </IonButtons>
                <IonTitle size="large">
                  <h1>{session ? formatDate(session.date) : ''}</h1>
                </IonTitle>
              </IonToolbar>
            </IonHeader>
          }
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
        </main>
      </IonContent>
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default HistoryDetail;
