'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import AnimationFrame3 from './AnimationFrame3';

interface VersionMenuProps {
  isOpen: boolean;
  onVersionChange: (version: number) => void;
}

export default function VersionMenu({ isOpen, onVersionChange }: VersionMenuProps) {
  const [selectedVersion, setSelectedVersion] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVersionChange = (version: number) => {
    setSelectedVersion(version);
    onVersionChange(version);
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        top: 80,
        right: -16,
        width: 329,
        transform: `translateX(${isOpen ? 0 : 313}px)`,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #F7FBFF 0%, #F2F7FB 46.15%, #E2E9F0 100%)',
        borderRadius: 24,
        zIndex: 10,
        padding: '24px 0 0 0',
        position: 'absolute',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 24,
          padding: 1,
          background: 'linear-gradient(180deg, #CAD8E2 0%, #F0F8FF 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          width: '100%',
          boxSizing: 'border-box',
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'Space Mono',
            fontWeight: 700,
            fontSize: 14,
            lineHeight: '1.48em',
            color: '#000000',
          }}
        >
          Select a version:
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '0 16px 24px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {[1, 2, 3, 4].map((version) => (
          <button
            key={version}
            onClick={() => handleVersionChange(version)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: selectedVersion === version ? '0 2px 0 8px' : '0 8px',
              background: selectedVersion === version ? '#E8EEF4' : 'transparent',
              border: selectedVersion === version ? '1px solid #14B35C' : 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontFamily: 'Space Mono',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: '1.48em',
                color: '#000000',
                padding: '8px 0',
              }}
            >
              Version {version}
            </span>
            {selectedVersion === version && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: '#14B35C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={2} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
