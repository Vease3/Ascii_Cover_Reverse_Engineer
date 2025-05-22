'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ColorState {
  isActive: boolean;
  color: string;
  char: string;
}

const getRandomAscii = () => {
  const chars = ['█', '▓', '▒', '░', '■', '▪', '●', '◆', '★', '✦'];
  return chars[Math.floor(Math.random() * chars.length)];
};

const getWarmColor = (r: number, g: number, b: number): string => {
  // Simplified color detection for better performance
  if (r < 85 && g < 85 && b < 85) return '#000000';
  if (r > 200 && g > 200 && b > 200) return '#FFFFFF';
  if (g > 100 && b < g * 0.8) return '#F9B10A';
  if (g > 60 && g < r * 0.8) return '#F07015';
  return '#F03D15';
};

const isTargetColor = (r: number, g: number, b: number): boolean => {
  // Simplified detection for better performance
  if (r < 85 && g < 85 && b < 85) return true;
  if (r > 200 && g > 200 && b > 200) return true;
  if (r > g && r > b) {
    if (g > 100 && b < g * 0.8) return true;
    if (g > 60 && g < r * 0.8) return true;
    if (g > 40 && g < r * 0.9) return true;
  }
  return false;
};

const AsciiColorGrid: React.FC<{ width: number; height: number; videoRef: React.RefObject<HTMLVideoElement | null> }> = ({ width, height, videoRef }) => {
  const [colorStates, setColorStates] = useState<ColorState[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const lastFrameTime = useRef<number>(0);
  const FRAME_INTERVAL = 1000 / 30; // Cap at 30 FPS
  const CELL_SIZE = 12; // Increased cell size for better performance

  useEffect(() => {
    const cols = Math.ceil(width / CELL_SIZE);
    const rows = Math.ceil(height / CELL_SIZE);
    
    const initialStates = Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => ({
        isActive: false,
        color: '#FFD700',
        char: getRandomAscii()
      }))
    );
    
    setColorStates(initialStates);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [width, height]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !colorStates.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const analyzeFrame = (timestamp: number) => {
      if (!videoRef.current || !ctx) return;

      const elapsed = timestamp - lastFrameTime.current;
      
      if (elapsed > FRAME_INTERVAL) {
        lastFrameTime.current = timestamp;
        
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        
        const newStates = colorStates.map((row, i) =>
          row.map((cell, j) => {
            const x = j * CELL_SIZE;
            const y = i * CELL_SIZE;
            const imageData = ctx.getImageData(x, y, CELL_SIZE, CELL_SIZE);
            
            let r = 0, g = 0, b = 0;
            // Sample fewer pixels for performance
            for (let p = 0; p < imageData.data.length; p += 16) {
              r += imageData.data[p];
              g += imageData.data[p + 1];
              b += imageData.data[p + 2];
            }
            const samples = Math.ceil(imageData.data.length / 16);
            r = r / samples;
            g = g / samples;
            b = b / samples;

            return {
              ...cell,
              isActive: isTargetColor(r, g, b),
              color: getWarmColor(r, g, b)
            };
          })
        );

        setColorStates(newStates);
      }
      
      frameRef.current = requestAnimationFrame(analyzeFrame);
    };

    frameRef.current = requestAnimationFrame(analyzeFrame);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
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
        fontSize: '14px',
        lineHeight: '14px',
        userSelect: 'none',
        fontFamily: 'monospace',
        fontWeight: 900,
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
              visibility: cell.isActive ? 'visible' : 'hidden',
              color: cell.color,
              transform: `scale(${cell.isActive ? 1 : 0})`,
              fontWeight: 'bold',
            }}
          >
            {cell.char}
          </div>
        ))}
      </div>
    </>
  );
};

const AnimationFrame5: React.FC = () => {
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
        background: '#5269BE',
        borderRadius: 32,
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <video
        ref={videoRef}
        src="/flower-loop6.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: 0,
        }}
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={(e) => {
          if (videoRef.current) {
            videoRef.current.playbackRate = 1.0;
          }
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <AsciiColorGrid 
          width={dimensions.width} 
          height={dimensions.height} 
          videoRef={videoRef}
        />
      </div>
    </div>
  );
};

export default AnimationFrame5;
