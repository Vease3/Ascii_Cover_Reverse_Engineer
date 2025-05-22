'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ColorState {
  isActive: boolean;
  char: string;
}

const getRandomAscii = () => {
  // ASCII printable characters range (33-126)
  const ascii = String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
  return ascii;
};

const isTargetColor = (r: number, g: number, b: number): boolean => {
  // Yellow detection
  if (r > 200 && g > 200 && b < 100) return true;
  // Green detection
  if (g > 150 && r < 150 && b < 150) return true;
  // Redish pink detection
  if (r > 200 && g < 150 && b > 100) return true;
  return false;
};

const AsciiGrid: React.FC<{ width: number; height: number; videoRef: React.RefObject<HTMLVideoElement | null> }> = ({ width, height, videoRef }) => {
  const [colorStates, setColorStates] = useState<ColorState[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CELL_SIZE = 8; // 8px grid

  useEffect(() => {
    const cols = Math.ceil(width / CELL_SIZE);
    const rows = Math.ceil(height / CELL_SIZE);
    
    const initialStates = Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => ({
        isActive: false,
        char: getRandomAscii()
      }))
    );
    
    setColorStates(initialStates);
  }, [width, height]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !colorStates.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const analyzeFrame = () => {
      if (!videoRef.current || !ctx) return;
      
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      
      const newStates = colorStates.map((row, i) =>
        row.map((cell, j) => {
          const x = j * CELL_SIZE;
          const y = i * CELL_SIZE;
          const imageData = ctx.getImageData(x, y, CELL_SIZE, CELL_SIZE);
          
          // Calculate average color for the cell
          let r = 0, g = 0, b = 0;
          for (let p = 0; p < imageData.data.length; p += 4) {
            r += imageData.data[p];
            g += imageData.data[p + 1];
            b += imageData.data[p + 2];
          }
          const pixels = (CELL_SIZE * CELL_SIZE);
          r = r / pixels;
          g = g / pixels;
          b = b / pixels;

          return {
            ...cell,
            isActive: isTargetColor(r, g, b)
          };
        })
      );

      setColorStates(newStates);
      requestAnimationFrame(analyzeFrame);
    };

    analyzeFrame();
  }, [videoRef, width, height, colorStates.length]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
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
        {colorStates.flat().map((cell, i) => (
          <div
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: cell.isActive ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {cell.char}
          </div>
        ))}
      </div>
    </>
  );
};

const AnimationFrame: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        ref={videoRef}
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
        <AsciiGrid 
          width={dimensions.width} 
          height={dimensions.height} 
          videoRef={videoRef}
        />
      </div>
    </div>
  );
};

export default AnimationFrame;
