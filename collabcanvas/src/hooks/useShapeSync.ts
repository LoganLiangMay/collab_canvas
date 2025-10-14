import { useEffect, useState, useCallback, useRef } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Shape } from '../types/shape.types';
import { errorLogger } from '../utils/errorLogger';

const CANVAS_ID = 'global-canvas-v1';
const SHAPES_COLLECTION = 'shapes';
const LOCK_TIMEOUT_MS = 5000; // Auto-unlock after 5 seconds

interface UseShapeSyncReturn {
  shapes: Shape[];
  loading: boolean;
  error: string | null;
  createShape: (shape: Omit<Shape, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateShape: (id: string, updates: Partial<Shape>) => Promise<void>;
  deleteShape: (id: string) => Promise<void>;
  lockShape: (id: string, userId: string) => Promise<void>;
  unlockShape: (id: string) => Promise<void>;
}

export function useShapeSync(): UseShapeSyncReturn {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track lock timeouts to auto-unlock after inactivity
  const lockTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Firestore collection reference for shapes
  const shapesCollectionRef = collection(db, 'canvases', CANVAS_ID, SHAPES_COLLECTION);

  // Subscribe to real-time updates from shapes collection
  useEffect(() => {
    console.log('[useShapeSync] Setting up Firestore listener...');
    
    const unsubscribe = onSnapshot(
      shapesCollectionRef,
      (snapshot) => {
        const fetchedShapes = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as Shape));
        console.log(`[useShapeSync] Received ${fetchedShapes.length} shapes from Firestore`);
        setShapes(fetchedShapes);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[useShapeSync] Firestore listener error:', err);
        errorLogger.logError('Firestore listener error', err, { 
          location: 'useShapeSync',
          canvasId: CANVAS_ID 
        });
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('[useShapeSync] Cleaning up Firestore listener');
      unsubscribe();
      // Clear all lock timeouts
      lockTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      lockTimeouts.current.clear();
    };
  }, []);

