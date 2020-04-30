import React from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { timerOutline, barChartOutline, settingsOutline } from 'ionicons/icons';
import Counter from '../Counter';
import History from '../History';
import HistoryDetail from '../HistoryDetail';
import Settings from '../Settings';
import './styles.scss';

const Tabs: React.FC = () => {
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
    </>
  );
};

export default Tabs;
