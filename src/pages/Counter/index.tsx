import React, { useContext, useEffect, useState, CSSProperties, useRef, useCallback } from 'react';
import { isPlatform, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonToast, useIonViewDidEnter } from '@ionic/react';
import { differenceInSeconds } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { Plugins, HapticsImpactStyle } from '@capacitor/core';
import { AdSize, AdPosition } from 'capacitor-admob';
import { Context } from '../../state';
import { Action, SessionState } from '../../types';
import './styles.scss';

const { AdMob, Haptics } = Plugins;

function formatTime(seconds: number): string {
  const diffHours: number = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  const diffMinutes: number = Math.floor(seconds / 60);
  const diffSeconds: number = seconds % 60;

  return `${diffHours >= 99 ? '99' : (diffHours < 10 ? '0' + diffHours : diffHours)}:${diffMinutes < 10 ? '0' + diffMinutes : diffMinutes}:${diffSeconds < 10 ? '0' + diffSeconds : diffSeconds}`;
}

const Counter: React.FC = () => {
  const history = useHistory();
  const { dispatch, ...state } = useContext(Context);
  const [display, setDisplay] = useState<string>('2:00');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const interval = useRef<null|NodeJS.Timeout>(null);
  const prevSessionState = useRef<SessionState>(SessionState.Stopped);
  const adReady = useRef<boolean>(false);

  const showAd = useCallback(
    async () => {
      if (isPlatform('capacitor')) {
        // const isoAdId = isPlatform('ios') ? process.env.REACT_APP_ADMOB_INTERSTITIAL_IOS : process.env.REACT_APP_ADMOB_INTERSTITIAL_MD;
        try {
          await AdMob.prepareInterstitial({
            adId: process.env.REACT_APP_ADMOB_INTERSTITIAL_TEST, // isoAdId,
            adSize: AdSize.SMART_BANNER,
            position: AdPosition.BOTTOM_CENTER,
          });
          adReady.current = true;
        } catch (error) {
          console.log("ERROR", error)
        }
      }
    },
    []
  );

  useIonViewDidEnter(
    async () => {
      if (isPlatform('capacitor')) {
        AdMob.addListener("onAdLoaded", (info: boolean) => {
          if (adReady.current) {
            AdMob.showInterstitial();
          }
        });
      }
    },
    []
  );

  useEffect(
    () => {
      if (state.session === SessionState.Started && !interval.current) {
        // start the ticker
        interval.current = setInterval(() => {
          const now = new Date();
          const diff = differenceInSeconds(state.timeEnd!, now);

          setDisplay(formatTime(diff));

          if (diff === 0) {
            dispatch({ type: Action.Stop });
          }
        }, 1000);
      }

      if (state.session === SessionState.Stopped) {
        // clear the timer
        if (interval.current) {
          clearInterval(interval.current!);
          interval.current = null;
        }
      }

      prevSessionState.current = state.session;

      return () => {
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
        }
      }
    },
    [state.session, state.timeEnd, dispatch]
  );

  return (
    <IonPage className="counter">
      <IonHeader>
        <IonToolbar color="secondary" style={{ '--border-color': 'var(--ion-color-secondary)' }}>
          <IonTitle>Baby Kix</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <div className="neu-container">
          <div className="neu-progress" style={{
            'transform': state.session === SessionState.Started ? 'translate3d(0, -25px, 0)' : 'none',
            '--gauge-fill': state.session === SessionState.Stopped ? 'none' : 'rgba(var(--ion-color-light-rgb), 0.75)',
            '--freeze-progress': state.session === SessionState.Stopped ? 'paused' : 'running'
            } as CSSProperties}>
            <svg viewBox="0 0 100 100" className="neu-timer" fill="none" strokeWidth="2">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle className="neu-backdrop" strokeDasharray="360" r="40" cx="50" cy="50"></circle>
              <circle className="neu-gauge" fill="url(#glow)" strokeDasharray="360" r="40" cx="50" cy="50"></circle>
            </svg>

            {state.session === SessionState.Started ?
              <div className="neu-progress-content">
                <h1>{state.kicks.length}</h1>
                <h2>{display}</h2>
              </div>
            :
              <div className="neu-progress-content">
                <IonButton size="large" fill="clear" onClick={() => dispatch({ type: Action.Start })}>
                  Start<br/>Session
                </IonButton>
              </div>
            }
          </div>

          <div
            className="neu-kicker"
            style={{
              opacity: state.session === SessionState.Stopped ? 0 : 1,
              transform: state.session === SessionState.Started ? 'translate3d(0, 0, 0)' : 'translate3d(0, -25px, 0)',
            }}
          >
            <IonButton size="large" color="secondary" onClick={() => {
              if (isPlatform('capacitor')) {
                Haptics.impact({
                  style: HapticsImpactStyle.Light
                });
              }
              dispatch({ type: Action.Increase });
            }}>

              <IonIcon slot="icon-only" src="assets/icon/baby-feet.svg" />
            </IonButton>

            <IonButton fill="outline" size="small" onClick={() => {
              dispatch({ type: Action.Stop });
              setShowAlert(true);

              setTimeout(() => {
                showAd();
              }, 3000);
            }}>
              Stop Session
            </IonButton>
            <IonButton fill="clear" color="danger" size="small" onClick={() => dispatch({ type: Action.Cancel })}>
              Cancel
            </IonButton>
          </div>
        </div>
      </IonContent>

      <IonToast
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        duration={3000}
        position="top"
        message="Session Complete"
        buttons={[
        {
          side: 'end',
          text: 'View',
          handler: () => {
            history.push(`/history/${state.history[0].id}`);
          }
        }
      ]}
      />
    </IonPage>
  );
};

export default Counter;
