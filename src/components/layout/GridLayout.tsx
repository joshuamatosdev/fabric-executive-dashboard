import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Custom hook to get container width
function useContainerWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Re-measure on resize
    const resizeObserver = new ResizeObserver(updateWidth);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return width;
}

const useStyles = makeStyles({
  container: {
    width: '100%',
    '& .react-grid-item': {
      transitionProperty: 'transform',
    },
    '& .react-grid-item.react-grid-placeholder': {
      backgroundColor: tokens.colorBrandBackground,
      opacity: 0.2,
      ...shorthands.borderRadius('8px'),
    },
    '& .react-grid-item > .react-resizable-handle': {
      opacity: 0,
      transitionProperty: 'opacity',
      transitionDuration: '0.2s',
    },
    '& .react-grid-item:hover > .react-resizable-handle': {
      opacity: 1,
    },
  },
  editable: {
    '& .react-grid-item': {
      ...shorthands.border('1px', 'solid', 'transparent'),
      ...shorthands.borderRadius('8px'),
      ':hover': {
        ...shorthands.border('1px', 'dashed', tokens.colorBrandStroke1),
      },
    },
  },
});

// Responsive breakpoints - optimized for common screen sizes
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

// Dynamic row height calculation based on viewport
function getRowHeight(containerWidth: number): number {
  if (containerWidth >= 1200) return 50;
  if (containerWidth >= 996) return 45;
  if (containerWidth >= 768) return 40;
  return 35;
}

// Dynamic margin based on viewport
function getMargin(containerWidth: number): [number, number] {
  if (containerWidth >= 1200) return [10, 10];
  if (containerWidth >= 768) return [8, 8];
  return [6, 6];
}

interface GridLayoutProps {
  layouts: Layouts;
  isEditable?: boolean;
  onLayoutChange?: (newLayouts: Layouts) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
  onResizeStart?: () => void;
  onResizeStop?: () => void;
  children: React.ReactNode;
}

export function GridLayout({
  layouts,
  isEditable = false,
  onLayoutChange,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
  children,
}: GridLayoutProps) {
  const styles = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef);

  // Memoize the layout to prevent unnecessary re-renders
  const memoizedLayouts = useMemo(() => layouts, [layouts]);

  // Handle layout changes for all breakpoints
  const handleLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: Layouts) => {
      if (onLayoutChange) {
        onLayoutChange(allLayouts);
      }
    },
    [onLayoutChange]
  );

  const containerClass = `${styles.container} ${isEditable ? styles.editable : ''}`;
  const rowHeight = getRowHeight(width);
  const margin = getMargin(width);

  return (
    <div className={containerClass} ref={containerRef}>
      {width > 0 && (
        <ResponsiveGridLayout
          width={width}
          layouts={memoizedLayouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={rowHeight}
          margin={margin}
          containerPadding={[0, 0]}
          isDraggable={isEditable}
          isResizable={isEditable}
          onLayoutChange={handleLayoutChange}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          draggableHandle=".drag-handle"
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
        >
          {children}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
