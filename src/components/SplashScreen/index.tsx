import React, { CSSProperties } from 'react';
import './styles.scss';

const SplashScreen: React.FC = () => {
  return (
    <div className="splash" style={{
      '--backgroundImage': 'url(assets/images/logo.png)'
    } as CSSProperties}></div>
  );
};

export default SplashScreen;
