import { AppNode, Connection, Group } from '../types';

/**
 * History step interface for undo/redo functionality
 */
export interface HistoryStep {
  nodes: AppNode[];
  connections: Connection[];
  groups: Group[];
}

/**
 * Selection rectangle for multi-select
 */
export interface SelectionRect {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/**
 * Dragging group state
 */
export interface DraggingGroupState {
  id: string;
}
