import React from 'react';
import { isPlatform, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

interface HeaderProps {
  title?: string;
}

interface MobileHeaderProps extends HeaderProps {
  backButtons?: React.ReactNode;
}

export const DesktopHeader: React.FC<HeaderProps> = () => {
  if (isPlatform('desktop')) {
    return (
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Baby Kix</IonTitle>
        </IonToolbar>
      </IonHeader>
    )
  }

  return <></>
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, backButtons }) => {
  if (isPlatform('mobile')) {
    return (
      <IonHeader>
        <IonToolbar color="light">
          {backButtons && backButtons}
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
    );
  }

  return <></>;
}

export const MobileHeaderCondensed: React.FC<HeaderProps> = ({ title }) => {
  if (isPlatform('mobile')) {
    return (
      <IonHeader collapse="condense">
        <IonToolbar className="title" color="light">
          <IonTitle size="large">
            {title}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
    );
  }

  return <></>;
}
