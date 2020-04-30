import React, { useContext, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonNote, IonRow, IonGrid, IonCol, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import { SessionHistory, Action } from '../../types';
import { Context } from '../../state';
import './styles.scss';

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
                  <IonItemOption color="danger" onClick={() => dispatch({ type: Action.RemoveHistory, payload: { id: history.id }})}>Delete</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )
      }

      return (
        <IonGrid>
          <IonRow>
            <IonCol>
              <h1>Nothing to see here yet!</h1>
            </IonCol>
          </IonRow>
        </IonGrid>
      )
    },
    [dispatch, state.history]
  );

  return (
    <IonPage className="history">
      <IonHeader>
        <IonToolbar color="primary" style={{ '--border-color': 'var(--ion-color-primary)' }}>
          <IonTitle>history</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        {/* <IonHeader collapse="condense">
          <IonToolbar color="primary" style={{ '--border-color': 'var(--ion-color-primary)' }}>
            <IonTitle size="large">History</IonTitle>
          </IonToolbar>
        </IonHeader> */}
        {renderHistory()}
      </IonContent>
    </IonPage>
  );
};

export default History;
