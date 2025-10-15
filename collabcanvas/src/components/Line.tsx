import React from 'react';
import { Line as KonvaLine, Group, Circle } from 'react-konva';
import type Konva from 'konva';

interface LineProps {
  id: string;
  x: number;
  y: number;
  width: number;  // Delta X to end point
  height: number; // Delta Y to end point
  fill: string;   // Stroke color
  isSelected: boolean;
  isLocked?: boolean;
  lockedBy?: string;
  currentUserId?: string;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  opacity?: number; // For preview mode
}

const Line = React.memo(({
  id,
  x,
  y,
  width,
  height,
  fill,
  isSelected,
  isLocked,
  lockedBy,
  currentUserId,
  onDragStart,
  onDragEnd,
  onClick,
  opacity = 1,
}: LineProps) => {
  // Match Rectangle's lock check logic
  const isLockedByOther = isLocked && lockedBy !== currentUserId;
  
  // Allow dragging if not locked OR if locked by current user
  const isDraggable = !isLocked || lockedBy === currentUserId;
  
  // Calculate endpoints from stored data
  // x, y = start point, width/height = delta to end point
  const startX = 0;
  const startY = 0;
  const endX = width;
  const endY = height;

  // Determine stroke color based on state (match Rectangle)
  const getStrokeColor = () => {
    if (isSelected) return '#3498db'; // Blue for selected
    if (isLockedByOther) return '#e74c3c'; // Red for locked by another user
    return fill; // Default stroke color
  };

  // Determine stroke width based on state (match Rectangle)
  const getStrokeWidth = () => {
    if (isSelected || isLockedByOther) return 3;
    return 3;
  };

  // Match Rectangle/Circle behavior EXACTLY - use typed Konva events
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage from starting drag
    // NOTE: Do NOT call stage.draggable(false) here! Rectangle/Circle don't do it,
    // and adding it causes conflicts with Konva's drag system.
    // Stage disabling happens in handleShapeDragStart (via onDragStart callback).
  };

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true; // Prevent stage from receiving drag event
    console.log(`[LINE DRAG START] ID: ${id}, Position: (${x}, ${y})`);
    onDragStart(id);
  };

  const handleDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    console.log(`[LINE DRAGGING] ID: ${id}, Position: (${e.target.x().toFixed(2)}, ${e.target.y().toFixed(2)})`);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    // Get the new position directly from the dragged Group (matches Rectangle/Circle behavior)
    const newX = e.target.x();
    const newY = e.target.y();
    
    console.log(`[LINE DRAG END] ID: ${id}, Final Position: (${newX.toFixed(2)}, ${newY.toFixed(2)})`);
    // Pass the new position directly, just like Rectangle and Circle do
    onDragEnd(id, newX, newY);
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage click
    onClick(id);
  };

  // Debug: Check draggability (only log on changes to reduce spam)
  const prevDraggableRef = React.useRef<boolean>(isDraggable);
  
  React.useEffect(() => {
    if (prevDraggableRef.current !== isDraggable) {
      console.log(`[LINE DRAGGABILITY CHANGED] ID: ${id}, isDraggable: ${isDraggable}, isLocked: ${isLocked}, lockedBy: ${lockedBy}`);
      prevDraggableRef.current = isDraggable;
    }
  }, [isDraggable, isLocked, lockedBy, id]);

  return (
    <Group
      x={x}
      y={y}
      draggable={isDraggable}
      onMouseDown={handleMouseDown}
      onDragStart={handleDragStart}
      onDragMove={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Main line */}
      <KonvaLine
        points={[startX, startY, endX, endY]}
        stroke={getStrokeColor()}
        strokeWidth={getStrokeWidth()}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={20} // Makes line easier to click
        opacity={opacity}
      />
      
      {/* Endpoint circles for better visibility when selected */}
      {isSelected && (
        <>
          <Circle
            x={startX}
            y={startY}
            radius={6}
            fill="#3498db"
            stroke="#ffffff"
            strokeWidth={2}
          />
          <Circle
            x={endX}
            y={endY}
            radius={6}
            fill="#3498db"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </>
      )}
      
      {/* Lock indicator - removed for consistency with Rectangle/Circle */}
    </Group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if these props changed
  return (
    prevProps.x === nextProps.x &&
    prevProps.y === nextProps.y &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.fill === nextProps.fill &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isLocked === nextProps.isLocked &&
    prevProps.lockedBy === nextProps.lockedBy
  );
});

Line.displayName = 'Line';

export default Line;

