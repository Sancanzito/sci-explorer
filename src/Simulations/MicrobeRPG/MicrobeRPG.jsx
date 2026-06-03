import React from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';

const MicrobeRPG = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <GameCanvas />
      <GameUI />
    </div>
  );
};

export default MicrobeRPG;