'use client';

import { useState } from 'react';
import AnimationFrame from './components/AnimationFrame';
import AnimationFrame2 from './components/AnimationFrame2';
import AnimationFrame3 from './components/AnimationFrame3';
import AnimationFrame4 from './components/AnimationFrame4';
import MenuButton from './components/MenuButton';
import VersionMenu from './components/VersionMenu';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(1);

  const handleVersionChange = (version: number) => {
    setSelectedVersion(version);
  };

  return (
    <main
      style={{
        margin: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'calc(100vw - 160px)',
        height: 'calc(100vh - 160px)',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: -56, right: -56 }}>
        <MenuButton onToggle={setIsMenuOpen} />
        <VersionMenu isOpen={isMenuOpen} onVersionChange={handleVersionChange} />
      </div>
      {selectedVersion === 1 ? <AnimationFrame /> : 
       selectedVersion === 2 ? <AnimationFrame2 /> : 
       selectedVersion === 3 ? <AnimationFrame3 /> : 
       selectedVersion === 4 ? <AnimationFrame4 /> : null}
    </main>
  );
}
