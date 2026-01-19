import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Grid configuration constants - 12 is standard because it's divisible by 2, 3, 4, and 6
export const TOTAL_GRID_ROWS = 12;
export const MARGIN_Y = 10; // Vertical spacing in pixels

/**
 * Helper function to convert fractions to grid units
 * Example: toGridUnits(1, 6) = 2 (1/6th of 12 rows = 2 units)
 *
 * Common conversions:
 * - 1/12 = h: 1
 * - 1/6  = h: 2
 * - 1/4  = h: 3
 * - 1/3  = h: 4
 * - 1/2  = h: 6
 * - Full = h: 12
 */
export const toGridUnits = (numerator: number, denominator: number): number => {
  const fraction = numerator / denominator;
  return Math.round(fraction * TOTAL_GRID_ROWS);
};

// Custom hook to get window dimensions for responsive grid sizing
function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial measurement
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

// Custom hook to get container width (for responsive breakpoints)
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

/**
 * Dynamic row height calculation based on available height
 * Formula: (AvailableHeight - TotalMarginSpace) / TotalRows
 *
 * We subtract (TOTAL_GRID_ROWS + 1) * MARGIN_Y to account for:
 * - Gaps between rows (TOTAL_GRID_ROWS - 1 gaps)
 * - Top and bottom padding (2 more margins)
 */
function calculateRowHeight(availableHeight: number, marginY: number): number {
  if (availableHeight <= 0) return 50; // Fallback

  // Account for all margins: gaps between rows + top/bottom padding
  const totalMarginSpace = (TOTAL_GRID_ROWS + 1) * marginY;
  const calculatedHeight = (availableHeight - totalMarginSpace) / TOTAL_GRID_ROWS;

  // Ensure minimum row height for usability
  return Math.max(calculatedHeight, 25);
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
  const containerWidth = useContainerWidth(containerRef);
  const { height: windowHeight } = useWindowDimensions();

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
  const margin = getMargin(containerWidth);

  // Calculate available height for the grid (accounting for header, pills section, etc.)
  // The grid container typically has some offset from the top of the window
  const containerOffset = containerRef.current?.getBoundingClientRect().top ?? 150;
  const availableHeight = windowHeight - containerOffset;
  const rowHeight = calculateRowHeight(availableHeight, margin[1]);

  return (
    <div className={containerClass} ref={containerRef}>
      {containerWidth > 0 && (
        <ResponsiveGridLayout
          width={containerWidth}
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
          // compactType={null} keeps items in fixed positions - they don't auto-compact
          // This is better for strict dashboards where "Row 2" stays "Row 2"
          compactType={null}
          preventCollision={false}
        >
          {children}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
