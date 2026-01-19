import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Grid configuration constants
const TOTAL_GRID_ROWS = 12;
const MARGIN_Y = 10; // Vertical margin between items

// Custom hook to get container dimensions
function useContainerDimensions(ref: React.RefObject<HTMLElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Re-measure on resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
}

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100%',
    minHeight: '500px',
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

// Dynamic row height calculation based on container height
// Formula: (ContainerHeight - TotalMarginSpace) / TotalRows
function calculateRowHeight(containerHeight: number, marginY: number): number {
  if (containerHeight <= 0) return 50; // Fallback

  // Account for margins between rows (TotalRows - 1 gaps)
  const totalMarginSpace = (TOTAL_GRID_ROWS - 1) * marginY;
  const calculatedHeight = (containerHeight - totalMarginSpace) / TOTAL_GRID_ROWS;

  // Ensure minimum row height for usability
  return Math.max(calculatedHeight, 30);
}

// Dynamic margin based on viewport width
function getMargin(containerWidth: number): [number, number] {
  if (containerWidth >= 1200) return [10, MARGIN_Y];
  if (containerWidth >= 768) return [8, MARGIN_Y];
  return [6, MARGIN_Y];
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
  const { width, height } = useContainerDimensions(containerRef);

  // Memoize the layout and mark items as static when not editable
  const memoizedLayouts = useMemo(() => {
    if (isEditable) {
      return layouts;
    }
    // When not editable, mark all items as static to prevent any dragging/resizing
    const staticLayouts: Layouts = {};
    for (const [breakpoint, layoutItems] of Object.entries(layouts)) {
      staticLayouts[breakpoint] = layoutItems.map((item: Layout) => ({
        ...item,
        static: true,
      }));
    }
    return staticLayouts;
  }, [layouts, isEditable]);

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
  const margin = getMargin(width);
  const rowHeight = calculateRowHeight(height, margin[1]);

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
