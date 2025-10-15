import React from 'react';
import { Square, Circle, Type, Minus, Trash2, Zap } from 'lucide-react';
import styles from './LeftSidebar.module.css';

interface LeftSidebarProps {
  onAddShape: (type: 'rectangle' | 'circle' | 'text' | 'line') => void;
  onStartDragCreate?: (type: 'rectangle' | 'circle' | 'text' | 'line') => void;
  onDeleteSelected: () => void;
  selectedShape: string | null;
  onStressTest?: () => void;
  fps?: number;
}

export default function LeftSidebar({ onAddShape, onStartDragCreate, onDeleteSelected, selectedShape, onStressTest, fps }: LeftSidebarProps) {
  const isDraggingFromToolRef = React.useRef(false);
  const hasMovedRef = React.useRef(false);
  const startPosRef = React.useRef<{ x: number; y: number } | null>(null);
  
  const handleRectangleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[LeftSidebar] 🟦 Rectangle button MOUSE DOWN');
    isDraggingFromToolRef.current = true;
    hasMovedRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    
    // Set up global mouse move and mouse up listeners
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Only trigger placement mode if mouse moves more than 5 pixels (intentional drag)
      if (!hasMovedRef.current && startPosRef.current) {
        const deltaX = Math.abs(moveEvent.clientX - startPosRef.current.x);
        const deltaY = Math.abs(moveEvent.clientY - startPosRef.current.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 5) {
          hasMovedRef.current = true;
          console.log(`[LeftSidebar] 🟦 Rectangle - Mouse MOVED ${distance.toFixed(1)}px → calling onStartDragCreate (placement mode)`);
          if (onStartDragCreate) {
            onStartDragCreate('rectangle');
          }
          cleanup();
        }
      }
    };
    
    const handleMouseUp = () => {
      // If released without moving, enter custom-size drag mode
      console.log(`[LeftSidebar] 🟦 Rectangle - Mouse UP, hasMoved: ${hasMovedRef.current}`);
      if (isDraggingFromToolRef.current && !hasMovedRef.current && onAddShape) {
        console.log('[LeftSidebar] 🟦 Rectangle - Quick click detected → calling onAddShape (crosshair mode)');
        onAddShape('rectangle');
      }
      cleanup();
    };
    
    const cleanup = () => {
      isDraggingFromToolRef.current = false;
      hasMovedRef.current = false;
      startPosRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove, { once: false });
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  const handleCircleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[LeftSidebar] 🔵 Circle button MOUSE DOWN');
    isDraggingFromToolRef.current = true;
    hasMovedRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    
    // Set up global mouse move and mouse up listeners
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Only trigger placement mode if mouse moves more than 5 pixels (intentional drag)
      if (!hasMovedRef.current && startPosRef.current) {
        const deltaX = Math.abs(moveEvent.clientX - startPosRef.current.x);
        const deltaY = Math.abs(moveEvent.clientY - startPosRef.current.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 5) {
          hasMovedRef.current = true;
          console.log(`[LeftSidebar] 🔵 Circle - Mouse MOVED ${distance.toFixed(1)}px → calling onStartDragCreate (placement mode)`);
          if (onStartDragCreate) {
            onStartDragCreate('circle');
          }
          cleanup();
        }
      }
    };
    
    const handleMouseUp = () => {
      // If released without moving, enter custom-size drag mode
      console.log(`[LeftSidebar] 🔵 Circle - Mouse UP, hasMoved: ${hasMovedRef.current}`);
      if (isDraggingFromToolRef.current && !hasMovedRef.current && onAddShape) {
        console.log('[LeftSidebar] 🔵 Circle - Quick click detected → calling onAddShape (crosshair mode)');
        onAddShape('circle');
      }
      cleanup();
    };
    
    const cleanup = () => {
      isDraggingFromToolRef.current = false;
      hasMovedRef.current = false;
      startPosRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove, { once: false });
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  const handleTextMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[LeftSidebar] 📝 Text button MOUSE DOWN');
    isDraggingFromToolRef.current = true;
    hasMovedRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    
    // Set up global mouse move and mouse up listeners
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Only trigger placement mode if mouse moves more than 5 pixels (intentional drag)
      if (!hasMovedRef.current && startPosRef.current) {
        const deltaX = Math.abs(moveEvent.clientX - startPosRef.current.x);
        const deltaY = Math.abs(moveEvent.clientY - startPosRef.current.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 5) {
          hasMovedRef.current = true;
          console.log(`[LeftSidebar] 📝 Text - Mouse MOVED ${distance.toFixed(1)}px → calling onStartDragCreate (placement mode)`);
          if (onStartDragCreate) {
            onStartDragCreate('text');
          }
          cleanup();
        }
      }
    };
    
    const handleMouseUp = () => {
      // If released without moving, enter custom-size drag mode
      console.log(`[LeftSidebar] 📝 Text - Mouse UP, hasMoved: ${hasMovedRef.current}`);
      if (isDraggingFromToolRef.current && !hasMovedRef.current && onAddShape) {
        console.log('[LeftSidebar] 📝 Text - Quick click detected → calling onAddShape (crosshair mode)');
        onAddShape('text');
      }
      cleanup();
    };
    
    const cleanup = () => {
      isDraggingFromToolRef.current = false;
      hasMovedRef.current = false;
      startPosRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove, { once: false });
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  const handleLineMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[LeftSidebar] ➖ Line button MOUSE DOWN');
    isDraggingFromToolRef.current = true;
    hasMovedRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    
    // Set up global mouse move and mouse up listeners
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Only trigger placement mode if mouse moves more than 5 pixels (intentional drag)
      if (!hasMovedRef.current && startPosRef.current) {
        const deltaX = Math.abs(moveEvent.clientX - startPosRef.current.x);
        const deltaY = Math.abs(moveEvent.clientY - startPosRef.current.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 5) {
          hasMovedRef.current = true;
          console.log(`[LeftSidebar] ➖ Line - Mouse MOVED ${distance.toFixed(1)}px → calling onStartDragCreate (placement mode)`);
          if (onStartDragCreate) {
            onStartDragCreate('line');
          }
          cleanup();
        }
      }
    };
    
    const handleMouseUp = () => {
      // If released without moving, enter custom-size drag mode (two-point line creation)
      console.log(`[LeftSidebar] ➖ Line - Mouse UP, hasMoved: ${hasMovedRef.current}`);
      if (isDraggingFromToolRef.current && !hasMovedRef.current && onAddShape) {
        console.log('[LeftSidebar] ➖ Line - Quick click detected → calling onAddShape (crosshair mode for two-point line)');
        onAddShape('line');
      }
      cleanup();
    };
    
    const cleanup = () => {
      isDraggingFromToolRef.current = false;
      hasMovedRef.current = false;
      startPosRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove, { once: false });
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  const handleDeleteClick = () => {
    if (selectedShape) {
      onDeleteSelected();
    }
  };

  return (
    <div className={styles.leftSidebar}>
      <div className={styles.toolSection}>
      {/* Rectangle Tool - Active */}
      <button
        className={`${styles.toolButton} ${styles.active}`}
        onMouseDown={handleRectangleMouseDown}
        aria-label="Click: drag to size | Hold & drag: fixed size"
        title="Click: drag to size | Hold & drag: fixed size"
      >
        <Square size={20} strokeWidth={2} />
        <span className={styles.tooltip}>Click or Drag to create</span>
      </button>

      {/* Circle Tool - Active */}
      <button
        className={`${styles.toolButton} ${styles.active}`}
        onMouseDown={handleCircleMouseDown}
        aria-label="Click: drag to size | Hold & drag: fixed size"
        title="Click: drag to size | Hold & drag: fixed size"
      >
        <Circle size={20} strokeWidth={2} />
        <span className={styles.tooltip}>Click or Drag to create</span>
      </button>

      {/* Text Tool - Active */}
      <button
        className={`${styles.toolButton} ${styles.active}`}
        onMouseDown={handleTextMouseDown}
        aria-label="Click: drag to size | Hold & drag: fixed size"
        title="Click: drag to size | Hold & drag: fixed size"
      >
        <Type size={20} strokeWidth={2} />
        <span className={styles.tooltip}>Click or Drag to create</span>
      </button>

      {/* Line Tool - Active */}
      <button
        className={`${styles.toolButton} ${styles.active}`}
        onMouseDown={handleLineMouseDown}
        aria-label="Click: drag to define endpoints | Hold & drag: fixed size"
        title="Click: drag to define endpoints | Hold & drag: fixed size"
      >
        <Minus size={20} strokeWidth={2} />
        <span className={styles.tooltip}>Click or Drag to create</span>
      </button>

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Delete Button - Conditionally Enabled */}
      <button
        className={`${styles.toolButton} ${selectedShape ? styles.delete : styles.disabled}`}
        onClick={handleDeleteClick}
        disabled={!selectedShape}
        aria-label="Delete Selected"
        aria-disabled={!selectedShape}
        title={selectedShape ? "Delete Selected (Del)" : "Select a shape first"}
      >
        <Trash2 size={20} strokeWidth={2} />
        <span className={styles.tooltip}>
          {selectedShape ? "Delete Selected (Del)" : "Select a shape first"}
        </span>
      </button>
      </div>

      {/* Bottom Section - Stress Test & FPS */}
      <div className={styles.bottomSection}>
        {/* FPS Counter */}
        {fps !== undefined && (
          <div className={styles.fpsCounter}>
            <span className={styles.fpsLabel}>FPS</span>
            <span className={styles.fpsValue}>{fps}</span>
          </div>
        )}

        {/* Stress Test Button - Development Only */}
        {import.meta.env.DEV && onStressTest && (
          <button
            className={`${styles.toolButton} ${styles.stress}`}
            onClick={onStressTest}
            aria-label="Stress Test (100 shapes)"
            title="Stress Test (100 shapes)"
          >
            <Zap size={20} strokeWidth={2} />
            <span className={styles.tooltip}>Stress Test (100 shapes)</span>
          </button>
        )}
      </div>
    </div>
  );
}

