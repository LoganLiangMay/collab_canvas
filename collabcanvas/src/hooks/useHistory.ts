import { useState, useCallback, useRef, useEffect } from 'react';
import type { Shape } from '../types/shape.types';

export type HistoryAction = 'create' | 'update' | 'delete';

export interface HistoryEntry {
  type: HistoryAction;
  shapeId: string;
  before: Shape | null; // null for create operations
  after: Shape | null;  // null for delete operations
  timestamp: number;
}

interface UseHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
  recordCreate: (shape: Shape) => void;
  recordUpdate: (before: Shape, after: Shape) => void;
  recordDelete: (shape: Shape) => void;
  clear: () => void;
  historyLength: number;
  redoLength: number;
}

const MAX_HISTORY_SIZE = 50; // Limit history to prevent memory issues

export function useHistory(): UseHistoryReturn {
  const [undoStack, setUndoStack] = useState<HistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);
  
  // Track if we're currently performing an undo/redo to prevent recording those operations
  const isUndoRedoOperation = useRef(false);

  // Record a shape creation
  const recordCreate = useCallback((shape: Shape) => {
    if (isUndoRedoOperation.current) return;

    const entry: HistoryEntry = {
      type: 'create',
      shapeId: shape.id,
      before: null,
      after: { ...shape }, // Clone the shape
      timestamp: Date.now(),
    };

    setUndoStack(prev => {
      const newStack = [...prev, entry];
      // Limit history size
      if (newStack.length > MAX_HISTORY_SIZE) {
        return newStack.slice(-MAX_HISTORY_SIZE);
      }
      return newStack;
    });

    // Clear redo stack when new action is performed
    setRedoStack([]);

    console.log('[useHistory] Recorded CREATE:', entry.shapeId);
  }, []);

  // Record a shape update
  const recordUpdate = useCallback((before: Shape, after: Shape) => {
    if (isUndoRedoOperation.current) return;

    // Don't record if shapes are identical
    if (JSON.stringify(before) === JSON.stringify(after)) {
      return;
    }

    const entry: HistoryEntry = {
      type: 'update',
      shapeId: after.id,
      before: { ...before }, // Clone before state
      after: { ...after },   // Clone after state
      timestamp: Date.now(),
    };

    setUndoStack(prev => {
      const newStack = [...prev, entry];
      // Limit history size
      if (newStack.length > MAX_HISTORY_SIZE) {
        return newStack.slice(-MAX_HISTORY_SIZE);
      }
      return newStack;
    });

    // Clear redo stack when new action is performed
    setRedoStack([]);

    console.log('[useHistory] Recorded UPDATE:', entry.shapeId);
  }, []);

  // Record a shape deletion
  const recordDelete = useCallback((shape: Shape) => {
    if (isUndoRedoOperation.current) return;

    const entry: HistoryEntry = {
      type: 'delete',
      shapeId: shape.id,
      before: { ...shape }, // Clone the shape
      after: null,
      timestamp: Date.now(),
    };

    setUndoStack(prev => {
      const newStack = [...prev, entry];
      // Limit history size
      if (newStack.length > MAX_HISTORY_SIZE) {
        return newStack.slice(-MAX_HISTORY_SIZE);
      }
      return newStack;
    });

    // Clear redo stack when new action is performed
    setRedoStack([]);

    console.log('[useHistory] Recorded DELETE:', entry.shapeId);
  }, []);

  // Undo the last action
  const undo = useCallback((): HistoryEntry | null => {
    if (undoStack.length === 0) return null;

    const entry = undoStack[undoStack.length - 1];
    
    // Mark that we're performing an undo operation
    isUndoRedoOperation.current = true;

    // Remove from undo stack and add to redo stack
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, entry]);

    console.log('[useHistory] UNDO:', entry.type, entry.shapeId);

    // Reset flag after a brief delay to allow the operation to complete
    setTimeout(() => {
      isUndoRedoOperation.current = false;
    }, 100);

    return entry;
  }, [undoStack]);

  // Redo the last undone action
  const redo = useCallback((): HistoryEntry | null => {
    if (redoStack.length === 0) return null;

    const entry = redoStack[redoStack.length - 1];
    
    // Mark that we're performing a redo operation
    isUndoRedoOperation.current = true;

    // Remove from redo stack and add back to undo stack
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, entry]);

    console.log('[useHistory] REDO:', entry.type, entry.shapeId);

    // Reset flag after a brief delay to allow the operation to complete
    setTimeout(() => {
      isUndoRedoOperation.current = false;
    }, 100);

    return entry;
  }, [redoStack]);

  // Clear all history
  const clear = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
    console.log('[useHistory] Cleared history');
  }, []);

  return {
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undo,
    redo,
    recordCreate,
    recordUpdate,
    recordDelete,
    clear,
    historyLength: undoStack.length,
    redoLength: redoStack.length,
  };
}

