import React, { useContext, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonNote, IonItemSliding, IonItemOptions, IonItemOption, IonButton, isPlatform } from '@ionic/react';
import { SessionHistory, Action } from '../../types';
import { Context } from '../../state';
import { EmptyState, DesktopHeader, MobileHeader, MobileHeaderCondensed } from '../../components';
// import './styles.scss';

function formatTime(date: number) {
  return (new Date(date)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function formatDate(date: string) {
  return (new Date(date)).toLocaleDateString('en-US');
}

const History: React.FC = () => {
  const { dispatch, ...state } = useContext(Context);

  const renderHistory = useCallback(
    () => {
      if (state.history.length) {
        return (
          <>
            <IonList>
              {state.history.map((history: SessionHistory) => (
                <IonItemSliding key={history.id}>
                  <IonItem routerLink={`/history/${history.id}`}>
                    <IonLabel>
                      <h3>{formatDate(history.date)}</h3>
                      <p>{formatTime(history.timeStart)} - {formatTime(history.timeEnd)}</p>
                    </IonLabel>
                    <IonNote slot="end">
                      {history.kicks.length}
                    </IonNote>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption color="danger" onClick={() => dispatch({ type: Action.RemoveHistory, payload: { id: history.id } })}>Delete</IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </IonList>
          </>
        )
      }

      return (
        <EmptyState
          message="No sessions"
          action={
            <IonButton fill="clear" routerLink="/counter" routerDirection="none">
              Start your first session
            </IonButton>
          }
        />
      )
    },
    [dispatch, state.history]
  );

  return (
    <IonPage className="history">
      <MobileHeader title="History" />
      <IonContent fullscreen={true} color="light">
        <MobileHeaderCondensed title="History" />
        <DesktopHeader />
        <main className="ion-padding-vertical">
          {isPlatform('desktop') &&
            <IonHeader className="u-sticky">
              <IonToolbar className="title" color="light">
                <IonTitle size="large">
                  <h1>History</h1>
                </IonTitle>
              </IonToolbar>
            </IonHeader>
          }
          {renderHistory()}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default History;
