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
  
  const handleRectangleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingFromToolRef.current = true;
    hasMovedRef.current = false;
    
    // Set up global mouse move and mouse up listeners
    const handleMouseMove = (_e: MouseEvent) => {
      // If mouse moves, switch to fixed-size placement mode
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        if (onStartDragCreate) {
          onStartDragCreate('rectangle');
        }
        cleanup();
      }
    };
    
    const handleMouseUp = () => {
      // If released without moving, enter custom-size drag mode
      if (isDraggingFromToolRef.current && !hasMovedRef.current && onAddShape) {
        onAddShape('rectangle');
      }
      cleanup();
    };
    
    const cleanup = () => {
      isDraggingFromToolRef.current = false;
      hasMovedRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove, { once: false });
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  const handleCircleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingFromToolRef.current = true;
    hasMovedRef.current = false;
    
    // Set up global mouse move and mouse up listeners
    const handleMouseMove = (_e: MouseEvent) => {
      // If mouse moves, switch to fixed-size placement mode
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        if (onStartDragCreate) {
          onStartDragCreate('circle');
        }
        cleanup();
      }
    };
    
    const handleMouseUp = () => {
      // If released without moving, enter custom-size drag mode
      if (isDraggingFromToolRef.current && !hasMovedRef.current && onAddShape) {
        onAddShape('circle');
      }
      cleanup();
    };
    
    const cleanup = () => {
      isDraggingFromToolRef.current = false;
      hasMovedRef.current = false;
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

      {/* Text Tool - Disabled */}
      <button
        className={`${styles.toolButton} ${styles.disabled}`}
        disabled
        aria-label="Text Tool"
        aria-disabled="true"
        title="Coming Soon"
      >
        <Type size={20} strokeWidth={2} />
        <span className={styles.tooltip}>Coming Soon</span>
      </button>

      {/* Line Tool - Disabled */}
      <button
        className={`${styles.toolButton} ${styles.disabled}`}
        disabled
        aria-label="Line Tool"
        aria-disabled="true"
        title="Coming Soon"
      >
        <Minus size={20} strokeWidth={2} />
        <span className={styles.tooltip}>Coming Soon</span>
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

