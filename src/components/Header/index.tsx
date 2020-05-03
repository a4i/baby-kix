import React, { useContext } from 'react';
import { isPlatform, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonText, IonIcon } from '@ionic/react';
import { Context } from '../../state';
import { Action } from '../../types';
import { auth } from '../../firebase';
import { logOutOutline } from 'ionicons/icons';

interface HeaderProps {
  title?: string;
}

interface MobileHeaderProps extends HeaderProps {
  backButtons?: React.ReactNode;
}

export const DesktopHeader: React.FC<HeaderProps> = () => {
  const { dispatch, user } = useContext(Context);

  if (isPlatform('desktop')) {
    return (
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Baby Kix</IonTitle>

          <IonButtons slot="end">
            {!user ?
              <IonButton onClick={() => dispatch({ type: Action.ToggleLoginModal, payload: { showLogin: true }})}>
                Login
              </IonButton>
              :
              <>
                <IonText>
                  {user.displayName}
                </IonText>
                <IonButton onClick={() => {
                  auth.signOut();
                }}>
                  <IonIcon mode="ios" slot="icon-only" icon={logOutOutline} />
                </IonButton>
              </>
            }
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    )
  }

  return <></>
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, backButtons }) => {
  const { dispatch, user } = useContext(Context);

  if (isPlatform('mobile')) {
    return (
      <IonHeader>
        <IonToolbar color="light">
          {backButtons && backButtons}
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            {!user ?
              <IonButton onClick={() => dispatch({ type: Action.ToggleLoginModal, payload: { showLogin: true } })}>
                Login
              </IonButton>
              :
              <>
                <IonText>
                  {user.displayName}
                </IonText>
                <IonButton onClick={() => {
                  auth.signOut();
                }}>
                  <IonIcon mode="ios" slot="icon-only" icon={logOutOutline} />
                </IonButton>
              </>
            }
          </IonButtons>
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
