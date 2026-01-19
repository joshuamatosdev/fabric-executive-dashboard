import React, { useRef, useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';

interface SafeResponsiveContainerProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  minWidth?: number;
  minHeight?: number;
}

/**
 * A wrapper around Recharts ResponsiveContainer that prevents warnings
 * by only rendering children after the container has valid dimensions.
 *
 * This fixes the "race condition" where React Grid Layout is still calculating
 * widget sizes and the container briefly has width/height of 0.
 */
export function SafeResponsiveContainer({
  children,
  width = '100%',
  height = '100%',
  minWidth = 0,
  minHeight = 0,
}: SafeResponsiveContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        if (offsetWidth > 0 && offsetHeight > 0) {
          setIsReady(true);
        }
      }
    };

    // Check immediately
    checkDimensions();

    // Also check on next frame in case layout hasn't settled
    const frameId = requestAnimationFrame(checkDimensions);

    // Set up ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setIsReady(true);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {isReady ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={minWidth} minHeight={minHeight}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
