'use client';

import React, { useEffect, useState } from 'react';

const getRandomAscii = () => {
  // ASCII printable characters range (33-126)
  const ascii = String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
  return ascii;
};

const AsciiGrid: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const CELL_SIZE = 8; // 8px grid

  useEffect(() => {
    const cols = Math.ceil(width / CELL_SIZE);
    const rows = Math.ceil(height / CELL_SIZE);
    
    const newGrid = Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => getRandomAscii())
    );
    
    setGrid(newGrid);
  }, [width, height]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.ceil(width / CELL_SIZE)}, ${CELL_SIZE}px)`,
      fontSize: '8px',
      lineHeight: '8px',
      color: 'rgba(255, 255, 255, 0.5)',
      userSelect: 'none',
    }}>
      {grid.flat().map((char, i) => (
        <div key={i} style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {char}
        </div>
      ))}
    </div>
  );
};

const AnimationFrame: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 'auto',
        aspectRatio: '16 / 9',
        background: '#f3f3f3',
        borderRadius: 8,
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <video
        src="/flower-loop.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <AsciiGrid width={dimensions.width} height={dimensions.height} />
      </div>
    </div>
  );
};

export default AnimationFrame;
