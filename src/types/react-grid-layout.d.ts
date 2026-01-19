import * as React from 'react';
import 'react-grid-layout';

declare module 'react-grid-layout' {
  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    moved?: boolean;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
    isBounded?: boolean;
  }

  export interface Layouts {
    [breakpoint: string]: Layout[];
  }

  export interface UseContainerWidthResult {
    width: number;
    containerRef: React.RefObject<HTMLDivElement>;
    mounted: boolean;
  }

  export function useContainerWidth(): UseContainerWidthResult;

  type ItemCallback = (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    event: MouseEvent,
    element: HTMLElement
  ) => void;

  export interface ResponsiveGridLayoutProps {
    width: number;
    layouts?: Layouts;
    breakpoints?: { [breakpoint: string]: number };
    cols?: { [breakpoint: string]: number };
    rowHeight?: number;
    margin?: [number, number] | { [breakpoint: string]: [number, number] };
    containerPadding?: [number, number] | { [breakpoint: string]: [number, number] };
    isDraggable?: boolean;
    isResizable?: boolean;
    isBounded?: boolean;
    useCSSTransforms?: boolean;
    compactType?: 'vertical' | 'horizontal' | null;
    preventCollision?: boolean;
    draggableHandle?: string;
    draggableCancel?: string;
    onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
    onBreakpointChange?: (newBreakpoint: string, newCols: number) => void;
    onDragStart?: ItemCallback;
    onDrag?: ItemCallback;
    onDragStop?: ItemCallback;
    onResizeStart?: ItemCallback;
    onResize?: ItemCallback;
    onResizeStop?: ItemCallback;
    children?: React.ReactNode;
  }

  export class ResponsiveGridLayout extends React.Component<ResponsiveGridLayoutProps> {}
}
