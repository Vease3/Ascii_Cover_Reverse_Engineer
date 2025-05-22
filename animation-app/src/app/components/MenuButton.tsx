'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';

interface MenuButtonProps {
  onToggle: (isOpen: boolean) => void;
}

export default function MenuButton({ onToggle }: MenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'linear-gradient(180deg, #F7FBFF 0%, #F2F7FB 46.15%, #E2E9F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        cursor: 'pointer',
        position: 'relative',
        border: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: '50%',
          padding: 1,
          background: 'linear-gradient(180deg, #CAD8E2 0%, #F0F8FF 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }}
      />
      <Menu size={24} color="#586571" strokeWidth={2} />
    </button>
  );
}
