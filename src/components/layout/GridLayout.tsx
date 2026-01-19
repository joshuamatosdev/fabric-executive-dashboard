import { useMemo, useCallback } from 'react';
import { ResponsiveGridLayout, useContainerWidth } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Centralized grid configuration
export const GRID_CONFIG = {
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  rowHeight: 60, // Base row height in pixels
  margin: [16, 16] as [number, number], // [horizontal, vertical] gaps
  containerPadding: [0, 0] as [number, number],
} as const;

// Legacy exports for backward compatibility
export const TOTAL_GRID_ROWS = 12;
export const MARGIN_Y = GRID_CONFIG.margin[1];

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

const useStyles = makeStyles({
  container: {
    width: '100%',
    flex: 1,
    minHeight: 0, // Critical for flex child sizing
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

type ItemCallback = (
  layout: Layout[],
  oldItem: Layout,
  newItem: Layout,
  placeholder: Layout,
  event: MouseEvent,
  element: HTMLElement
) => void;

interface GridLayoutProps {
  layouts: Layouts;
  isEditable?: boolean;
  onLayoutChange?: (newLayouts: Layouts) => void;
  onDragStart?: ItemCallback;
  onDragStop?: ItemCallback;
  onResizeStart?: ItemCallback;
  onResizeStop?: ItemCallback;
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

  // Use library's built-in hook for width measurement
  const { width, containerRef, mounted } = useContainerWidth();

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

  return (
    <div ref={containerRef} className={containerClass}>
      {mounted && width > 0 && (
        <ResponsiveGridLayout
          width={width}
          layouts={memoizedLayouts}
          breakpoints={GRID_CONFIG.breakpoints}
          cols={GRID_CONFIG.cols}
          rowHeight={GRID_CONFIG.rowHeight}
          margin={GRID_CONFIG.margin}
          containerPadding={GRID_CONFIG.containerPadding}
          isDraggable={isEditable}
          isResizable={isEditable}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onLayoutChange={handleLayoutChange as any}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          draggableHandle=".drag-handle"
          useCSSTransforms={true}
          compactType={null}
          preventCollision={true}
        >
          {children}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
