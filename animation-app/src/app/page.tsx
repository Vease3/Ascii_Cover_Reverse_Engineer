'use client';

import { useState } from 'react';
import AnimationFrame from './components/AnimationFrame';
import MenuButton from './components/MenuButton';
import VersionMenu from './components/VersionMenu';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <VersionMenu isOpen={isMenuOpen} />
      </div>
      <AnimationFrame />
    </main>
  );
}
