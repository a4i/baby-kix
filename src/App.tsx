import React, { useEffect, useState } from 'react';
// import { Redirect, Route } from 'react-router-dom';
import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Plugins } from '@capacitor/core';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/fonts.scss';
import './theme/variables.scss';

/* State */
import AppContextProvider from './state';

/* Pages */
import Tabs from './pages/Tabs';
import { AppState } from './types';
import { SplashScreen as AppSplashScreen } from './components';

const { SplashScreen, Storage } = Plugins;

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AppState>();

  useEffect(
    () => {
      const initialize = async () => {
        const storage = await Storage.get({ key: '__babykicks__'});
        if (storage.value) {
          setData(JSON.parse(storage.value));
        }

        await SplashScreen.hide();

        setTimeout(() => {
          setLoading(false);
        }, 250);
      };

      initialize();
    },
    []
  );

  return (
    <IonApp>
      {loading ?
        <AppSplashScreen />
      :
        <AppContextProvider initialState={data}>
          <IonReactRouter>
            <Tabs />
          </IonReactRouter>
        </AppContextProvider>
      }
    </IonApp>
  )
};

export default App;
