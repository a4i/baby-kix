import React from 'react';
import { IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import './styles.scss';

interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, action }) => {
  return (
    <IonGrid className="emtpy-state">
      <IonRow>
        <IonCol>
          <IonImg src="assets/icon/empty.svg" />
          <div className="emtpy-state-content">
            <h1>{message}</h1>
            {action && action}
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default EmptyState;