  // Create a new shape
  const createShape = useCallback(
    async (shapeData: Omit<Shape, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newShape: Shape = {
        ...shapeData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      console.log(`[createShape] Creating shape with ID: ${newShape.id}`);

      // Optimistic update
      setShapes((currentShapes) => [...currentShapes, newShape]);

      try {
        // Create individual document for this shape
        const shapeDocRef = doc(shapesCollectionRef, newShape.id);
        await setDoc(shapeDocRef, newShape);
        
        console.log(`[createShape] Shape ${newShape.id} synced to Firestore`);
      } catch (err: any) {
        console.error('[createShape] Error syncing to Firestore:', err);
        errorLogger.logError('Failed to create shape in Firestore', err, { 
          shapeId: newShape.id,
          position: { x: newShape.x, y: newShape.y }
        });
        // Rollback on error
        setShapes((prev) => prev.filter((s) => s.id !== newShape.id));
        setError(err.message);
        throw err;
      }
    },
    []
  );

  // Update an existing shape
  const updateShape = useCallback(
    async (id: string, updates: Partial<Shape>) => {
      console.log(`[updateShape] Updating shape ${id}`, updates);

      // Optimistic update
      setShapes((currentShapes) => {
        const shapeIndex = currentShapes.findIndex((s) => s.id === id);
        if (shapeIndex === -1) {
          console.warn(`[updateShape] Shape ${id} not found in local state - may have been deleted`);
          return currentShapes; // No change
        }

        const updatedShape = {
          ...currentShapes[shapeIndex],
          ...updates,
          updatedAt: Date.now(),
        };

        const newShapes = [...currentShapes];
        newShapes[shapeIndex] = updatedShape;
        return newShapes;
      });

      try {
        // Update individual document - no transaction needed!
        const shapeDocRef = doc(shapesCollectionRef, id);
        await updateDoc(shapeDocRef, {
          ...updates,
          updatedAt: Date.now(),
        });
        
        console.log(`[updateShape] Shape ${id} synced to Firestore`);
      } catch (err: any) {
        console.error('[updateShape] Error syncing to Firestore:', err);
        
        // Handle specific error cases
        if (err.code === 'not-found') {
          console.warn(`[updateShape] Document not found - shape ${id} may have been deleted by another user`);
          errorLogger.logWarning('Attempted to update non-existent shape', { 
            shapeId: id,
            updates,
            reason: 'Shape was likely deleted by another user'
          });
          // Don't throw - the shape was deleted, so the update is no longer relevant
          // The Firestore listener will remove it from local state soon
          return;
        }
        
        errorLogger.logError('Failed to update shape in Firestore', err, { 
          shapeId: id,
          updates
        });
        setError(err.message);
        throw err;
      }
    },
    []
  );

  // Delete a shape
  const deleteShape = useCallback(
    async (id: string) => {
      console.log(`[deleteShape] Deleting shape ${id}`);

      // Store original shapes for potential rollback
      const originalShapes = shapes;

      // Optimistic update - remove from UI immediately
      setShapes((currentShapes) => currentShapes.filter((s) => s.id !== id));

      try {
        // Delete individual document - simple and fast!
        const shapeDocRef = doc(shapesCollectionRef, id);
        await deleteDoc(shapeDocRef);
        
        console.log(`[deleteShape] Shape ${id} removed from Firestore successfully`);
      } catch (err: any) {
        console.error('[deleteShape] Error syncing to Firestore:', err);
        console.error('[deleteShape] Error code:', err.code);
        console.error('[deleteShape] Error message:', err.message);
        
        // Check if it's a permission error or not found error
        if (err.code === 'permission-denied') {
          console.error('[deleteShape] Permission denied - check Firestore rules');
          // Rollback optimistic update on permission error
          setShapes(originalShapes);
          setError(err.message);
          throw err;
        } else if (err.code === 'not-found') {
          console.warn('[deleteShape] Document not found - may have been already deleted by another user');
          // Don't throw error if document doesn't exist (it's already gone)
          // Keep the optimistic update since the end result is the same
          return;
        }
        
        // For other errors, log but don't rollback (let Firestore sync handle it)
        console.warn('[deleteShape] Unknown error, but continuing (Firestore sync will correct if needed)');
        setError(err.message);
        throw err;
      }
    },
    [shapes]
  );

  // Unlock a shape (when user stops dragging)
  const unlockShape = useCallback(
    async (id: string) => {
      console.log(`[unlockShape] Unlocking shape ${id}`);

      // Clear the auto-unlock timeout
      const timeout = lockTimeouts.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        lockTimeouts.current.delete(id);
      }

      try {
        // Update shape to remove lock (use null instead of undefined for Firestore compatibility)
        await updateShape(id, {
          isLocked: false,
          lockedBy: null as any, // Firestore doesn't accept undefined, so use null
        });
      } catch (err: any) {
        // If shape was deleted, that's fine - no need to unlock it
        if (err.code === 'not-found') {
          console.warn(`[unlockShape] Shape ${id} no longer exists - already deleted`);
          return;
        }
        // Re-throw other errors
        throw err;
      }
    },
    [updateShape]
  );

  // Lock a shape (when user starts dragging)
  const lockShape = useCallback(
    async (id: string, userId: string) => {
      console.log(`[lockShape] Locking shape ${id} for user ${userId}`);

      // Clear any existing timeout for this shape
      const existingTimeout = lockTimeouts.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set auto-unlock timeout
      const timeout = setTimeout(() => {
        console.log(`[lockShape] Auto-unlocking shape ${id} after timeout`);
        unlockShape(id).catch(() => {
          // Silently catch unlock errors (shape may have been deleted)
        });
      }, LOCK_TIMEOUT_MS);
      lockTimeouts.current.set(id, timeout);

      try {
        // Update shape with lock (updateShape will check if shape exists)
        await updateShape(id, {
          isLocked: true,
          lockedBy: userId,
        });
      } catch (err: any) {
        // If shape was deleted while we tried to lock it, clear the timeout
        if (err.code === 'not-found') {
          console.warn(`[lockShape] Shape ${id} no longer exists - cannot lock`);
          clearTimeout(timeout);
          lockTimeouts.current.delete(id);
          return;
        }
        // Re-throw other errors
        throw err;
      }
    },
    [updateShape, unlockShape]
  );

  return {
    shapes,
    loading,
    error,
    createShape,
    updateShape,
    deleteShape,
    lockShape,
    unlockShape,
  };
}

