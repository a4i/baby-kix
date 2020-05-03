import React, { useContext } from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonModal } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { timerOutline, barChartOutline, settingsOutline } from 'ionicons/icons';
import Counter from '../Counter';
import History from '../History';
import HistoryDetail from '../HistoryDetail';
import Settings from '../Settings';
import './styles.scss';
import { LoginModal } from '../../modals';
import { Context } from '../../state';
import { Action } from '../../types';

const Tabs: React.FC = () => {
  const { dispatch, showLogin = false } = useContext(Context);
  // const [showLogin, setShowLogin] = useState<boolean>(false);

  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/counter" component={Counter} exact={true} />
          <Route path="/history" component={History} exact={true} />
          <Route path="/history/:id" component={HistoryDetail} exact={true} />
          <Route path="/settings" component={Settings} />
          <Route path="/" render={() => <Redirect to="/counter" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="counter" href="/counter">
            <IonIcon icon={timerOutline} />
          </IonTabButton>
          <IonTabButton tab="history" href="/history">
            <IonIcon icon={barChartOutline} />
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settingsOutline} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

      <IonModal
        isOpen={showLogin}
        onDidDismiss={() => dispatch({ type: Action.ToggleLoginModal, payload: { showLogin: false } })}
      >
        <LoginModal />
      </IonModal>
    </>
  );
};

export default Tabs;
