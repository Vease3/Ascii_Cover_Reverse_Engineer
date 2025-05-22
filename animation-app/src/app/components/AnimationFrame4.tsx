'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ColorState {
  isActive: boolean;
  color: string;
}

const getWarmColor = (r: number, g: number, b: number): string => {
  // Black/dark shades - more sensitive
  if (r < 85 && g < 85 && b < 85) {
    return '#000000'; // Pure black
  }
  // White/bright shades
  if (r > 200 && g > 200 && b > 200) {
    return '#FFFFFF'; // Pure white
  }
  // Yellow shades
  if (g > 100 && b < g * 0.8) {
    return '#F9B10A'; // Gold
  }
  // Orange shades
  if (g > 60 && g < r * 0.8 && b < g * 0.9) {
    return '#F07015'; // Orange
  }
  // Brown shades
  return '#F03D15'; // Peru (brownish)
};

const isTargetColor = (r: number, g: number, b: number): boolean => {
  // Black detection - more sensitive
  if (r < 85 && g < 85 && b < 85) return true;
  
  // White detection
  if (r > 200 && g > 200 && b > 200) return true;
  
  // More lenient detection for yellow, brown, and orange tones
  // Ensure red is the dominant color
  if (r > g && r > b) {
    // For yellows: high red, high green, low blue
    if (g > 100 && b < g * 0.8) return true;
    
    // For oranges: high red, medium green, low blue
    if (g > 60 && g < r * 0.8 && b < g * 0.9) return true;
    
    // For browns: moderate red, lower green, lowest blue
    if (g > 40 && g < r * 0.9 && b < g * 0.9) return true;
  }
  
  return false;
};

const CircleGrid: React.FC<{ width: number; height: number; videoRef: React.RefObject<HTMLVideoElement | null> }> = ({ width, height, videoRef }) => {
  const [colorStates, setColorStates] = useState<ColorState[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CELL_SIZE = 8; // 8px grid

  useEffect(() => {
    const cols = Math.ceil(width / CELL_SIZE);
    const rows = Math.ceil(height / CELL_SIZE);
    
    const initialStates = Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => ({
        isActive: false,
        color: '#FFD700'
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
            isActive: isTargetColor(r, g, b),
            color: getWarmColor(r, g, b)
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
              opacity: cell.isActive ? 0.8 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            <div
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                borderRadius: '50%',
                backgroundColor: cell.color,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

const AnimationFrame4: React.FC = () => {
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
        background: '#1F72B3',
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
        src="/flower-loop5.mp4"
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
            videoRef.current.playbackRate = 0.5;
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
        <CircleGrid 
          width={dimensions.width} 
          height={dimensions.height} 
          videoRef={videoRef}
        />
      </div>
    </div>
  );
};

export default AnimationFrame4;
