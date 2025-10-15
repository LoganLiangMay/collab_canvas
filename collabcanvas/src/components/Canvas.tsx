import { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Line as KonvaLine } from 'react-konva';
import type Konva from 'konva';
import { useAuth } from '../contexts/AuthContext';
import { useShapeSync } from '../hooks/useShapeSync';
import { useCursorSync } from '../hooks/useCursorSync';
import { usePresence } from '../hooks/usePresence';
import { getUserCursorColor } from '../utils/colorUtils';
import Rectangle from './Rectangle';
import Circle from './Circle';
import TextBox from './TextBox';
import LineShape from './Line';
import Cursor from './Cursor';
import LeftSidebar from './LeftSidebar';
import UserMenu from './UI/UserMenu';
import Toast from './UI/Toast';
import AICommandInput from './AI/AICommandInput';
import { errorLogger } from '../utils/errorLogger';
import { executeAICommand, AI_ENABLED } from '../services/aiService';
import { getRandomColor } from '../utils/colorUtils';

export default function Canvas() {
  const { user } = useAuth();
  const { shapes, loading, error, createShape: createShapeFirestore, updateShape, deleteShape: deleteShapeFirestore, lockShape } = useShapeSync();
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  
  // Shape creation state
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [placementType, setPlacementType] = useState<'rectangle' | 'circle' | 'text' | 'line' | null>(null);
  const [isDraggingCreate, setIsDraggingCreate] = useState(false);
  const [isDraggingShape, setIsDraggingShape] = useState(false); // Track if user is dragging a shape
  const [previewShape, setPreviewShape] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const isMouseDown = useRef(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success' | 'warning' } | null>(null);
  
  const showToast = useCallback((message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    setToast({ message, type });
  }, []);

  // Text editing state
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // AI command processing state
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  // Cursor sync for multiplayer
  const userColor = user ? getUserCursorColor(user.uid) : '#000000';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Anonymous';
  const { cursors, updateCursor, removeCursor } = useCursorSync(
    user?.uid || null,
    userName,
    userColor
  );

  // Presence tracking for user online/offline status
  const { presence, updateActivity } = usePresence(user?.uid || null, userName);

  // Get window dimensions
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // FPS Counter (Always enabled for performance monitoring)
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;
    const countFrames = () => {
      frameCount++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(countFrames);
    };
    animationFrameId = requestAnimationFrame(countFrames);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle zoom with mouse wheel
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();
    
    if (!pointer) return;

    // Calculate new scale
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Clamp scale between 0.5 and 2
    const clampedScale = Math.min(Math.max(newScale, 0.5), 2);
    
    // Calculate new position to zoom to cursor
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    console.log(`[ZOOM] Scale: ${oldScale.toFixed(2)} → ${clampedScale.toFixed(2)}, Stage Pos: (${newPos.x.toFixed(2)}, ${newPos.y.toFixed(2)})`);
    
    setStageScale(clampedScale);
    setStagePos(newPos);
  };

  // Handle pan state updates
  const handleStageDragStart = () => {
    console.log(`[STAGE DRAG START] ⚠️ WARNING: Stage is dragging! Position: (${stagePos.x.toFixed(2)}, ${stagePos.y.toFixed(2)}), Scale: ${stageScale.toFixed(2)}`);
    console.log(`[STAGE DRAG START] 🐛 DEBUG: isDraggingShape: ${isDraggingShape}, isDraggingCreate: ${isDraggingCreate}, isPlacementMode: ${isPlacementMode}`);
  };

  const handleStageDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    console.log(`[STAGE DRAGGING] Position: (${newX.toFixed(2)}, ${newY.toFixed(2)})`);
  };

  const handleStageDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    console.log(`[STAGE DRAG END] Final Position: (${newX.toFixed(2)}, ${newY.toFixed(2)})`);
    setStagePos({
      x: newX,
      y: newY,
    });
  };

  // Shape management functions
  // Note: Legacy createShape function - shape creation is now handled
  // directly in drag-create and click-create handlers

  // Stress test - Create 100 shapes for performance testing (DEV only)
  const handleStressTest = async () => {
    if (!user || !import.meta.env.DEV) return;
    
    console.log('[STRESS TEST] Creating 100 shapes...');
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    
    // Create shapes in batches to avoid overwhelming Firebase
    for (let i = 0; i < 100; i++) {
      const randomX = Math.random() * 2000 - 1000; // Random position
      const randomY = Math.random() * 2000 - 1000;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      try {
        await createShapeFirestore({
          type: 'rectangle',
          x: randomX,
          y: randomY,
          width: 150,
          height: 100,
          fill: randomColor,
          userId: user.uid,
        });
      } catch (err) {
        console.error(`[STRESS TEST] Error creating shape ${i}:`, err);
      }
      
      // Small delay between creates to avoid rate limiting
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('[STRESS TEST] Finished creating 100 shapes');
  };

  // Handle shape drag start (lock the shape)
  const handleShapeDragStart = async (id: string) => {
    if (!user) return;
    console.log(`[handleShapeDragStart] Locking shape ${id}`);
    
    // CRITICAL: Immediately stop any Stage drag and disable Stage dragging SYNCHRONOUSLY
    if (stageRef.current) {
      // Force-stop any drag operation on the Stage that might have started
      stageRef.current.stopDrag();
      stageRef.current.draggable(false);
      console.log(`[handleShapeDragStart] 🔒 Stage drag STOPPED and dragging DISABLED synchronously`);
    }
    
    setIsDraggingShape(true); // Also update state for React re-render
    
    try {
      await lockShape(id, user.uid);
    } catch (err: any) {
      console.error('[handleShapeDragStart] Error locking shape:', err);
      errorLogger.logError('Failed to lock shape', err, { shapeId: id, userId: user.uid });
    }
  };

  // Handle shape drag end (update position and unlock in ONE write - optimization!)
  const handleShapeDragEnd = async (id: string, x: number, y: number) => {
    console.log(`[handleShapeDragEnd] Updating position and unlocking shape ${id}`);
    
    // CRITICAL: Re-enable Stage dragging SYNCHRONOUSLY
    if (stageRef.current) {
      stageRef.current.draggable(true);
      console.log(`[handleShapeDragEnd] 🔓 Stage dragging RE-ENABLED synchronously`);
    }
    
    setIsDraggingShape(false); // Also update state for React re-render
    
    // Check if shape still exists before trying to update
    const shapeExists = shapes.find(s => s.id === id);
    if (!shapeExists) {
      console.warn(`[handleShapeDragEnd] Shape ${id} no longer exists - may have been deleted during drag`);
      return;
    }
    
    try {
      // Combine position update and unlock into single Firestore write
      // This reduces writes from 3 per drag (lock + update + unlock) to 2 (lock + update+unlock)
      await updateShape(id, {
        x,
        y,
        isLocked: false,
        lockedBy: null as any,
      });
    } catch (err: any) {
      console.error('[handleShapeDragEnd] Error:', err);
      // Don't show toast for update errors - they're handled gracefully in useShapeSync
      // Just log for debugging
      if (err.code !== 'not-found') {
        errorLogger.logError('Failed to update shape position', err, { 
          shapeId: id,
          position: { x, y }
        });
      }
    }
  };

  const selectShape = (id: string) => {
    setSelectedId(id);
  };

  const deselectShape = () => {
    setSelectedId(null);
  };

  // Handle starting text edit
  const handleStartTextEdit = useCallback((id: string) => {
    // Use a small delay to ensure Firestore has synced the shape
    setTimeout(() => {
      const shape = shapes.find(s => s.id === id);
      if (shape && shape.type === 'text') {
        console.log(`[handleStartTextEdit] Starting edit for shape ${id}, text: "${shape.text}"`);
        setEditingTextId(id);
        setEditingText(shape.text || 'Text');
      }
    }, 50);
  }, [shapes]);

  // Handle saving text changes with auto-width adjustment
  const handleSaveTextEdit = useCallback(async () => {
    if (!editingTextId) return;
    
    const shape = shapes.find(s => s.id === editingTextId);
    if (!shape) return;
    
    console.log(`[handleSaveTextEdit] Saving text for shape ${editingTextId}: "${editingText}"`);
    
    // Calculate new width based on text content
    const fontSize = Math.max(12, shape.height * 0.8);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${fontSize}px Arial, sans-serif`;
      const metrics = context.measureText(editingText || 'Text');
      const newWidth = Math.max(50, metrics.width + 20); // Add padding, minimum 50px
      
      try {
        // Update both text and width
        await updateShape(editingTextId, { 
          text: editingText,
          width: newWidth 
        });
        setEditingTextId(null);
        setEditingText('');
      } catch (err: any) {
        console.error('[handleSaveTextEdit] Error updating text:', err);
        errorLogger.logError('Failed to update text', err, { shapeId: editingTextId });
        showToast('Failed to update text', 'error');
      }
    }
  }, [editingTextId, editingText, shapes, updateShape, showToast]);

  // Handle canceling text edit
  const handleCancelTextEdit = useCallback(() => {
    console.log('[handleCancelTextEdit] Canceling text edit');
    setEditingTextId(null);
    setEditingText('');
  }, []);

  // Track if we've already initialized the textarea to prevent re-initialization
  const textareaInitialized = useRef<string | null>(null);

  // Focus and position textarea when editing starts
  useEffect(() => {
    if (editingTextId && textareaRef.current && stageRef.current) {
      const shape = shapes.find(s => s.id === editingTextId);
      if (!shape) return;

      const textarea = textareaRef.current;
      
      // Only initialize once per editing session
      const isNewSession = textareaInitialized.current !== editingTextId;
      
      // Calculate screen position accounting for stage transform
      const screenX = shape.x * stageScale + stagePos.x;
      const screenY = shape.y * stageScale + stagePos.y;
      const screenWidth = shape.width * stageScale;
      const screenHeight = shape.height * stageScale;
      
      // Calculate font size proportional to height (same as TextBox component)
      const fontSize = Math.max(12, shape.height * 0.8) * stageScale;

      // Position textarea over the text box
      textarea.style.position = 'absolute';
      textarea.style.left = `${screenX}px`;
      textarea.style.top = `${screenY}px`;
      textarea.style.width = `${screenWidth}px`;
      textarea.style.height = `${screenHeight}px`;
      textarea.style.fontSize = `${fontSize}px`;
      textarea.style.padding = '0';
      textarea.style.margin = '0';
      textarea.style.border = '2px solid #3498db';
      textarea.style.borderRadius = '0';
      textarea.style.backgroundColor = 'transparent';
      textarea.style.color = '#ffffff';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.overflow = 'hidden';
      textarea.style.fontFamily = 'Arial, sans-serif';
      textarea.style.zIndex = '1000';
      textarea.style.lineHeight = 'normal';
      textarea.style.display = 'flex';
      textarea.style.alignItems = 'center';

      // Only focus and select on initial setup, not on every update
      if (isNewSession) {
        textareaInitialized.current = editingTextId;
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(0, textarea.value.length);
        }, 0);
      }
    } else {
      // Reset when editing ends
      textareaInitialized.current = null;
    }
  }, [editingTextId, shapes, stagePos, stageScale]);

  // Handle click on stage background
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Check if clicked on stage background (not on a shape)
    if (e.target === e.target.getStage()) {
      deselectShape();
    }
  };

  // Track if a delete operation is in progress to prevent double-deletes
  const deleteInProgressRef = useRef<string | null>(null);

  // Delete selected shape
  const handleDeleteSelected = useCallback(async () => {
    if (!selectedId) {
      console.warn('[DELETE] No shape selected');
      return;
    }
    
    // Prevent double-delete if operation is already in progress for this shape
    if (deleteInProgressRef.current === selectedId) {
      console.warn(`[DELETE] Delete already in progress for shape ${selectedId}`);
      return;
    }
    
    // Check if shape still exists in local state
    const shapeExists = shapes.find(s => s.id === selectedId);
    if (!shapeExists) {
      console.warn(`[DELETE] Shape ${selectedId} not found in local state - may have been deleted by another user`);
      setSelectedId(null); // Clear selection
      return;
    }
    
    console.log(`[DELETE] Deleting shape ${selectedId}`);
    
    // Mark delete as in progress
    deleteInProgressRef.current = selectedId;
    const shapeIdToDelete = selectedId; // Capture for closure
    
    try {
      await deleteShapeFirestore(shapeIdToDelete);
      setSelectedId(null); // Deselect after delete
      console.log(`[DELETE] Successfully deleted shape ${shapeIdToDelete}`);
    } catch (err: any) {
      console.error('[handleDeleteSelected] Error deleting shape:', err);
      
      // Handle specific error cases
      if (err.code === 'not-found') {
        console.log('[handleDeleteSelected] Shape was already deleted by another user');
        errorLogger.logWarning('Shape was already deleted by another user', { 
          shapeId: shapeIdToDelete 
        });
        showToast('Shape was already deleted', 'warning');
      } else if (err.code === 'permission-denied') {
        console.error('[handleDeleteSelected] Permission denied - check authentication');
        errorLogger.logError('Permission denied when deleting shape', err, { 
          shapeId: shapeIdToDelete 
        });
        showToast('Permission denied - cannot delete shape', 'error');
      } else {
        errorLogger.logError('Failed to delete shape', err, { 
          shapeId: shapeIdToDelete,
          code: err.code,
          message: err.message
        });
        showToast('Failed to delete shape', 'error');
      }
      
      // Still clear selection even if delete failed
      setSelectedId(null);
    } finally {
      // Clear delete in progress flag
      deleteInProgressRef.current = null;
    }
  }, [selectedId, shapes, deleteShapeFirestore, showToast]);

  // Handle AI command execution
  const handleAICommand = useCallback(async (command: string) => {
    if (!user) {
      showToast('You must be logged in to use AI features', 'error');
      return;
    }

    setIsProcessingAI(true);
    
    try {
      console.log('[AI] Processing command:', command);
      const aiCommand = await executeAICommand(command, shapes);
      console.log('[AI] Parsed command:', aiCommand);

      // Execute the command
      switch (aiCommand.action) {
        case 'create':
          if (aiCommand.shapeType && user) {
            // Get canvas center for shape placement
            const centerX = (dimensions.width / 2 - stagePos.x) / stageScale;
            const centerY = (dimensions.height / 2 - stagePos.y) / stageScale;

            const size = aiCommand.shapeType === 'circle' ? 100 : 150;
            const shapeData = {
              type: aiCommand.shapeType,
              x: aiCommand.shapeType === 'circle' ? centerX : centerX - size / 2,
              y: aiCommand.shapeType === 'circle' ? centerY : centerY - size / 2,
              width: size,
              height: aiCommand.shapeType === 'circle' ? size : 100,
              fill: aiCommand.properties?.fill || getRandomColor(),
              userId: user.uid,
            };

            await createShapeFirestore(shapeData);
            showToast(`Created ${aiCommand.shapeType}!`, 'success');
          }
          break;

        case 'delete':
          if (selectedId) {
            await handleDeleteSelected();
            showToast('Shape deleted!', 'success');
          } else {
            showToast('No shape selected to delete', 'warning');
          }
          break;

        default:
          showToast(`Command "${aiCommand.action}" not yet implemented`, 'info');
      }
    } catch (err) {
      console.error('[AI] Error executing command:', err);
      showToast(err instanceof Error ? err.message : 'Failed to execute command', 'error');
    } finally {
      setIsProcessingAI(false);
    }
  }, [user, shapes, dimensions, stagePos, stageScale, selectedId, createShapeFirestore, handleDeleteSelected, showToast]);

  // Keyboard shortcuts
  // Debug: Log Stage draggability changes
  useEffect(() => {
    const stageDraggable = !isDraggingShape && !isDraggingCreate && !isPlacementMode;
    console.log(`[STAGE DRAGGABLE] 🎯 Stage draggable: ${stageDraggable} (isDraggingShape: ${isDraggingShape}, isDraggingCreate: ${isDraggingCreate}, isPlacementMode: ${isPlacementMode})`);
  }, [isDraggingShape, isDraggingCreate, isPlacementMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if currently editing text
      if (editingTextId) {
        return;
      }

      // Delete/Backspace - delete selected shape
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault(); // Prevent browser back navigation on Backspace
        handleDeleteSelected();
      }
      
      // Escape - cancel drag-to-create or placement mode
      if (e.key === 'Escape' && (isDraggingCreate || isPlacementMode)) {
        e.preventDefault();
        setIsDraggingCreate(false);
        setIsPlacementMode(false);
        setPlacementType(null);
        setPreviewShape(null);
        dragStartPos.current = null;
        isMouseDown.current = false;
        if (stageRef.current) {
          stageRef.current.draggable(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleDeleteSelected, isDraggingCreate, isPlacementMode, editingTextId]);

  // Handle shape addition from sidebar - Click = custom-size drag mode
  const handleAddShape = (type: 'rectangle' | 'circle' | 'text' | 'line') => {
    console.log(`[handleAddShape] Called with type: ${type}, isPlacementMode: ${isPlacementMode}, isDraggingCreate: ${isDraggingCreate}`);
    
    // All shape types now use crosshair mode (click start, drag to end/size)
    console.log(`[handleAddShape] ✅ Activating CROSSHAIR mode for ${type} (drag to define ${type === 'line' ? 'endpoints' : 'custom size'})`);
    setIsDraggingCreate(true);
    setPlacementType(type);
    if (stageRef.current) {
      stageRef.current.draggable(false);
    }
  };

  // Start placement mode - Drag from tool = fixed-size preview follows cursor
  const handleStartDragCreate = (type: 'rectangle' | 'circle' | 'text' | 'line') => {
    console.log(`[handleStartDragCreate] ✅ Activating PLACEMENT mode for ${type} (fixed-size preview follows cursor)`);
    setIsPlacementMode(true);
    setPlacementType(type);
    // Disable stage dragging while in placement mode
    if (stageRef.current) {
      stageRef.current.draggable(false);
    }
  };

  // Throttled activity update (once per 5 seconds)
  const lastActivityUpdate = useRef<number>(0);
  const ACTIVITY_UPDATE_THROTTLE = 5000; // 5 seconds

  // Handle cursor movement for multiplayer and shape preview
  const handleMouseMove = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Convert screen coordinates to canvas coordinates (accounting for pan/zoom)
    const canvasX = (pointer.x - stagePos.x) / stageScale;
    const canvasY = (pointer.y - stagePos.y) / stageScale;

    // DEBUG: Log when in drag-create mode
    if (isDraggingCreate) {
      console.log(`[handleMouseMove] 🖱️ isDraggingCreate: ${isDraggingCreate}, isMouseDown: ${isMouseDown.current}, placementType: ${placementType}, dragStartPos: ${dragStartPos.current ? 'SET' : 'NULL'}`);
    }

    // Handle drag-to-create (custom size)
    if (isDraggingCreate && isMouseDown.current && dragStartPos.current) {
      const startX = dragStartPos.current.x;
      const startY = dragStartPos.current.y;
      
      if (placementType === 'line') {
        // For lines: from start point to current cursor position
        // Store as: x,y = start point, width = deltaX, height = deltaY
        const deltaX = canvasX - startX;
        const deltaY = canvasY - startY;
        console.log(`[LINE PREVIEW] Start: (${startX.toFixed(2)}, ${startY.toFixed(2)}), Current: (${canvasX.toFixed(2)}, ${canvasY.toFixed(2)}), Deltas: (${deltaX.toFixed(2)}, ${deltaY.toFixed(2)})`);
        setPreviewShape({ 
          x: startX, 
          y: startY, 
          width: deltaX, 
          height: deltaY 
        });
      } else if (placementType === 'circle') {
        // For circles: expand radially from center using actual distance
        const deltaX = canvasX - startX;
        const deltaY = canvasY - startY;
        const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // Euclidean distance
        const diameter = radius * 2;
        
        // Circle center is the start point, x/y for storage is center
        setPreviewShape({ 
          x: startX, 
          y: startY, 
          width: diameter, 
          height: diameter 
        });
      } else {
        // For rectangles and text boxes: expand from corner
        const width = Math.abs(canvasX - startX);
        const height = Math.abs(canvasY - startY);
        const x = Math.min(startX, canvasX);
        const y = Math.min(startY, canvasY);
        
        setPreviewShape({ x, y, width, height });
      }
    }
    // Handle placement mode (fixed size preview)
    else if (isPlacementMode && placementType) {
      if (placementType === 'rectangle') {
        const fixedWidth = 150;
        const fixedHeight = 100;
        setPreviewShape({
          x: canvasX - fixedWidth / 2,
          y: canvasY - fixedHeight / 2,
          width: fixedWidth,
          height: fixedHeight
        });
      } else if (placementType === 'circle') {
        const fixedSize = 100; // Diameter
        // For circles, x,y is the center, so we position it directly at cursor
        setPreviewShape({
          x: canvasX,
          y: canvasY,
          width: fixedSize,
          height: fixedSize
        });
      } else if (placementType === 'text') {
        const fixedWidth = 200;
        const fixedHeight = 50;
        setPreviewShape({
          x: canvasX - fixedWidth / 2,
          y: canvasY - fixedHeight / 2,
          width: fixedWidth,
          height: fixedHeight
        });
      } else if (placementType === 'line') {
        // For lines in placement mode: horizontal line centered at cursor
        const fixedLength = 120; // Default line length
        // x,y = start point (left), width = deltaX, height = deltaY (0 for horizontal)
        setPreviewShape({
          x: canvasX - fixedLength / 2,
          y: canvasY,
          width: fixedLength,  // Horizontal line (deltaX)
          height: 0            // No vertical component (deltaY = 0)
        });
        console.log(`[LINE PLACEMENT MODE] Fixed-size line preview at (${canvasX.toFixed(2)}, ${canvasY.toFixed(2)}), length: ${fixedLength}`);
      }
    } else {
      updateCursor(canvasX, canvasY);
    }
    
    // Throttle activity updates to avoid excessive Firebase writes
    const now = Date.now();
    if (now - lastActivityUpdate.current > ACTIVITY_UPDATE_THROTTLE) {
      updateActivity();
      lastActivityUpdate.current = now;
    }
  };

  // Handle mouse leaving canvas
  const handleMouseLeave = () => {
    removeCursor();
    
    // Cancel placement/drag mode if in progress
    if (isPlacementMode || isDraggingCreate) {
      setIsPlacementMode(false);
      setPlacementType(null);
      setIsDraggingCreate(false);
      setPreviewShape(null);
      dragStartPos.current = null;
      isMouseDown.current = false;
      if (stageRef.current) {
        stageRef.current.draggable(true);
      }
    }
  };

  // Handle canvas mouse down - start custom-size creation
  const handleCanvasMouseDown = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const canvasX = (pointer.x - stagePos.x) / stageScale;
    const canvasY = (pointer.y - stagePos.y) / stageScale;

    console.log(`[handleCanvasMouseDown] isDraggingCreate: ${isDraggingCreate}, isPlacementMode: ${isPlacementMode}, placementType: ${placementType}`);

    // If in drag-create mode (custom-size), start dragging
    if (isDraggingCreate && !isMouseDown.current) {
      isMouseDown.current = true;
      dragStartPos.current = { x: canvasX, y: canvasY };
      console.log(`[handleCanvasMouseDown] 🎯 Started drag from (${canvasX.toFixed(2)}, ${canvasY.toFixed(2)}) for ${placementType}`);
    }
  };

  // Create shape from placement mode (fixed-size)
  const createPlacementShape = async () => {
    if (!previewShape || !user || !placementType) return;
    
    // For circles, ensure width and height are equal (use width as diameter)
    const shapeWidth = previewShape.width;
    const shapeHeight = placementType === 'circle' ? previewShape.width : previewShape.height;
    
    console.log(`[createPlacementShape] Creating ${placementType} at preview position (${previewShape.x.toFixed(2)}, ${previewShape.y.toFixed(2)})`);
    
    try {
      const shapeData: any = {
        type: placementType as 'rectangle' | 'circle' | 'text' | 'line',
        x: previewShape.x,
        y: previewShape.y,
        width: shapeWidth,
        height: shapeHeight,
        fill: placementType === 'text' ? 'transparent' : (placementType === 'line' ? '#3498db' : '#3498db'),
        userId: user.uid,
      };

      // Add default text for text boxes
      if (placementType === 'text') {
        shapeData.text = 'Text';
      }
      
      console.log(`[createPlacementShape] 📝 Shape data:`, shapeData);

      await createShapeFirestore(shapeData);
      console.log(`[PLACEMENT] ✅ Created ${placementType} at (${previewShape.x.toFixed(2)}, ${previewShape.y.toFixed(2)})`);
    } catch (err: any) {
      console.error('[createPlacementShape] Error:', err);
      errorLogger.logError('Failed to create shape via placement', err, { 
        position: { x: previewShape.x, y: previewShape.y },
        type: placementType
      });
      showToast('Failed to create shape', 'error');
    }
    
    // Reset placement mode immediately
    setIsPlacementMode(false);
    setPlacementType(null);
    
    // Clear preview shape immediately to prevent duplicate rendering
    setPreviewShape(null);
    
    if (stageRef.current) {
      stageRef.current.draggable(true);
    }
  };

  // Handle mouse up - finalize shape creation (both modes)
  const handleMouseUp = async () => {
    // Mode 2: Placement mode (fixed-size) - create on release
    if (isPlacementMode && previewShape && user) {
      await createPlacementShape();
      return;
    }
    
    // Mode 1: Drag-create mode (custom-size) - create if dragged enough
    if (isDraggingCreate && isMouseDown.current && previewShape && user && placementType) {
      const minSize = 10; // Minimum size for a shape (diameter for circles)
      
      let shapeWidth, shapeHeight, finalX, finalY;
      let isValidSize = false;
      
      if (placementType === 'line') {
        // For lines: width/height are deltas, check minimum line length
        const lineLength = Math.sqrt(previewShape.width * previewShape.width + previewShape.height * previewShape.height);
        isValidSize = lineLength >= minSize;
        shapeWidth = previewShape.width;  // deltaX
        shapeHeight = previewShape.height; // deltaY
        finalX = previewShape.x; // Start point
        finalY = previewShape.y;
      } else {
        // For circles, ensure width=height (diameter). For rectangles and text, use actual dimensions.
        shapeWidth = placementType === 'circle' ? Math.max(previewShape.width, previewShape.height) : previewShape.width;
        shapeHeight = placementType === 'circle' ? shapeWidth : previewShape.height;
        
        // Position is already correct from preview:
        // - Circles: x, y is already the center point
        // - Rectangles/Text: x, y is already the top-left corner
        finalX = previewShape.x;
        finalY = previewShape.y;
        
        // Only create if shape is large enough
        isValidSize = shapeWidth >= minSize && shapeHeight >= minSize;
      }
      
      if (isValidSize) {
        try {
          const shapeData: any = {
            type: placementType as 'rectangle' | 'circle' | 'text' | 'line',
            x: finalX,
            y: finalY,
            width: shapeWidth,
            height: shapeHeight,
            fill: placementType === 'text' ? 'transparent' : (placementType === 'line' ? '#3498db' : '#3498db'),
            userId: user.uid,
          };

          // Add default text for text boxes
          if (placementType === 'text') {
            shapeData.text = 'Text';
          }

          await createShapeFirestore(shapeData);
          console.log(`[DRAG CREATE] Created ${placementType} at (${finalX.toFixed(2)}, ${finalY.toFixed(2)}) with ${placementType === 'line' ? `deltas (${shapeWidth.toFixed(2)}, ${shapeHeight.toFixed(2)})` : `size ${shapeWidth.toFixed(2)}x${shapeHeight.toFixed(2)}`}`);
        } catch (err: any) {
          console.error('[handleMouseUp] Error creating shape:', err);
          errorLogger.logError('Failed to create shape via drag', err, { 
            position: { x: finalX, y: finalY },
            size: { width: shapeWidth, height: shapeHeight },
            type: placementType
          });
          showToast('Failed to create shape', 'error');
        }
      }
      
      // Reset drag-create state immediately to prevent duplicate rendering
      setIsDraggingCreate(false);
      setPlacementType(null);
      dragStartPos.current = null;
      isMouseDown.current = false;
      
      // Clear preview shape immediately
      setPreviewShape(null);
      
      // Re-enable stage dragging
      if (stageRef.current) {
        stageRef.current.draggable(true);
      }
    } else {
      // Even if we didn't create a shape, clear the preview
      setPreviewShape(null);
      isMouseDown.current = false;
    }
  };

  // Filter cursors to only show active ones (within 5 minutes)
  const activeCursors = Object.values(cursors).filter((cursor) => {
    const isRecent = Date.now() - cursor.timestamp < 5 * 60 * 1000;
    return isRecent;
  });

  // Generate grid lines
  const renderGrid = () => {
    const lines = [];
    const gridSize = 50; // 50px grid
    const gridColor = '#333333'; // Dark gray lines
    const width = dimensions.width * 3; // Extended for panning
    const height = dimensions.height * 3;
    const offsetX = -dimensions.width;
    const offsetY = -dimensions.height;

    // Vertical lines
    for (let i = 0; i < width / gridSize; i++) {
      lines.push(
        <KonvaLine
          key={`v-${i}`}
          points={[offsetX + i * gridSize, offsetY, offsetX + i * gridSize, offsetY + height]}
          stroke={gridColor}
          strokeWidth={1}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let i = 0; i < height / gridSize; i++) {
      lines.push(
        <KonvaLine
          key={`h-${i}`}
          points={[offsetX, offsetY + i * gridSize, offsetX + width, offsetY + i * gridSize]}
          stroke={gridColor}
          strokeWidth={1}
          listening={false}
        />
      );
    }

    return lines;
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        color: '#fff',
        fontSize: '18px',
      }}>
        Loading canvas...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        color: '#e74c3c',
        fontSize: '18px',
        gap: '16px',
      }}>
        <div>Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <LeftSidebar
        onAddShape={handleAddShape}
        onStartDragCreate={handleStartDragCreate}
        onDeleteSelected={handleDeleteSelected}
        selectedShape={selectedId}
        onStressTest={import.meta.env.DEV ? handleStressTest : undefined}
        fps={fps}
      />
      <UserMenu presence={presence} />
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div 
        className={`canvas-container ${isDraggingCreate ? 'create-mode' : ''}`}
      >
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          draggable={!isDraggingShape && !isDraggingCreate && !isPlacementMode}
          x={stagePos.x}
          y={stagePos.y}
          scaleX={stageScale}
          scaleY={stageScale}
          onWheel={handleWheel}
          onDragStart={handleStageDragStart}
          onDragMove={handleStageDrag}
          onDragEnd={handleStageDragEnd}
          onClick={handleStageClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {/* Grid lines for visual feedback */}
            {renderGrid()}
            
            {/* Render all shapes (rectangles, circles, and text boxes) */}
            {shapes.map((shape) => {
              const shapeProps = {
                id: shape.id,
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
                fill: shape.fill,
                isSelected: shape.id === selectedId,
                isLocked: shape.isLocked,
                lockedBy: shape.lockedBy,
                currentUserId: user?.uid,
                onDragStart: handleShapeDragStart,
                onDragEnd: handleShapeDragEnd,
                onClick: selectShape,
              };

              if (shape.type === 'circle') {
                return <Circle key={shape.id} {...shapeProps} />;
              } else if (shape.type === 'text') {
                return (
                  <TextBox
                    key={shape.id}
                    {...shapeProps}
                    text={shape.text || 'Text'}
                    isEditing={editingTextId === shape.id}
                    onStartEdit={handleStartTextEdit}
                  />
                );
              } else if (shape.type === 'line') {
                // Get the lockedByName for display
                const lockedByName = shape.lockedBy ? 
                  (shapes.find(s => s.userId === shape.lockedBy)?.userId || 'Another user') : 
                  undefined;
                
                return (
                  <LineShape
                    key={shape.id}
                    id={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.fill}
                    isSelected={shape.id === selectedId}
                    isLocked={shape.isLocked || false}
                    lockedBy={shape.lockedBy}
                    lockedByName={lockedByName}
                    onSelect={selectShape}
                    onDragStart={handleShapeDragStart}
                    onDragEnd={handleShapeDragEnd}
                  />
                );
              } else {
                return <Rectangle key={shape.id} {...shapeProps} />;
              }
            })}
            
            {/* Preview shape while dragging to create */}
            {previewShape && placementType && (isPlacementMode || (isDraggingCreate && isMouseDown.current)) && (
              placementType === 'line' ? (
                <LineShape
                  key="preview"
                  id="preview"
                  x={previewShape.x}
                  y={previewShape.y}
                  width={previewShape.width}
                  height={previewShape.height}
                  fill="#3498db"
                  isSelected={true}
                  isLocked={false}
                  lockedBy={undefined}
                  onSelect={() => {}}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                  opacity={0.7}
                />
              ) : placementType === 'circle' ? (
                <Circle
                  key="preview"
                  id="preview"
                  x={previewShape.x}
                  y={previewShape.y}
                  width={previewShape.width}
                  height={previewShape.height}
                  fill="#3498db"
                  isSelected={false}
                  isLocked={isPlacementMode}
                  lockedBy={undefined}
                  currentUserId={user?.uid}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                  onClick={() => {}}
                  opacity={isPlacementMode ? 0.7 : 0.5}
                />
              ) : placementType === 'text' ? (
                <TextBox
                  key="preview"
                  id="preview"
                  x={previewShape.x}
                  y={previewShape.y}
                  width={previewShape.width}
                  height={previewShape.height}
                  fill="transparent"
                  text="Text"
                  isSelected={true}
                  isLocked={false}
                  lockedBy={undefined}
                  currentUserId={user?.uid}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                  onClick={() => {}}
                  opacity={isPlacementMode ? 0.7 : 0.5}
                />
              ) : (
                <Rectangle
                  key="preview"
                  id="preview"
                  x={previewShape.x}
                  y={previewShape.y}
                  width={previewShape.width}
                  height={previewShape.height}
                  fill="#3498db"
                  isSelected={true}
                  isLocked={isPlacementMode}
                  lockedBy={undefined}
                  currentUserId={user?.uid}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                  onClick={() => {}}
                  opacity={isPlacementMode ? 0.7 : 0.5}
                />
              )
            )}
          </Layer>

          {/* Separate layer for cursors (performance optimization) */}
          <Layer listening={false}>
            {activeCursors.map((cursor) => (
              <Cursor key={cursor.userId} cursor={cursor} />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* AI Command Input */}
      <AICommandInput
        onExecuteCommand={handleAICommand}
        isProcessing={isProcessingAI}
        aiEnabled={AI_ENABLED}
      />

      {/* Text Editing Overlay */}
      {editingTextId && (
        <textarea
          ref={textareaRef}
          value={editingText}
          onChange={(e) => {
            setEditingText(e.target.value);
            // Auto-resize textarea width based on content
            const shape = shapes.find(s => s.id === editingTextId);
            if (shape && textareaRef.current) {
              const fontSize = Math.max(12, shape.height * 0.8) * stageScale;
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              if (context) {
                context.font = `${fontSize}px Arial, sans-serif`;
                const metrics = context.measureText(e.target.value || 'Text');
                const newWidth = Math.max(50, (metrics.width + 20) * stageScale);
                textareaRef.current.style.width = `${newWidth}px`;
              }
            }
          }}
          onBlur={handleSaveTextEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSaveTextEdit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              handleCancelTextEdit();
            }
          }}
        />
      )}
    </div>
  );
}

